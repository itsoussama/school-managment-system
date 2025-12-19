<?php

namespace App\Http\Controllers;

use App\Models\Calendar;
use Error;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CalendarController extends Controller
{
    public function index()
    {
        info(request('user_type', 'administrators'));
        $query = Calendar::with('school')->whereHas(request('user_type', 'administrators'), function ($q) {
            $q->where('calendarable_type', 'App\\Models\\' . trim(ucfirst(request('user_type', 'administrators')), 's'));
        });

        if (request()->has('teacher_id')) {
            $query->whereHasMorph('teachers', 'App\Models\Teacher', function ($q) {
                $q->where('user_id', request()->teacher_id);
            })->with(['teachers.user', 'grades', 'group', 'classroom']);
        }

        if (request()->has('student_id')) {
            $query->whereHasMorph('students', 'App\Models\Student', function ($q) {
                $q->where('user_id', request()->teacher_id);
            })->with(['students.user', 'group', 'classroom']);
        }

        if (request()->has('administrator_id')) {
            $query->whereHasMorph('administrators', 'App\Models\Administrator', function ($q) {
                $q->where('user_id', request()->teacher_id);
            })->with(['administrators.user', 'group', 'classroom']);
        }

        if (request()->has('subject_id')) {
            $query->where('subject_id', request()->subject_id);
        }

        if (request()->has('classroom_id')) {
            $query->where('classroom_id', request()->classroom_id);
        }

        return response()->json($query->get(), Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'teacher_id' => 'required_without_all:student_id,administrator_id|exists:teachers,id',
                'student_id' => 'required_without_all:teacher_id,administrator_id|exists:students,id',
                'administrator_id' => 'required_without_all:teacher_id,student_id|exists:administrators,id',
                'group_id' => 'required|exists:groups,id',
                'classroom_id' => 'required|exists:class_rooms,id',
                'subject_id' => 'required|exists:subjects,id',
                'event_type' => 'required|in:timetable,exam,meeting,holiday',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string|max:255',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
                "school_id" => 'required|exists:schools,id',
            ]);

            if ($validated) {

                $calendar = Calendar::create(
                    [
                        'school_id' => auth()->user()->school_id,
                        'group_id' => $request->group_id,
                        'classroom_id' => $request->classroom_id,
                        'subject_id' => $request->subject_id,
                        'title' => $request->title,
                        'description' => 'test',
                        'start_date' => $request->start_date,
                        'end_date' => $request->end_date,
                    ]
                );


                if ($request->has("teacher_id")) {
                    $calendar->teachers()->attach(
                        $request->teacher_id,
                    );
                }
                if ($request->has('student_id')) {
                    $calendar->students()->attach(
                        $request->student_id
                    );
                }
                if ($request->has('administrator_id')) {
                    $calendar->administrators()->attach($request->administrator_id);
                }
            } else {
                throw new Error("Validation failed");
            }

            return response()->json('created', Response::HTTP_CREATED);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(Calendar $calendar)
    {
        return $calendar->load(['teacher', 'group', 'classroom', 'subject']);
        return response()->json($calendar->get(), Response::HTTP_OK);
    }

    public function update(Request $request, Calendar $calendar)
    {
        $validated = $request->validate([
            'teacher_id' => 'required_without_all:student_id,administrator_id|exists:teachers,id',
            'student_id' => 'required_without_all:teacher_id,administrator_id|exists:students,id',
            'administrator_id' => 'required_without_all:teacher_id,student_id|exists:administrators,id',
            'group_id' => 'required|exists:groups,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id' => 'required|exists:subjects,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $calendar->update($validated);

        if ($request->has("teacher_id")) {
            $calendar->calendarable()->sync([
                'calendarable_id' => $request->teacher_id,
                'calendarable_type' => 'App\Models\Teacher'
            ]);
        }
        if ($request->has('student_id')) {
            $calendar->calendarable()->sync([
                'calendarable_id' => $request->student_id,
                'calendarable_type' => 'App\Models\Student'
            ]);
        }
        if ($request->has('administrator_id')) {
            $calendar->calendarable()->sync([
                'calendarable_id' => $request->administrator_id,
                'calendarable_type' => 'App\Models\Administrator'
            ]);
        }


        return response()->json(Response::HTTP_CREATED);
    }

    public function destroy(Calendar $calendar)
    {
        $calendar->delete();

        return response()->json(Response::HTTP_NO_CONTENT);
    }
}
