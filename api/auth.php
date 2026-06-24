<?php

declare(strict_types=1);

require __DIR__ . '/helpers.php';

luisa_start_session();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    luisa_response(405, ['error' => 'Method not allowed.']);
}

$input = luisa_json_input();

if (($input['action'] ?? '') === 'logout') {
    $_SESSION = [];
    session_destroy();
    luisa_response(200, ['authenticated' => false]);
}

$pin = trim((string) ($input['pin'] ?? ''));

if ($pin === '' || !luisa_verify_pin($pin)) {
    luisa_response(401, ['authenticated' => false, 'error' => 'Incorrect PIN.']);
}

$_SESSION['luisa_direction_authenticated'] = true;

luisa_response(200, [
    'authenticated' => true,
    'state' => luisa_load_state(),
]);
