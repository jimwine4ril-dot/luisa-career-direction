<?php

declare(strict_types=1);

require __DIR__ . '/helpers.php';

luisa_start_session();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    luisa_response(405, ['error' => 'Method not allowed.']);
}

$input = luisa_json_input();

// Logout
if (($input['action'] ?? '') === 'logout') {
    $_SESSION = [];
    session_destroy();
    luisa_response(200, ['authenticated' => false]);
}

// Rate limiting: 5 attempts per session, then 60-second lockout.
$attempts   = (int) ($_SESSION['pin_attempts'] ?? 0);
$lockedUntil = (int) ($_SESSION['pin_locked_until'] ?? 0);

if ($lockedUntil > time()) {
    $wait = $lockedUntil - time();
    luisa_response(429, ['authenticated' => false, 'error' => "Too many attempts. Wait {$wait} seconds."]);
}

// Reset lockout window if it has expired
if ($lockedUntil > 0 && $lockedUntil <= time()) {
    $_SESSION['pin_attempts']    = 0;
    $_SESSION['pin_locked_until'] = 0;
    $attempts = 0;
}

$pin = trim((string) ($input['pin'] ?? ''));

if ($pin === '' || !luisa_verify_pin($pin)) {
    $attempts += 1;
    $_SESSION['pin_attempts'] = $attempts;

    if ($attempts >= 5) {
        $_SESSION['pin_locked_until'] = time() + 60;
        $_SESSION['pin_attempts']     = 0;
        luisa_response(429, ['authenticated' => false, 'error' => 'Too many incorrect attempts. Locked for 60 seconds.']);
    }

    luisa_response(401, ['authenticated' => false, 'error' => 'Incorrect PIN.']);
}

// Successful auth: clear counters, set session
$_SESSION['pin_attempts']             = 0;
$_SESSION['pin_locked_until']         = 0;
$_SESSION['luisa_direction_authenticated'] = true;

luisa_response(200, [
    'authenticated' => true,
    'state' => luisa_load_state(),
]);
