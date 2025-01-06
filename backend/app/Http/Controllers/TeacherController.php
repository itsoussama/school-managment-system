<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\Subject;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    // Fetch all teachers with their associated subjects
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 5);
            $sortColumn = $request->input('sort_column', 'id');
            $sortDirection = $request->input('sort_direction', 'asc');
            $teachers = Teacher::with('subjects', 'user')->orderBy($sortColumn, $sortDirection)->paginate($perPage);
            return response()->json($teachers, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch teachers', 'message' => $e->getMessage()], 500);
        }
    }

    // Store a new teacher and optionally associate subjects
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'teacher_number' => 'required|string|unique:teachers,teacher_number',
                'birthdate' => 'required|date',
                'address' => 'nullable|string',
                'phone' => 'required|string',
                'subjects' => 'required|array',
                'subjects.*' => 'exists:subjects,id',
            ]);

            $teacher = Teacher::create($validated);

            if (isset($validated['subjects'])) {
                $teacher->subjects()->attach($validated['subjects']);
            }

            return response()->json($teacher->load('subjects', 'user'), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create teacher', 'message' => $e->getMessage()], 500);
        }
    }

    // Fetch a single teacher with their subjects
    public function show($id)
    {
        try {
            $teacher = Teacher::with('subjects')->findOrFail($id);
            return response()->json($teacher, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Teacher not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch teacher', 'message' => $e->getMessage()], 500);
        }
    }

    // Update a teacher and modify associated subjects
    public function update(Request $request, $id)
    {
        try {
            $teacher = Teacher::findOrFail($id);

            $validated = $request->validate([
                'teacher_number' => 'sometimes|string|unique:teachers,teacher_number,' . $teacher->id,
                'birthdate' => 'sometimes|date',
                'address' => 'nullable|string',
                'phone' => 'nullable|string',
                'subjects' => 'nullable|array',
                'subjects.*' => 'exists:subjects,id',
            ]);

            $teacher->update($validated);

            if (isset($validated['subjects'])) {
                $teacher->subjects()->sync($validated['subjects']);
            }

            return response()->json($teacher->load('subjects'), 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Teacher not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update teacher', 'message' => $e->getMessage()], 500);
        }
    }

    // Delete a teacher and dissociate subjects
    public function destroy($id)
    {
        try {
            $teacher = Teacher::findOrFail($id);
            $teacher->subjects()->detach(); // Optional: Remove associations
            $teacher->delete();

            return response()->json(['message' => 'Teacher deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Teacher not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete teacher', 'message' => $e->getMessage()], 500);
        }
    }

    // Attach subjects to a teacher
    public function attachSubjects(Request $request, $id)
    {
        try {
            $teacher = Teacher::findOrFail($id);

            $validated = $request->validate([
                'subjects' => 'required|array',
                'subjects.*' => 'exists:subjects,id',
            ]);

            $teacher->subjects()->attach($validated['subjects']);

            return response()->json($teacher->load('subjects'), 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Teacher not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to attach subjects', 'message' => $e->getMessage()], 500);
        }
    }

    // Detach subjects from a teacher
    public function detachSubjects(Request $request, $id)
    {
        try {
            $teacher = Teacher::findOrFail($id);

            $validated = $request->validate([
                'subjects' => 'required|array',
                'subjects.*' => 'exists:subjects,id',
            ]);

            $teacher->subjects()->detach($validated['subjects']);

            return response()->json($teacher->load('subjects'), 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Teacher not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to detach subjects', 'message' => $e->getMessage()], 500);
        }
    }
}
