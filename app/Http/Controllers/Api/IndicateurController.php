<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Indicateur;
use Illuminate\Http\JsonResponse;

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
            'type' => 'required|string|max:255',
            'service_id' => 'required|integer|exists:services,id',
            'valeurs' => 'nullable',
            'mois' => 'nullable|integer|min:1|max:12',
            'annee' => 'nullable|integer|min:2000',
        ]);

        $valeurs = $request->input('valeurs');
        if (is_string($valeurs)) {
            $decoded = json_decode($valeurs, true);
            $valeurs = is_array($decoded) ? $decoded : null;
        }
        if (!is_array($valeurs) || !isset($valeurs['history']) || !is_array($valeurs['history'])) {
            $valeurs = ['history' => []];
        }

        // calculer et stocker le résumé N / N-1 dans le JSON valeurs.summary
        $targetM = $request->input('mois') ? (int)$request->input('mois') : (int)date('n');
        $targetA = $request->input('annee') ? (int)$request->input('annee') : (int)date('Y');
        $valeurs['summary'] = $this->computeSummary($valeurs['history'], $targetM, $targetA);

        $indicateur = Indicateur::create([
            'nom' => $validated['nom'],
            'type' => $validated['type'],
            'service_id' => $validated['service_id'],
            'valeurs' => $valeurs, // cast array -> JSON par le modèle
        ]);

        return response()->json(['success' => true, 'data' => $indicateur], 201);
    }

    // Afficher un indicateur
    public function show($id): JsonResponse
    {
        $i = Indicateur::findOrFail($id);
        return response()->json(['success' => true, 'data' => $i]);
    }

    // Modifier un indicateur (admin)
    public function update(Request $request, $id): JsonResponse
    {
        $indicateur = Indicateur::findOrFail($id);

        // Upsert d'une entrée (mois/annee/valeur) dans le JSON 'valeurs.history'
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

            // recalculer le résumé après upsert ; cible = l'entrée upsertée
            $valeurs['summary'] = $this->computeSummary($valeurs['history'], (int)$validated['mois'], (int)$validated['annee']);

            $indicateur->valeurs = $valeurs;
            $indicateur->save();
            return $indicateur;
        }

        // Mises à jour classiques
        $data = $request->validate([
            'valeurs' => 'sometimes',
        ]);

        if (array_key_exists('valeurs', $data)) {
            $v = $data['valeurs'];
            if (is_string($v)) {
                $decoded = json_decode($v, true);
                $v = is_array($decoded) ? $decoded : null;
            }
            if (!is_array($v)) {
                return response()->json(['success' => false, 'message' => 'valeurs doit être un objet JSON'], 422);
            }
            $data['valeurs'] = $v;
        }

        // si on a remplacé le JSON 'valeurs', recompute summary using provided mois/annee if present, otherwise use current month
        if (array_key_exists('valeurs', $data)) {
            $valeurs = $data['valeurs'];
            if (is_string($valeurs)) {
                $decoded = json_decode($valeurs, true);
                $valeurs = is_array($decoded) ? $decoded : ['history' => []];
            }
            if (!is_array($valeurs) || !isset($valeurs['history'])) {
                $valeurs = ['history' => []];
            }
            $targetM = $request->input('mois') ? (int)$request->input('mois') : (int)date('n');
            $targetA = $request->input('annee') ? (int)$request->input('annee') : (int)date('Y');
            $valeurs['summary'] = $this->computeSummary($valeurs['history'], $targetM, $targetA);
            $data['valeurs'] = $valeurs;
        }

        $indicateur->update($data);
        return response()->json(['success' => true, 'data' => $indicateur]);
    }

    // Supprimer un indicateur (admin)
    public function destroy($id): JsonResponse
    {
        $i = Indicateur::findOrFail($id);
        $i->delete();
        return response()->json(['success' => true]);
    }

    /**
     * Calcule la valeur N (dernière <= target) et N_1 (précédente chronologique) depuis un tableau history.
     * history : array de ['annee'=>int,'mois'=>int,'valeur'=>number]
     * renvoie ['N'=>float|null,'N_1'=>float|null,'timeline_count'=>int]
     */
    private function computeSummary(array $history, int $targetM, int $targetA): array
    {
        // normalize and keep only entries with numeric month/year
        $timeline = [];
        foreach ($history as $h) {
            if (!isset($h['annee']) || !isset($h['mois'])) continue;
            $y = (int)$h['annee'];
            $m = (int)$h['mois'];
            $v = isset($h['valeur']) ? $h['valeur'] : (isset($h['value']) ? $h['value'] : null);
            $num = is_null($v) ? null : (float)$v;
            $timeline[] = ['annee'=>$y,'mois'=>$m,'valeur'=>$num];
        }
        // sort asc
        usort($timeline, function($a,$b){
            if ($a['annee'] === $b['annee']) return $a['mois'] - $b['mois'];
            return $a['annee'] - $b['annee'];
        });

        $N = null; $N_1 = null;
        // find last entry <= target
        $lastIdx = -1;
        foreach ($timeline as $i => $t) {
            if ($t['annee'] < $targetA || ($t['annee'] === $targetA && $t['mois'] <= $targetM)) {
                $lastIdx = $i;
            } else break;
        }
        if ($lastIdx >= 0) {
            $N = $timeline[$lastIdx]['valeur'];
            if ($lastIdx - 1 >= 0) $N_1 = $timeline[$lastIdx - 1]['valeur'];
        } else {
            // no entry before target -> optionally take first entry as N (comment out to keep null)
            if (count($timeline) > 0) {
                $N = $timeline[count($timeline)-1]['valeur']; // last known
                $N_1 = count($timeline) > 1 ? $timeline[count($timeline)-2]['valeur'] : null;
            }
        }

        return ['N' => $N !== null ? $N : null, 'N_1' => $N_1 !== null ? $N_1 : null, 'timeline_count' => count($timeline)];
    }
}
