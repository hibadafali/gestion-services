<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Demande;
use App\Models\Indicateur;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Statistiques principales pour le dashboard
    public function stats(): JsonResponse
    {
        $user = Auth::user();
        $totalDemandes = $user->is_admin ? Demande::count() : Demande::where('user_id', $user->id)->count();
        $totalServices = Service::count();
        $totalIndicateurs = Indicateur::count();
        return response()->json([
            'success' => true,
            'data' => [
                'total_demandes' => $totalDemandes,
                'total_services' => $totalServices,
                'total_indicateurs' => $totalIndicateurs,
            ]
        ]);
    }
}
