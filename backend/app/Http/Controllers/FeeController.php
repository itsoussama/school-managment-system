<?php

namespace App\Http\Controllers;

use App\Models\Fee;
use Illuminate\Http\Request;

class FeeController extends Controller
{
    public function index()
    {
        $schoolId = auth()->user()->school_id;
        $perPage = request()->query('per_page', 5);
        $fees = Fee::with('student.user')->whereHas('student', function ($query) use ($schoolId) {
            $query->whereHas('user', function ($query) use ($schoolId) {
                $query->where('school_id', $schoolId);
            });
        });
        return response()->json($fees->paginate($perPage));
    }


    public function show($id)
    {
        $fee = Fee::findOrFail($id);
        return response()->json($fee);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'amount' => 'required|numeric',
            'status' => 'required|string',
            'due_date' => 'required|date',
            'student_id' => 'required|integer|exists:students,id',
        ]);

        $fee = Fee::create($validated);
        return response()->json($fee, 201);
    }

    public function update(Request $request, $id)
    {
        $fee = Fee::findOrFail($id);
        $fee->type = $request->input('type', $fee->type);
        $fee->amount = $request->input('amount', $fee->amount);
        $fee->status = $request->input('status', $fee->status);
        $fee->due_date = $request->input('due_date', $fee->due_date);
        $fee->student_id = $request->input('student_id', $fee->student_id);
        $fee->save();

        return response()->json($fee);
    }
    public function destroy($id)
    {
        Fee::destroy($id);
        return response()->json(['message' => 'Fee deleted']);
    }
}
