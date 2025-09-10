<?php

namespace App\Http\Controllers;

use App\Models\ReponseDemande;
use Illuminate\Http\Request;

class ReponseDemandeController extends Controller
{
    public function index()
    {
        return ReponseDemande::with(['demande', 'admin'])->get();
    }

    public function show($id)
    {
        return ReponseDemande::with(['demande', 'admin'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'contenu' => 'required|string',
            'demande_id' => 'required|exists:demandes,id|unique:reponse_demandes,demande_id',
            'admin_id' => 'required|exists:users,id',
        ]);
        return ReponseDemande::create($data);
    }

    public function update(Request $request, $id)
    {
        $reponse = ReponseDemande::findOrFail($id);
        $data = $request->validate([
            'contenu' => 'required|string',
            'demande_id' => 'required|exists:demandes,id|unique:reponse_demandes,demande_id,' . $id,
            'admin_id' => 'required|exists:users,id',
        ]);
        $reponse->update($data);
        return $reponse;
    }

    public function destroy($id)
    {
        $reponse = ReponseDemande::findOrFail($id);
        $reponse->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}
