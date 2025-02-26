<?php

namespace App\Http\Controllers;

use App\Models\TransactionDetail;
use Illuminate\Http\Request;

class TransactionDetailController extends Controller
{
    public function index()
    {
        $details = TransactionDetail::with(['transaction', 'budget', 'fee', 'payroll'])->get();
        return response()->json($details);
    }

    public function show($id)
    {
        $detail = TransactionDetail::findOrFail($id);
        return response()->json($detail);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'transaction_id' => 'required|integer|exists:transactions,id',
            'budget_id' => 'required|integer|exists:budget,id',
            'reference_type' => 'required|string',
            'fee_id' => 'nullable|integer|exists:fee,id',
            'payroll_id' => 'nullable|integer|exists:payroll,id',
        ]);

        $detail = TransactionDetail::create($validated);
        return response()->json($detail, 201);
    }

    public function update(Request $request, $id)
    {
        $detail = TransactionDetail::findOrFail($id);
        $detail->transaction_id = $request->input('transaction_id', $detail->transaction_id);
        $detail->budget_id = $request->input('budget_id', $detail->budget_id);
        $detail->reference_type = $request->input('reference_type', $detail->reference_type);
        $detail->fee_id = $request->input('fee_id', $detail->fee_id);
        $detail->payroll_id = $request->input('payroll_id', $detail->payroll_id);
        $detail->save();

        return response()->json($detail);
    }

    public function destroy($id)
    {
        TransactionDetail::destroy($id);
        return response()->json(['message' => 'Transaction Detail deleted']);
    }

    public function showTransactionDetailsByType()
    {
        $type = request()->query('type', 'fee');
        if ($type === 'budget') {
            $details = TransactionDetail::with(['transaction', 'budget.category'])->has($type)->get();
            return response()->json($details);
        }
        $details = TransactionDetail::with(['transaction', $type])->has($type)->get();
        return response()->json($details);
    }
}
