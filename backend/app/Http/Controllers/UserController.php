<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('school', 'role')->get();
        return response()->json($users, Response::HTTP_OK);
    }

    // Show the form for creating a new resource (not typically used in APIs)
    public function store(Request $request)
    {

        try{
            $validation = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'school_id' => 'required|exists:schools,id',
                'roles' => 'required|array',
                'roles.*' => 'exists:roles,id',
            ]);
            if ($validation) {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => bcrypt($request->password),
                ]);
                $user->school()->associate($request->school_id);
                $user->role()->sync($request->roles);
                $user->save();
            }else {
                return $request;
            }


            return response()->json($user, Response::HTTP_CREATED);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        }
    }

    // Display the specified resource
    public function show(User $user)
    {
        $user->load('school', 'role');
        return response()->json($user, Response::HTTP_OK);
    }

    // Update the specified resource in storage
    public function update(Request $request, User $user)
    {
        try {
                // Validate incoming request
                $request->validate([
                    'name' => 'nullable|string|max:255',
                    'email' => 'nullable|string|email|max:255|unique:users,email,' . $user->id,
                    'password' => 'nullable|string|min:8|confirmed',
                    'school_id' => 'nullable|exists:schools,id',
                    'roles' => 'nullable|array',  // Array of role IDs
                    'roles.*' => 'exists:roles,id', // Each role ID should exist
                ]);

                // Update user attributes
                $user->name = $request->input('name', $user->name);
                $user->email = $request->input('email', $user->email);

                // If password is provided, hash and update it
                if ($request->filled('password')) {
                    $user->password = bcrypt($request->input('password'));
                }

                // Update the school_id if provided
                if ($request->filled('school_id')) {
                    $user->school_id = $request->input('school_id');
                }

                // Save the user with updated attributes
                $user->save();

                // Sync roles if provided
                if ($request->has('role')) {
                    $user->role()->sync($request->input('role'));
                }

                // Load relationships and return response
                $user->load('school', 'role');

        return response()->json($user, Response::HTTP_OK);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        }
    }

    // Remove the specified resource from storage
    public function destroy(User $user)
    {
        // Detach roles if necessary
        $user->role()->detach();

        // Delete the user
        $user->delete();

    // Return a response indicating success
    return response()->json(['message' => 'User deleted successfully'], Response::HTTP_OK);
    }
}
