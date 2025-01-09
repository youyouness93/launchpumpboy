<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Lire le fichier wallets.json
$walletsFile = 'wallets.json';

if (file_exists($walletsFile)) {
    $wallets = json_decode(file_get_contents($walletsFile), true);
} else {
    $wallets = [];
}

echo json_encode([
    'success' => true,
    'wallets' => $wallets
]);
