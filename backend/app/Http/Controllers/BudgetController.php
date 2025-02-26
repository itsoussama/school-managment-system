<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function index()
    {
        $schoolId = auth()->user()->school_id;
        $perPage = request()->query('per_page', 5);
        $budgets = Budget::with('category')->where('school_id', $schoolId);
        return response()->json($budgets->paginate($perPage));
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


    public function getBudgetsUsage()
    {
        $schoolId = auth()->user()->school_id;

        $budgets = Budget::where('school_id', $schoolId);
        $budgetUsage = Budget::selectRaw('YEAR(created_at) as year, WEEK(created_at) as week, SUM(allocated_amount) as total_allocated, SUM(spent_amount) as total_spent')
            ->where('school_id', $schoolId)
            ->where('created_at', '>=', now()->subWeeks(6)->startOfWeek())
            ->groupBy('year', 'week')
            ->orderBy('year')
            ->orderBy('week')
            ->get();

        $formattedData = $budgetUsage->map(function ($item, $key) {
            return [
                'week' => "Week " . $key + 1,
                'total_allocated' => round($item->total_allocated, 2),
                'total_spent' => round($item->total_spent, 2),
            ];
        });

        return response()->json(['budget' => ['date' => $formattedData->pluck('week')->toArray(), 'budget_allocated' => $formattedData->pluck('total_allocated')->toArray(), 'budget_spent' => $formattedData->pluck('total_spent')->toArray()], 'total_allocation' => $budgets->sum('allocated_amount'), 'total_spent' => $budgets->sum('spent_amount'), 'total_remaining' => $budgets->sum('remaining_amount')]);
    }
}
