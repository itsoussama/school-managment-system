<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Http\Request;
use PHPUnit\Framework\Constraint\IsEmpty;

use function PHPUnit\Framework\isNull;

class BudgetController extends Controller
{
    public function index()
    {
        $schoolId = auth()->user()->school_id;
        $perPage = request()->query('per_page', 5);
        $budgets = Budget::with('category')->where('school_id', $schoolId);
        return response()->json($budgets->paginate($perPage));
    }

    public function showBudgetTransactions($id)
    {
        $schoolId = auth()->user()->school_id;
        $budgetId = json_decode($id);
        $budgetTransaction = Transaction::with(['transactionable' => function (MorphTo $morphTo) {
            $morphTo->morphWith([
                Budget::class => ['category'],
            ]);
        }])->whereHasMorph('transactionable', Budget::class, function ($query) use ($schoolId) {
            $query->where('school_id', $schoolId);
        });

        if (!empty($budgetId)) {
            return response()->json($budgetTransaction->whereHasMorph('transactionable', Budget::class, function ($query) use ($id) {
                $query->where('id', $id);
            })->get());
        }
        return response()->json($budgetTransaction->get());
    }

    public function show($id)
    {
        $budget = Budget::findOrFail($id);
        return response()->json($budget);
    }

    public function showBudgetsUsage()
    {
        $schoolId = auth()->user()->school_id;

        $budgets = Budget::where('school_id', $schoolId);

        $TotalAllocatedAmount = "SUM(allocated_amount) as total_allocated";
        $TotalSpentAmount = "SUM(spent_amount) as total_spent";

        $budgetUsage = Budget::selectRaw('YEAR(created_at) as year, WEEK(created_at) as week, ' . $TotalAllocatedAmount . ', ' . $TotalSpentAmount)
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
