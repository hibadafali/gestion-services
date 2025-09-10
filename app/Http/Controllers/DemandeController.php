<?php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Demande;

class DemandeController extends Controller
{
    public function index()
    {
        return Demande::with(['service', 'user', 'reponse'])->get();
    }

    public function show($id)
    {
        return Demande::with(['service', 'user', 'reponse'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'objet' => 'required|string|max:255',
            'contenu' => 'required|string',
            'service_id' => 'required|exists:services,id',
            'user_id' => 'required|exists:users,id',
        ]);
        $demande = Demande::create($data);
        return response()->json(['data' => $demande], 201);
    }

    // Ajout de la méthode update pour l'API
    public function update(Request $request, $id)
    {
        $demande = Demande::find($id);
        if (! $demande) {
            return response()->json(['error' => 'Demande introuvable'], 404);
        }

        $data = $request->validate([
            'objet' => 'required|string|max:255',
            'contenu' => 'required|string',
            'service_id' => 'required|exists:services,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $demande->update($data);

        return response()->json(['data' => $demande], 200);
    }

    // Ajout de la méthode destroy (DELETE) pour l'API
    public function destroy($id)
    {
        $demande = Demande::find($id);
        if (! $demande) {
            return response()->json(['error' => 'Demande introuvable'], 404);
        }

        $demande->delete();

        return response()->json(['message' => 'Supprimé'], 200);
    }

        public function respond(Request $request, $id)
    {
        $demande = Demande::find($id);
        if (! $demande) {
            return response()->json(['error' => 'Demande introuvable'], 404);
        }

        $data = $request->validate([
            'contenu' => 'required|string',
        ]);

        // crée ou met à jour la réponse liée (suppose la relation 'reponse' existante sur Demande)
        // le user_id de la réponse est pris depuis la requête authentifiée si disponible
        $userId = $request->user() ? $request->user()->id : null;

        // create relation (si hasOne relation)
        $reponse = $demande->reponse()->create([
            'contenu' => $data['contenu'],
            'user_id' => $userId,
        ]);

        return response()->json(['data' => $reponse], 201);
    }
}
// ...existing code...