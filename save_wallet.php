<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Get the wallet address from the POST request
$input = json_decode(file_get_contents('php://input'), true);
$wallet = isset($input['wallet']) ? $input['wallet'] : '';

if (empty($wallet)) {
    echo json_encode([
        'success' => false,
        'message' => 'No wallet address provided'
    ]);
    exit;
}

// Validate wallet address format
if (!preg_match('/^[A-HJ-NP-Za-km-z1-9]{32,44}$/', $wallet)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid wallet address format'
    ]);
    exit;
}

// Load existing wallets
$walletsFile = 'wallets.json';
if (file_exists($walletsFile)) {
    $wallets = json_decode(file_get_contents($walletsFile), true);
} else {
    $wallets = [];
}

// Check if wallet already exists
if (in_array($wallet, array_column($wallets, 'address'))) {
    echo json_encode([
        'success' => false,
        'message' => 'Wallet address already registered'
    ]);
    exit;
}

// Add new wallet
$wallets[] = [
    'address' => $wallet,
    'timestamp' => date('Y-m-d H:i:s')
];

// Save to file
if (file_put_contents($walletsFile, json_encode($wallets, JSON_PRETTY_PRINT))) {
    echo json_encode([
        'success' => true,
        'message' => 'Wallet address saved successfully'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error saving wallet address'
    ]);
}
