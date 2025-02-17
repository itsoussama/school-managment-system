<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function index()
    {
        $budgets = Budget::with('category')->get();
        return response()->json($budgets);
    }

    public function show($id)
    {
        $budget = Budget::findOrFail($id);
        return response()->json($budget);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'allocated_amount' => 'required|numeric',
            'spent_amount' => 'required|numeric',
            'category_id' => 'required|integer|exists:budget_categories,id',
            'remaining_amount' => 'required|numeric',
            'school_id' => 'required|integer',
        ]);

        $budget = Budget::create($validated);
        return response()->json($budget, 201);
    }

    public function update(Request $request, $id)
    {
        $budget = Budget::findOrFail($id);
        $budget->allocated_amount = $request->input('allocated_amount', $budget->allocated_amount);
        $budget->spent_amount = $request->input('spent_amount', $budget->spent_amount);
        $budget->category_id = $request->input('category_id', $budget->category_id);
        $budget->remaining_amount = $request->input('remaining_amount', $budget->remaining_amount);
        $budget->school_id = $request->input('school_id', $budget->school_id);
        $budget->save();

        return response()->json($budget);
    }
    public function destroy($id)
    {
        Budget::destroy($id);
        return response()->json(['message' => 'Budget deleted']);
    }
}
