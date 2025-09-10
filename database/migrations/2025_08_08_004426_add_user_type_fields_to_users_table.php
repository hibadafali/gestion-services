<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Champs pour utilisateurs internes
            $table->foreignId('division_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('service_id')->nullable()->constrained()->onDelete('set null');
            
            // Champs pour utilisateurs externes
            $table->foreignId('pachalik_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('annexe_id')->nullable()->constrained()->onDelete('set null');
            
            // Champs additionnels
            $table->string('telephone')->nullable();
            $table->text('adresse')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['division_id']);
            $table->dropForeign(['service_id']);
            $table->dropForeign(['pachalik_id']);
            $table->dropForeign(['annexe_id']);
            $table->dropColumn(['division_id', 'service_id', 'pachalik_id', 'annexe_id', 'telephone', 'adresse']);
        });
    }
};
