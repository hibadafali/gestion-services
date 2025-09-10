<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-admin-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create an admin user for the application';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Check if admin user already exists
        $existingAdmin = User::where('email', 'admin@admin.com')->first();
        
        if ($existingAdmin) {
            $this->info('Admin user already exists!');
            return;
        }
        
        // Create admin user
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
            'type' => 'interne'
        ]);
        
        $this->info('Admin user created successfully!');
        $this->info('Email: admin@admin.com');
        $this->info('Password: password');
    }
}
