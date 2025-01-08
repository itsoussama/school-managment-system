<?php

namespace App\Http\Controllers;

use App\Models\Calendar;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    public function index()
    {
        return Calendar::with(['teacher', 'group', 'classroom', 'subject', 'school'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'group_id' => 'required|exists:groups,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id' => 'required|exists:subjects,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        return Calendar::create($validated);
    }

    public function show(Calendar $calendar)
    {
        return $calendar->load(['teacher', 'group', 'classroom', 'subject']);
    }

    public function update(Request $request, Calendar $calendar)
    {
        $validated = $request->validate([
            'teacher_id' => 'sometimes|exists:teachers,id',
            'group_id' => 'sometimes|exists:groups,id',
            'classroom_id' => 'sometimes|exists:classrooms,id',
            'subject_id' => 'sometimes|exists:subjects,id',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
        ]);

        $calendar->update($validated);

        return $calendar;
    }

    public function destroy(Calendar $calendar)
    {
        $calendar->delete();

        return response()->noContent();
    }
}
