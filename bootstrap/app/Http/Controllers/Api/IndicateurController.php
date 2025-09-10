<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Indicateur;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class IndicateurController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('admin')->except(['index', 'show']);
    }

    // Lister les indicateurs
    public function index(Request $request): JsonResponse
    {
        $indicateurs = Indicateur::orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $indicateurs]);
    }

    // Créer un indicateur (admin)
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'valeur' => 'required|numeric',
            'type' => 'required|string|max:255',
            'mois' => 'nullable|integer|min:1|max:12',
            'annee' => 'nullable|integer|min:2000',
            'service_id' => 'required|integer|exists:services,id',
        ]);

        // Build a JSON structure for the 'valeurs' column.
        // You can adapt structure to your clients expectations.
        $entry = [
            'valeur' => (float) $validated['valeur'],
        ];
        if (isset($validated['mois'])) $entry['mois'] = (int) $validated['mois'];
        if (isset($validated['annee'])) $entry['annee'] = (int) $validated['annee'];

        $valeurs = ['history' => [$entry]];
        // If client already sent a structured 'valeurs' JSON, prefer it:
        if ($request->filled('valeurs')) {
            $valeurs = is_string($request->input('valeurs')) ? json_decode($request->input('valeurs'), true) : $request->input('valeurs');
        }

        $data = [
            'nom' => $validated['nom'],
            'type' => $validated['type'],
            'valeurs' => json_encode($valeurs),
            'service_id' => $validated['service_id'],
        ];

        $indicateur = Indicateur::create($data);
        return response()->json(['success' => true, 'data' => $indicateur], 201);
    }

    // Afficher un indicateur
    public function show($id): JsonResponse
    {
        $indicateur = Indicateur::findOrFail($id);
        return response()->json(['success' => true, 'data' => $indicateur]);
    }

    // Modifier un indicateur (admin)
    public function update(Request $request, $id): JsonResponse
    {
        $indicateur = Indicateur::findOrFail($id);
        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'valeur' => 'sometimes|required|numeric',
            'mois' => 'sometimes|required|integer|min:1|max:12',
            'annee' => 'sometimes|required|integer|min:2000',
        ]);
        $indicateur->update($validated);
        return response()->json(['success' => true, 'data' => $indicateur]);
    }

    // Supprimer un indicateur (admin)
    public function destroy($id): JsonResponse
    {
        $indicateur = Indicateur::findOrFail($id);
        $indicateur->delete();
        return response()->json(['success' => true, 'message' => 'Indicateur supprimé']);
    }
}
