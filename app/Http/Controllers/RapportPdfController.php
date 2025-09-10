<?php

namespace App\Http\Controllers;

use App\Models\RapportPdf;
use Illuminate\Http\Request;

class RapportPdfController extends Controller
{
    public function index()
    {
        return RapportPdf::with('user')->get();
    }

    public function show($id)
    {
        return RapportPdf::with('user')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre' => 'required|string|max:255',
            'chemin_fichier' => 'required|string',
            'user_id' => 'required|exists:users,id',
        ]);
        return RapportPdf::create($data);
    }

    public function update(Request $request, $id)
    {
        $rapport = RapportPdf::findOrFail($id);
        $data = $request->validate([
            'titre' => 'required|string|max:255',
            'chemin_fichier' => 'required|string',
            'user_id' => 'required|exists:users,id',
        ]);
        $rapport->update($data);
        return $rapport;
    }

    public function destroy($id)
    {
        $rapport = RapportPdf::findOrFail($id);
        $rapport->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}
