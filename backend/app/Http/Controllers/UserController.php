<?php

namespace App\Http\Controllers;

use App\Exports\UsersExport;
use App\Imports\UsersImport;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Facades\Excel;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if (auth()->user()->hasRole(config('roles.admin')) || auth()->user()->hasRole(config('roles.teacher'))) {
            $perPage = $request->input('per_page', 5);
            $sortColumn = $request->input('sort_column', 'id');
            $sortDirection = $request->input('sort_direction', 'asc');

            $users = User::with('school', 'role', 'subjects')->orderBy($sortColumn, $sortDirection)->paginate($perPage);
            return response()->json($users, Response::HTTP_OK);
        }else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);

        }
    }
    public function teachers(Request $request)
    {
        if (auth()->user()->hasRole(config('roles.admin'))) {
            $perPage = $request->input('per_page', 5);
            info($request);
            // Get sort parameters from request
            $sortColumn = $request->input('sort_column', 'id');
            $sortDirection = $request->input('sort_direction', 'asc');

            $users = User::with('school', 'role', 'subjects')->whereHas('role', function ($query) {
                $query->where('name', config('roles.teacher'));
            }

            )->orderBy($sortColumn, $sortDirection)->paginate($perPage);
            return response()->json($users, Response::HTTP_OK);
        }else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);

        }
    }
    public function students(Request $request)
    {
        if (auth()->user()->hasRole(config('roles.admin'))) {
            $perPage = $request->input('per_page', 5);
            info($request);
            // Get sort parameters from request
            $sortColumn = $request->input('sort_column', 'id');
            $sortDirection = $request->input('sort_direction', 'asc');

            $users = User::with('school', 'role', 'subjects')->whereHas('role', function ($query) {
                $query->where('name', config('roles.student'));
            }

            )->orderBy($sortColumn, $sortDirection)->paginate($perPage);
            return response()->json($users, Response::HTTP_OK);
        }else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);

        }
    }

    // Show the form for creating a new resource (not typically used in APIs)
    public function store(Request $request)
    {

        if (auth()->user()->hasRole(config('roles.admin'))) {
            try{
                $validation = $request->validate([
                    'name' => 'required|string|max:255',
                    'email' => 'required|string|email|max:255|unique:users',
                    'phone' => 'required|string|max:255',
                    'password' => 'required|string|min:8|confirmed',
                    'school_id' => 'required|exists:schools,id',
                    'roles' => 'required|array',
                    'roles.*' => 'exists:roles,id',
                ]);
                if ($validation) {
                    $user = User::create([
                        'name' => $request->name,
                        'email' => $request->email,
                        'phone' => $request->phone,
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
    }else {
        return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);

    }
    }

    // Display the specified resource
    public function show(User $user)
    {
        if (auth()->user()->hasRole(config('roles.admin'))) {
            $user->load('school', 'role');
            return response()->json($user, Response::HTTP_OK);
        }else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);

        }
    }

    // Update the specified resource in storage
    public function update(Request $request, User $user)
    {
        if (auth()->user()->hasRole(config('roles.admin'))) {
        try {
                // Validate incoming request
                $request->validate([
                    'name' => 'nullable|string|max:255',
                    'email' => 'nullable|string|email|max:255|unique:users,email,' . $user->id,
                    'phone' => 'required|string|max:255',
                    'password' => 'nullable|string|min:8|confirmed',
                    'school_id' => 'nullable|exists:schools,id',
                    'roles' => 'nullable|array',
                    'roles.*' => 'exists:roles,id',
                ]);

                $user->name = $request->input('name', $user->name);
                $user->email = $request->input('email', $user->email);
                $user->phone = $request->input('phone', $user->phone);

                if ($request->filled('password')) {
                    $user->password = bcrypt($request->input('password'));
                }

                // Update the school_id if provided
                if ($request->filled('school_id')) {
                    $user->school_id = $request->input('school_id');
                }

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
    }else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);

        }
    }

    public function destroy(User $user)
    {
        if (auth()->user()->hasRole(config('roles.admin'))) {
        $user->role()->detach();

        $user->delete();


        return response()->json(['message' => 'User deleted successfully'], Response::HTTP_OK);
    }else {
        return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);

    }
    }
    public function export()
    {
        return Excel::download(new UsersExport, 'users.xlsx');
    }

    public function import(Request $request)
    {
        try {
        $request->validate([
            'file' => 'required|mimes:xlsx',
        ]);

        Excel::import(new UsersImport, $request->file('file'));

        return response()->json(['success' => 'Users Imported Successfully']);
        }catch(ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed for some rows.',
                'error' => $e->errors()
            ], 422);
        }
    }
}
