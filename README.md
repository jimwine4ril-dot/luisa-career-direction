# Luisa Career Direction Portal

Mobile-first career direction workspace for Luisa with a Hostinger-friendly PHP backend for shared online edits.

## Files

- `index.html` - public welcome page and private workspace login shell
- `styles.css` - custom responsive styling
- `app.js` - navigation, PIN login, private dashboard loading, and shared save logic
- `api/` - PHP endpoints for PIN authentication, private dashboard rendering, and shared state saving
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

PINs are checked server-side by `api/auth.php`. Keep the real PINs out of deployable Markdown files and change the hashes in `api/config.php` before sending the live link if a PIN has been shared too widely.

For local static preview without PHP, the public page loads but the private workspace stays locked.

## Shared Online Editing

When uploaded to Hostinger with PHP enabled:

- The private workspace unlocks through `api/auth.php`.
- The private dashboard HTML is served only after authentication through `api/dashboard.php`.
- Editable fields, progress checkboxes, application rows, weekly reviews, STAR notes, and planning notes save through `api/state.php`.
- Shared data is stored in `data/luisa-career-state.json`, created automatically on first online save.
- `data/.htaccess` blocks direct web access to the JSON file on Apache/Hostinger.
- If the backend is unavailable, the private workspace does not open.

### Change The PIN

Each default PIN hash is calculated as:

```text
sha256(PIN + pin_salt)
```

To change it:

1. Pick a new PIN.
2. Calculate the SHA-256 hash of `NEW_PIN` followed immediately by the `pin_salt` in `api/config.php`.
3. Replace the relevant entry in `pin_hashes` in `api/config.php`.

Example hash shape:

```text
<64-character SHA-256 hash>
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
