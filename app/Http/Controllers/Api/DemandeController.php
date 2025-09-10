<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Demande;
use App\Models\ReponseDemande;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class DemandeController extends Controller
{
    public function __construct()
    {
        // Middleware pour protéger les actions sensibles
        $this->middleware('auth:sanctum');
        $this->middleware('admin')->only(['destroy', 'respond']);
    }

    // Lister toutes les demandes (admin) ou les demandes de l'utilisateur connecté
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $query = Demande::with(['user', 'service', 'reponse']);
        if (!$user->is_admin) {
            $query->where('user_id', $user->id);
        }
        $demandes = $query->orderByDesc('created_at')->get();
        return response()->json(['success' => true, 'data' => $demandes]);
    }

    // Créer une demande
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'objet' => 'required|string|max:255',
            'contenu' => 'required|string',
            'service_id' => 'required|exists:services,id',
        ]);
        $demande = Demande::create(array_merge($validated, [
            'user_id' => Auth::id(),
        ]));
        return response()->json(['success' => true, 'data' => $demande], 201);
    }

    // Afficher une demande
    public function show($id): JsonResponse
    {
        $demande = Demande::with(['user', 'service', 'reponse'])->findOrFail($id);
        $user = Auth::user();
        if (!$user->is_admin && $demande->user_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }
        return response()->json(['success' => true, 'data' => $demande]);
    }

    // Update une demande (PUT /api/demandes/{id})
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
            // user_id optionnel — prend l'utilisateur authentifié si nécessaire
        ]);

        $demande->update($data);

        return response()->json(['data' => $demande], 200);
    }

    // Supprimer une demande (DELETE /api/demandes/{id})
    public function destroy($id)
    {
        $demande = Demande::find($id);
        if (! $demande) {
            return response()->json(['error' => 'Demande introuvable'], 404);
        }

        $demande->delete();

        return response()->json(['message' => 'Supprimé'], 200);
    }

    // Répondre à une demande (POST /api/demandes/{id}/respond)
    public function respond(Request $request, $id)
    {
        $demande = Demande::find($id);
        if (! $demande) {
            return response()->json(['error' => 'Demande introuvable'], 404);
        }

        $data = $request->validate([
            'contenu' => 'required|string',
        ]);

        $userId = $request->user() ? $request->user()->id : null;

        // suppose relation reponse() existe (hasOne). Ajuster si nécessaire.
        $reponse = $demande->reponse()->create([
            'contenu' => $data['contenu'],
            'user_id' => $userId,
        ]);

        return response()->json(['data' => $reponse], 201);
    }
}
