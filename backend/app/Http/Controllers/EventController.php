<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
// Show all events
    public function index()
    {

        $events = Event::whereHas('users', function ($query) {
            $query->where('user_id', Auth::id());
        })->get();
        return response()->json($events);
    }
    public function show_all()
    {
        $events = Event::with('users')->get();
        return response()->json($events);
    }

    public function show($id)
    {
        $event = Event::with('users')->findOrFail($id);
        return response()->json($event);
    }

    // Store a new event
    public function store(Request $request)
    {
        try {
        $request->validate([
            'title' => 'required|string|max:255',
            'start' => 'required|date',
            'end' => 'required|date|after:start',
            'assign_to' => 'required|array',
            'assign_to.*' => 'exists:users,id',
        ]);

        $event = Event::create([
            'title' => $request->title,
            'start' => $request->start,
            'end' => $request->end,
        ]);

        // Attach users to the event
        $event->users()->sync($request->assign_to);

        return response()->json($event, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        }
    }

    // Update an event
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'start' => 'required|date',
            'end' => 'required|date|after:start',
            'assign_to' => 'required|array',
            'assign_to.*' => 'exists:users,id',
        ]);

        $event = Event::findOrFail($id);
        $event->update([
            'title' => $request->title,
            'start' => $request->start,
            'end' => $request->end,
        ]);

        $event->users()->sync($request->assign_to);

        return response()->json($event);
    }

    // Delete an event
    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return response()->json(null, 204);
    }
}
