# Luisa Career Direction Portal

Mobile-first career direction workspace for Luisa with a Hostinger-friendly PHP backend for shared online edits.

## Files

- `index.html` - public welcome page and hidden private workspace markup
- `styles.css` - custom responsive styling
- `app.js` - career card expansion, progress tracker, PIN login, and shared save logic
- `api/` - PHP endpoints for PIN authentication and shared state saving
- `data/` - JSON state storage for Hostinger shared hosting

## Private Workspace

The private workspace includes:

- Wednesday baseline conversation frame
- Route ranking and route decision selector
- Exact job-title lists by route
- Meeting structure and coaching questions
- NHS person-spec evidence map
- CV profile drafts for imaging, clinical research, and healthcare science
- STAR evidence bank
- Application tracker
- Weekly review tracker
- Planning notes

## Local Preview

From this folder:

```bash
python3 -m http.server 5050
```

Then open:

```text
http://127.0.0.1:5050
```

## Private Access

Default PINs:

```text
Jinmi: 2468
Luisa: 1357
```

When hosted with PHP, each PIN is checked server-side by `api/auth.php`. Change the PIN hashes in `api/config.php` before sending the live link if this will contain sensitive notes.

For local static preview without PHP, the app falls back to local browser-only saves and the default PINs.

## Shared Online Editing

When uploaded to Hostinger with PHP enabled:

- The private workspace unlocks through `api/auth.php`.
- Editable fields, progress checkboxes, application rows, weekly reviews, STAR notes, and planning notes save through `api/state.php`.
- Shared data is stored in `data/luisa-career-state.json`, created automatically on first online save.
- `data/.htaccess` blocks direct web access to the JSON file on Apache/Hostinger.
- If the backend is unavailable, the app still works locally with `localStorage`, but changes will not be shared across devices.

### Change The PIN

Each default PIN hash is calculated as:

```text
sha256(PIN + pin_salt)
```

To change it:

1. Pick a new PIN.
2. Calculate the SHA-256 hash of `NEW_PIN` followed immediately by the `pin_salt` in `api/config.php`.
3. Replace the relevant entry in `pin_hashes` in `api/config.php`.

Example for PIN `2468` and salt `luisa-career-direction-2026`:

```text
96c948e1d416f509c9475fc0fe10fcf50a97c0182c9dd910f9884defcb6c7c28
```

## Hostinger Deployment

Upload the contents of this folder to the Hostinger target directory:

- Main site: upload all files and folders into `public_html`.
- Subfolder: upload all files and folders into a folder such as `public_html/luisa-career-direction`.

No build step is required.

## Local Data

The portal uses `localStorage` as an offline fallback for:

- 30-day progress
- Route decision
- STAR builder notes
- Interview preparation
- Application tracker
- Weekly reviews
- Planning notes

Use the browser's site data controls to reset saved local data.
