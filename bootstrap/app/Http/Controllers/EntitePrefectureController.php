<?php

namespace App\Http\Controllers;

use App\Models\EntitePrefecture;
use Illuminate\Http\Request;

class EntitePrefectureController extends Controller
{
    public function index()
    {
        return EntitePrefecture::with('divisions')->get();
    }

    public function show($id)
    {
        return EntitePrefecture::with('divisions')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate(['nom' => 'required|string|max:255']);
        return EntitePrefecture::create($data);
    }

    public function update(Request $request, $id)
    {
        $entite = EntitePrefecture::findOrFail($id);
        $data = $request->validate(['nom' => 'required|string|max:255']);
        $entite->update($data);
        return $entite;
    }

    public function destroy($id)
    {
        $entite = EntitePrefecture::findOrFail($id);
        $entite->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}
