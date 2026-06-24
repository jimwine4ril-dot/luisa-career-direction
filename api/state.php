<?php

declare(strict_types=1);

require __DIR__ . '/helpers.php';

luisa_start_session();
luisa_require_authenticated();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    luisa_response(200, [
        'authenticated' => true,
        'state' => luisa_load_state(),
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = luisa_json_input();
    $state = isset($input['state']) && is_array($input['state']) ? $input['state'] : [];

    luisa_response(200, [
        'authenticated' => true,
        'state' => luisa_save_state($state),
    ]);
}

luisa_response(405, ['error' => 'Method not allowed.']);
