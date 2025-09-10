<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

try {
    $admin = User::where('email', 'admin@admin.com')->first();
    
    if ($admin) {
        $admin->password = Hash::make('password');
        $admin->save();
        echo "✅ Admin password reset successfully!\n";
        echo "Email: admin@admin.com\n";
        echo "Password: password\n";
    } else {
        echo "❌ Admin user not found!\n";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
