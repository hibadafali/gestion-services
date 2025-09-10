<?php

namespace App\Http\Controllers;

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
    // L’admin protège tout sauf index/show/update/store (pour que user authentifié puisse modifier/créer)
    $this->middleware('admin')->except(['index', 'show', 'update', 'store']);
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
            'nom'        => 'required|string|max:255',
            'valeur'     => 'required|numeric',
            'type'       => 'required|string|max:255',
            'mois'       => 'nullable|integer|min:1|max:12',
            'annee'      => 'nullable|integer|min:2000',
            'service_id' => 'required|integer|exists:services,id',
        ]);

        // Création d'une structure d'historique par défaut
        $entry = [
            'valeur' => (float) $validated['valeur'],
        ];
        if (isset($validated['mois'])) $entry['mois'] = (int) $validated['mois'];
        if (isset($validated['annee'])) $entry['annee'] = (int) $validated['annee'];
        $valeurs = ['history' => [$entry]];

        // Si le client envoie déjà un historique complet
        if ($request->filled('valeurs')) {
            $valeurs = is_string($request->input('valeurs')) ? json_decode($request->input('valeurs'), true) : $request->input('valeurs');
        }
        $data = [
            'nom'        => $validated['nom'],
            'type'       => $validated['type'],
            'valeurs'    => json_encode($valeurs),
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

    // Modifier un indicateur (admin) : met à jour une valeur de l’historique
    public function update(Request $request, $id): JsonResponse
    {
        $indicateur = Indicateur::findOrFail($id);

        $validated = $request->validate([
            'valeur'    => 'required|numeric',
            'annee'     => 'required|integer|min:2000',
            'mois'      => 'nullable|integer|min:1|max:12',
        ]);

        // Décoder l’historique existant, ou en créer un
        $valeurs = $indicateur->valeurs ? json_decode($indicateur->valeurs, true) : ['history' => []];
        if (!isset($valeurs['history']) || !is_array($valeurs['history'])) {
            $valeurs['history'] = [];
        }

        // Chercher une entrée existante pour le couple (année, mois)
        $found = false;
        foreach ($valeurs['history'] as &$entry) {
            if (
                isset($entry['annee'], $validated['annee']) &&
                $entry['annee'] == $validated['annee'] &&
                (
                    (!isset($validated['mois']) && !isset($entry['mois'])) ||
                    (isset($validated['mois']) && isset($entry['mois']) && $entry['mois'] == $validated['mois'])
                )
            ) {
                $entry['valeur'] = $validated['valeur'];
                $found = true;
                break;
            }
        }
        unset($entry);

        // Pas trouvé : on ajoute une entrée
        if (!$found) {
            $entry = [
                'annee' => $validated['annee'],
                'valeur' => $validated['valeur'],
            ];
            if (isset($validated['mois'])) {
                $entry['mois'] = $validated['mois'];
            }
            $valeurs['history'][] = $entry;
        }

        // Réenregistrement du JSON
        $indicateur->valeurs = json_encode($valeurs);
        $indicateur->save();

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