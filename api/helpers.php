<?php

declare(strict_types=1);

function luisa_start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');

    session_name('LuisaDirectionOS');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $isSecure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function luisa_config(): array
{
    $config = require __DIR__ . '/config.php';

    return array_merge([
        'pin_salt' => '',
        'pin_hash' => '',
        'pin_hashes' => [],
        'state_file' => dirname(__DIR__) . '/data/luisa-career-state.json',
    ], is_array($config) ? $config : []);
}

function luisa_response(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function luisa_json_input(): array
{
    $body = file_get_contents('php://input');

    if ($body === false || $body === '') {
        return [];
    }

    if (strlen($body) > 250000) {
        luisa_response(413, ['error' => 'Request is too large.']);
    }

    $data = json_decode($body, true);

    if (!is_array($data)) {
        luisa_response(400, ['error' => 'Invalid JSON.']);
    }

    return $data;
}

function luisa_default_state(): array
{
    return [
        'progress' => [],
        'fields' => [],
        'applications' => [],
        'updatedAt' => null,
    ];
}

function luisa_load_state(): array
{
    $config = luisa_config();
    $file = $config['state_file'];

    if (!is_string($file) || $file === '' || !is_file($file)) {
        return luisa_default_state();
    }

    $json = file_get_contents($file);
    $state = $json ? json_decode($json, true) : null;

    return is_array($state) ? array_merge(luisa_default_state(), $state) : luisa_default_state();
}

function luisa_clean_text(string $value): string
{
    $value = str_replace("\0", '', $value);

    return substr($value, 0, 12000);
}

function luisa_sanitize_state(array $state): array
{
    $clean = luisa_default_state();

    if (isset($state['progress']) && is_array($state['progress'])) {
        foreach ($state['progress'] as $key => $value) {
            if (is_string($key)) {
                $clean['progress'][luisa_clean_text($key)] = (bool) $value;
            }
        }
    }

    if (isset($state['fields']) && is_array($state['fields'])) {
        foreach ($state['fields'] as $key => $value) {
            if (is_string($key) && is_scalar($value)) {
                $clean['fields'][luisa_clean_text($key)] = luisa_clean_text((string) $value);
            }
        }
    }

    if (isset($state['applications']) && is_array($state['applications'])) {
        foreach (array_slice($state['applications'], 0, 30) as $row) {
            if (!is_array($row)) {
                continue;
            }

            $clean['applications'][] = [
                'role' => luisa_clean_text((string) ($row['role'] ?? '')),
                'organisation' => luisa_clean_text((string) ($row['organisation'] ?? '')),
                'status' => luisa_clean_text((string) ($row['status'] ?? '')),
                'nextStep' => luisa_clean_text((string) ($row['nextStep'] ?? '')),
            ];
        }
    }

    $clean['updatedAt'] = gmdate('c');

    return $clean;
}

function luisa_save_state(array $state): array
{
    $config = luisa_config();
    $file = $config['state_file'];
    $dir = dirname($file);

    if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
        luisa_response(500, ['error' => 'Could not create data directory.']);
    }

    $clean = luisa_sanitize_state($state);
    $tmp = $file . '.tmp';
    $json = json_encode($clean, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

    if ($json === false || file_put_contents($tmp, $json, LOCK_EX) === false || !rename($tmp, $file)) {
        luisa_response(500, ['error' => 'Could not save state.']);
    }

    return $clean;
}

function luisa_is_authenticated(): bool
{
    return !empty($_SESSION['luisa_direction_authenticated']);
}

function luisa_require_authenticated(): void
{
    if (!luisa_is_authenticated()) {
        luisa_response(401, ['authenticated' => false, 'error' => 'Authentication required.']);
    }
}

function luisa_verify_pin(string $pin): bool
{
    $config = luisa_config();
    $hash = hash('sha256', $pin . $config['pin_salt']);
    $hashes = is_array($config['pin_hashes']) ? $config['pin_hashes'] : [];

    foreach ($hashes as $storedHash) {
        if (hash_equals((string) $storedHash, $hash)) {
            return true;
        }
    }

    return hash_equals((string) $config['pin_hash'], $hash);
}
