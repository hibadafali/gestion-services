
<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Remplacez par l'origine exacte de votre frontend (ne PAS laisser '*'
    // si vous utilisez credentials: "include" côté client)
    'allowed_origins' => [
        'http://localhost:3001',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3001',
        'http://localhost:5173',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // true si vous envoyez des cookies/session (credentials: "include")
    'supports_credentials' => true,
];