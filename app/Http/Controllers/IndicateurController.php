<?php

namespace App\Http\Controllers;

use App\Models\Indicateur;
use Illuminate\Http\Request;

class IndicateurController extends Controller
{
    public function index()
    {
        return Indicateur::with('service')->get();
    }

    public function show($id)
    {
        return Indicateur::with('service')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'valeurs' => 'nullable', // accepté vide, on initialise
            'service_id' => 'required|exists:services,id',
        ]);

        // Normaliser valeurs en structure attendue
        $valeurs = $request->input('valeurs');
        if (is_string($valeurs)) {
            $decoded = json_decode($valeurs, true);
            $valeurs = is_array($decoded) ? $decoded : null;
        }
        if (!is_array($valeurs) || !isset($valeurs['history']) || !is_array($valeurs['history'])) {
            $valeurs = ['history' => []];
        }

        return Indicateur::create([
            'nom' => $data['nom'],
            'type' => $data['type'],
            'service_id' => $data['service_id'],
            'valeurs' => $valeurs, // sera encodé via $casts
        ]);
    }

    public function update(Request $request, $id)
    {
        $indicateur = Indicateur::findOrFail($id);

        // Cas 1: upsert d'une entrée (mois/annee/valeur) dans le JSON valeurs.history
        if ($request->input('op') === 'upsert_history') {
            $validated = $request->validate([
                'mois' => 'required|integer|min:1|max:12',
                'annee' => 'required|integer|min:2000',
                'valeur' => 'required|numeric',
            ]);

            $valeurs = $indicateur->valeurs;
            if (!is_array($valeurs)) $valeurs = [];
            if (!isset($valeurs['history']) || !is_array($valeurs['history'])) {
                $valeurs['history'] = [];
            }

            $found = null;
            foreach ($valeurs['history'] as $idx => $entry) {
                $m = isset($entry['mois']) ? (int)$entry['mois'] : null;
                $a = isset($entry['annee']) ? (int)$entry['annee'] : null;
                if ($m === (int)$validated['mois'] && $a === (int)$validated['annee']) {
                    $found = $idx;
                    break;
                }
            }

            $newEntry = [
                'mois' => (int)$validated['mois'],
                'annee' => (int)$validated['annee'],
                'valeur' => (float)$validated['valeur'],
            ];

            if ($found !== null) {
                $valeurs['history'][$found] = array_merge($valeurs['history'][$found], $newEntry);
            } else {
                $valeurs['history'][] = $newEntry;
            }

            $indicateur->valeurs = $valeurs;
            $indicateur->save();
            return $indicateur;
        }

        // Cas 2: mise à jour classique des méta-données / du JSON complet
        $data = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string|max:255',
            'valeurs' => 'sometimes', // accepter array ou string JSON
            'service_id' => 'sometimes|required|exists:services,id',
        ]);

        if (array_key_exists('valeurs', $data)) {
            $valeurs = $data['valeurs'];
            if (is_string($valeurs)) {
                $decoded = json_decode($valeurs, true);
                $valeurs = is_array($decoded) ? $decoded : ['history' => []];
            }
            if (!is_array($valeurs) || !isset($valeurs['history'])) {
                $valeurs = ['history' => []];
            }
            $data['valeurs'] = $valeurs;
        }

        $indicateur->update($data);
        return $indicateur;
    }

    public function destroy($id)
    {
        $indicateur = Indicateur::findOrFail($id);
        $indicateur->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}
