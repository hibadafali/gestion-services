<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DemandeController;
use App\Http\Controllers\Api\IndicateurController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\DivisionController;
use App\Http\Controllers\Api\PachalikController;
use App\Http\Controllers\Api\AnnexeController;
use App\Http\Controllers\EntitePrefectureController;
use App\Http\Controllers\ReponseDemandeController;
use App\Http\Controllers\RapportPdfController;
use App\Http\Controllers\UserController;

// -------------------- AUTH --------------------
Route::post('login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('user', [AuthController::class, 'user']);

// -------------------- PUBLIC --------------------
Route::get('indicateurs', [IndicateurController::class, 'index']);
Route::get('indicateurs/{id}', [IndicateurController::class, 'show']);

// ✅ Nouvelle route publique pour récupérer toutes les divisions avec leurs services
Route::get('divisions-with-services', [DivisionController::class, 'withServices']);

// -------------------- PROTECTED --------------------
Route::middleware('auth:sanctum')->group(function () {

    // Dashboard
    Route::get('/dashboard', [AuthController::class, 'dashboard']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // -------------------- ADMIN ONLY --------------------
    Route::middleware('admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('entite-prefectures', EntitePrefectureController::class);
        Route::apiResource('divisions', DivisionController::class)->except(['index', 'show']);
        Route::apiResource('services', ServiceController::class)->except(['index', 'show']);
        Route::apiResource('pachaliks', PachalikController::class)->except(['index', 'show']);
        Route::apiResource('annexes', AnnexeController::class)->except(['index', 'show']);
        Route::apiResource('demandes', DemandeController::class)->only(['destroy']);
        Route::post('demandes/{id}/respond', [DemandeController::class, 'respond']);
    });

    // -------------------- STANDARD AUTH --------------------
    Route::apiResource('divisions', DivisionController::class)->only(['index', 'show']);
    Route::apiResource('services', ServiceController::class)->only(['index', 'show']);
    Route::apiResource('pachaliks', PachalikController::class)->only(['index', 'show']);
    Route::apiResource('annexes', AnnexeController::class)->only(['index', 'show']);
    Route::apiResource('demandes', DemandeController::class)->only(['index', 'store', 'show']);
    Route::apiResource('indicateurs', IndicateurController::class)->except(['index', 'show']);
    Route::apiResource('rapport-pdfs', RapportPdfController::class);
});