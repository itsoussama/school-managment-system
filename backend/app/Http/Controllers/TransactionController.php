<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::all();
        return response()->json($transactions);
    }

    public function show($id)
    {
        $transaction = Transaction::findOrFail($id);
        return response()->json($transaction);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'amount' => 'required|numeric',
            'source' => 'required|string',
            'destination' => 'required|string',
            'date' => 'required|date',
        ]);

        $transaction = Transaction::create($validated);
        return response()->json($transaction, 201);
    }

    public function update(Request $request, $id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->type = $request->input('type', $transaction->type);
        $transaction->amount = $request->input('amount', $transaction->amount);
        $transaction->source = $request->input('source', $transaction->source);
        $transaction->destination = $request->input('destination', $transaction->destination);
        $transaction->date = $request->input('date', $transaction->date);
        $transaction->save();

        return response()->json($transaction);
    }
    public function destroy($id)
    {
        Transaction::destroy($id);
        return response()->json(['message' => 'Transaction deleted']);
    }
}
