<?php

namespace App\Http\Controllers;

use App\Models\Parents;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ParentsController extends Controller
{
    public function index(Request $request)
    {
        if (auth()->user()->hasRole(config('roles.admin_staff')) || auth()->user()->hasRole(config('roles.admin'))) {
            $perPage = $request->input('per_page', 5);
            $sortColumn = $request->input('sort_column', 'id');
            $sortDirection = $request->input('sort_direction', 'asc');
            $school_id = $request->input('school_id');

            $users = Parents::with('users')
            ->whereHas('users', function ($query) use ($school_id) {
                $query->where('school_id', $school_id);
            })
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage);
            return response()->json($users, Response::HTTP_OK);
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
        return response()->json(Parents::all(), 200);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',

            ]);

            $Parents = Parents::create($validated);

            return response()->json($Parents, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        }
    }

    public function show($id)
    {
        $Parents = Parents::find($id);

        if (!$Parents) {
            return response()->json(['error' => 'Parents not found'], 404);
        }

        return response()->json($Parents, 200);
    }

    public function update(Request $request, $id)
    {
        try{
            $Parents = Parents::find($id);

            if (!$Parents) {
                return response()->json(['error' => 'Parents not found'], 404);
            }

            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
            ]);

            $Parents->update($validated);

            return response()->json($Parents, 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        }
    }

    public function destroy($id)
    {
        try {
            $Parents = Parents::find($id);

            if (!$Parents) {
                return response()->json(['error' => 'Parents not found'], 404);
            }

            $Parents->delete();

            return response()->json(['message' => 'Parents deleted successfully'], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        }
    }
}
