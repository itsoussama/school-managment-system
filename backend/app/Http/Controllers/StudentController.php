<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        if (auth()->user()->hasRole(config('roles.admin_staff')) || auth()->user()->hasRole(config('roles.admin')) || auth()->user()->hasRole(config('roles.teacher'))) {
            $perPage = $request->input('per_page', 5);
            $sortColumn = $request->input('sort_column', 'id');
            $sortDirection = $request->input('sort_direction', 'asc');
            $school_id = $request->input('school_id');

            $users = Student::with('users', 'grade')
            ->whereHas('users', function ($query) use ($school_id) {
                $query->where('school_id', $school_id);
            })
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage);
            return response()->json($users, Response::HTTP_OK);
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
        return response()->json(Student::all(), 200);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'student_number' => 'required|string|unique:students,student_number',
                'birthdate' => 'required|date',
                'address' => 'nullable|string',
            ]);

            $student = Student::create($validated);

            return response()->json($student, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        }
    }

    public function show($id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        return response()->json($student, 200);
    }

    public function update(Request $request, $id)
    {
        try{
            $student = Student::find($id);

            if (!$student) {
                return response()->json(['error' => 'Student not found'], 404);
            }

            $validated = $request->validate([
                'user_id' => 'sometimes|exists:users,id',
                'student_number' => 'sometimes|string|unique:students,student_number,' . $student->id,
                'birthdate' => 'sometimes|date',
                'address' => 'nullable|string',
            ]);

            $student->update($validated);

            return response()->json($student, 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        }
    }

    public function destroy($id)
    {
        try {
            $student = Student::find($id);

            if (!$student) {
                return response()->json(['error' => 'Student not found'], 404);
            }

            $student->delete();

            return response()->json(['message' => 'Student deleted successfully'], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        }
    }
}
