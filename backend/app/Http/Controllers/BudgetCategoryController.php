<?php

namespace App\Http\Controllers;

use App\Models\BudgetCategory;
use Illuminate\Http\Request;

class BudgetCategoryController extends Controller
{
    public function index()
    {
        $categories = BudgetCategory::all();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $category = BudgetCategory::create($request->all());
        return response()->json($category, 201);
    }

    public function show($id)
    {
        $category = BudgetCategory::findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = BudgetCategory::findOrFail($id);
        $category->update($request->all());
        return response()->json($category);
    }

    public function destroy($id)
    {
        BudgetCategory::destroy($id);
        return response()->json(['message' => 'Category deleted']);
    }
}
