<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 5);
            $sortColumn = $request->input('sort_column', 'id');
            $sortDirection = $request->input('sort_direction', 'asc');
            $school_id = $request->input('school_id');
            $groups = Group::with('students', 'grade')->where('school_id', $school_id)->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage);
            return response()->json($groups, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch groups', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|unique:groups,name',
                'grade_id' => 'required|exists:grades,id',
            ]);

            $group = Group::create($validated);

            return response()->json($group, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create group', 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $group = Group::with('students')->findOrFail($id);
            return response()->json($group, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Group not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch group', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $group = Group::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string|unique:groups,name,' . $group->id,
                'grade_id' => 'sometimes|exists:grades,id',
            ]);

            $group->update($validated);

            return response()->json($group, 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Group not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update group', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $group = Group::findOrFail($id);
            $group->delete();

            return response()->json(['message' => 'Group deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Group not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete group', 'message' => $e->getMessage()], 500);
        }
    }
}
