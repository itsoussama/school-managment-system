<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\Eloquent\Builder;


class GroupController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 5);
            $sortColumn = $request->input('sort_column', 'id');
            $sortDirection = $request->input('sort_direction', 'asc');
            $school_id = $request->input('school_id');
            $groups = Group::with('students', 'grade')->where('school_id', $school_id)->orderBy($sortColumn, $sortDirection);
            if ($perPage == -1) {
                return response()->json($groups->get(), Response::HTTP_OK);
            }

            return response()->json($groups->paginate($perPage), Response::HTTP_OK);
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
                'school_id' => 'required|exists:schools,id',
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

    public function update(Request $request, Group $group)
    {
        try {
            // $group = Group::findOrFail($id);

            $request->validate([
                // 'name' => 'sometimes|string|unique:groups,name,' . $group->id,
                'name' => 'sometimes|string',
                'grade_id' => 'sometimes|exists:grades,id',
                'school_id' => 'sometimes|exists:schools,id',
                'students' => 'nullable|array',
                'students.*' => 'exists:users,id',
                'teachers' => 'nullable|array',
                'teachers.*' => 'exists:users,id',
            ]);

            $selectedStudents = $request->input('students', []); // Students from request
            $selectedTeachers = $request->input('teachers', []); // teachers from request
            $groupId = $group->id;
            $schoolId = auth()->user()->school_id; // Get the authenticated user's school

            // Get current students and teachers in this group that belong to the same school
            $currentStudents = Student::where('group_id', $groupId)
                ->whereHas('user', function ($query) use ($schoolId) {
                    $query->where('school_id', $schoolId);
                })
                ->pluck('user_id')
                ->toArray();

            $currentTeachers = Teacher::whereHas('groups', fn(Builder $query) => $query->where('groups.id', $groupId))
                ->whereHas('user', function ($query) use ($schoolId) {
                    $query->where('school_id', $schoolId);
                })
                ->pluck('user_id')
                ->toArray();

            // Find students to remove (currently in the group but NOT in the request)
            $studentsRemoveFromGroup = array_diff($currentStudents, $selectedStudents);

            // Find students to add (those in the request but NOT currently in the group)
            $studentsAddToGroup = array_diff($selectedStudents, $currentStudents);

            // Remove students from the group (set group_id to null) - Only for the same school
            Student::whereIn('user_id', $studentsRemoveFromGroup)
                ->update(['group_id' => null]);

            // Add new students to the group - Only for the same school
            Student::whereIn('user_id', $studentsAddToGroup)
                ->update(['group_id' => $groupId]);

            $teachersAddToGroup = array_diff($selectedTeachers, $currentTeachers);
            $teachersRemoveFromGroup = array_diff($currentTeachers, $selectedTeachers);


            $validTeachers = Teacher::whereIn('user_id', $teachersAddToGroup)->pluck('id')->toArray();
            $validTeachersToRemove = Teacher::whereIn('user_id', $teachersRemoveFromGroup)->pluck('id')->toArray();

            info($validTeachersToRemove);

            $group->teachers()->attach($validTeachers);
            $group->teachers()->detach($validTeachersToRemove);

            $group->update($request->only(['name', 'grade_id', 'school_id']));

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

    public function groupsWithoutGrade(Request $request)
    {
        try {
            $school_id = $request->input('school_id');
            $groups = Group::whereDoesntHave('grade')->with('students')->where('school_id', $school_id)->get();

            return response()->json($groups, Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch groups', 'message' => $e->getMessage()], 500);
        }
    }

    public function showGradeGroup(Request $request)
    {
        $grade_id = $request->input('grade_id');
        $group_id = $request->input('group_id');

        if (isset($grade_id, $group_id)) {
            $group = Group::with(['grade', 'students.user', 'teachers.user'])->find($group_id);
            return response()->json($group, Response::HTTP_OK);
        }
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
