<?php

namespace App\Http\Controllers;

use App\Models\Division;
use Illuminate\Http\Request;

class DivisionController extends Controller
{
    public function index()
    {
        return Division::with('services')->get();
    }

    public function show($id)
    {
        return Division::with('services')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'entite_prefecture_id' => 'required|exists:entite_prefectures,id',
        ]);
        return Division::create($data);
    }

    public function update(Request $request, $id)
    {
        $division = Division::findOrFail($id);
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'entite_prefecture_id' => 'required|exists:entite_prefectures,id',
        ]);
        $division->update($data);
        return $division;
    }

    public function destroy($id)
    {
        $division = Division::findOrFail($id);
        $division->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}
