(function () {
  "use strict";

  // No fallback PINs. If backend is unavailable, workspace stays locked.
  const STORAGE_PREFIX = "luisaCareerPortal.";
  const API_STATE_URL = "api/state.php";
  const API_AUTH_URL = "api/auth.php";
  const API_DASHBOARD_URL = "api/dashboard.php";

  // Rate limiting: 5 attempts then 60-second lockout.
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_MS = 60000;
  let attemptCount = 0;
  let lockedUntil = 0;

  let backendAvailable = false;
  let remoteAuthenticated = false;
  let remoteUpdatedAt = null;
  let remoteSaveTimer = 0;
  let saveStatus = null; // set after dashboard is injected

  // ── Utilities ──────────────────────────────────────────────

  function storageKey(name) {
    return name.startsWith(STORAGE_PREFIX) ? name : `${STORAGE_PREFIX}${name}`;
  }

  function readJSON(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function flashSaved(message) {
    if (!saveStatus) return;
    saveStatus.textContent = message || (remoteAuthenticated ? "Saved online." : "Saved locally.");
    window.clearTimeout(flashSaved.timer);
    flashSaved.timer = window.setTimeout(() => {
      if (saveStatus) saveStatus.textContent = "";
    }, 1800);
  }

  async function fetchJSON(url, options) {
    const response = await fetch(url, {
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }
    return { ok: response.ok, status: response.status, data };
  }

  async function fetchText(url, options) {
    const response = await fetch(url, {
      credentials: "same-origin",
      ...options,
    });
    return {
      ok: response.ok,
      status: response.status,
      text: await response.text(),
    };
  }

  // ── Navigation ─────────────────────────────────────────────

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelectorAll(".primary-nav a");

  menuToggle?.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // ── Dashboard injection ────────────────────────────────────

  const mentorZone = document.querySelector(".mentor-zone");
  const loginPanel = document.querySelector("[data-login-panel]");
  const dashboardMount = document.getElementById("dashboard-mount");

  async function injectDashboard() {
    if (!dashboardMount || dashboardMount.dataset.injected) return;
    const result = await fetchText(API_DASHBOARD_URL, { method: "GET" });
    if (!result.ok) {
      remoteAuthenticated = false;
      throw new Error("Could not load the private workspace.");
    }
    dashboardMount.innerHTML = result.text;
    dashboardMount.dataset.injected = "true";
    // Re-query elements that now exist in the DOM
    saveStatus = dashboardMount.querySelector("[data-save-status]");
    bindDashboard();
  }

  async function setDashboardVisible(visible) {
    if (visible) await injectDashboard();
    if (dashboardMount) dashboardMount.hidden = !visible;
    if (loginPanel) loginPanel.hidden = visible;
    mentorZone?.classList.toggle("dashboard-unlocked", visible);
  }

  // ── State management ───────────────────────────────────────

  function getProgressInputs() {
    return Array.from(dashboardMount?.querySelectorAll("[data-progress-list] input") || []);
  }

  function getStoredFields() {
    return Array.from(dashboardMount?.querySelectorAll("[data-store]") || []);
  }

  function getApplicationRows() {
    return Array.from(dashboardMount?.querySelectorAll("[data-application-row]") || []);
  }

  const progressKey = storageKey("progress");
  const applicationKey = storageKey("applications");

  function updateProgress() {
    const inputs = getProgressInputs();
    const progressPercent = dashboardMount?.querySelector("[data-progress-percent]");
    const progressBar = dashboardMount?.querySelector("[data-progress-bar]");
    let completed = 0;

    inputs.forEach((input) => {
      const isComplete = Boolean(input.checked);
      input.closest(".week-item")?.classList.toggle("is-complete", isComplete);
      if (isComplete) completed += 1;
    });

    const percentage = inputs.length ? Math.round((completed / inputs.length) * 100) : 0;
    if (progressPercent) progressPercent.textContent = `${percentage}%`;
    if (progressBar) progressBar.style.width = `${percentage}%`;
  }

  function serializeProgress() {
    return getProgressInputs().reduce((acc, input) => {
      acc[input.value] = input.checked;
      return acc;
    }, {});
  }

  function getApplicationFields(row) {
    return Array.from(row.querySelectorAll("input, select"));
  }

  function serializeApplications() {
    return getApplicationRows().map((row) => {
      const [role, organisation, status, nextStep] = getApplicationFields(row);
      return {
        role: role?.value || "",
        organisation: organisation?.value || "",
        status: status?.value || "",
        nextStep: nextStep?.value || "",
      };
    });
  }

  function applyApplications(applications) {
    if (!Array.isArray(applications)) return;
    getApplicationRows().forEach((row, index) => {
      const data = applications[index];
      if (!data) return;
      const [role, organisation, status, nextStep] = getApplicationFields(row);
      if (role) role.value = data.role || "";
      if (organisation) organisation.value = data.organisation || "";
      if (status) status.value = data.status || "";
      if (nextStep) nextStep.value = data.nextStep || "";
    });
  }

  function collectStoredFields() {
    return getStoredFields().reduce((acc, field) => {
      const key = field.getAttribute("data-store");
      if (key) acc[key] = field.value;
      return acc;
    }, {});
  }

  function collectState() {
    return {
      progress: serializeProgress(),
      fields: collectStoredFields(),
      applications: serializeApplications(),
    };
  }

  function writeLocalState(state) {
    writeJSON(progressKey, state.progress || {});
    Object.entries(state.fields || {}).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    writeJSON(applicationKey, state.applications || []);
  }

  function applyState(state) {
    if (!state || typeof state !== "object") return;
    remoteUpdatedAt = state.updatedAt || remoteUpdatedAt;

    const progress = state.progress || {};
    getProgressInputs().forEach((input) => {
      input.checked = Boolean(progress[input.value]);
    });
    updateProgress();

    Object.entries(state.fields || {}).forEach(([key, value]) => {
      const field = getStoredFields().find((item) => item.getAttribute("data-store") === key);
      if (field) field.value = value;
    });

    applyApplications(state.applications);
    writeLocalState(collectState());
  }

  function hasRemoteData(state) {
    return Boolean(
      state &&
        ((state.progress && Object.keys(state.progress).length) ||
          (state.fields && Object.keys(state.fields).length) ||
          (Array.isArray(state.applications) && state.applications.length))
    );
  }

  function persistState(message) {
    const state = collectState();
    writeLocalState(state);
    updateProgress();
    flashSaved(message);

    if (!remoteAuthenticated) return;

    window.clearTimeout(remoteSaveTimer);
    remoteSaveTimer = window.setTimeout(async () => {
      try {
        const result = await fetchJSON(API_STATE_URL, {
          method: "POST",
          body: JSON.stringify({ state, expectedUpdatedAt: remoteUpdatedAt }),
        });
        if (result.status === 409 && result.data?.state) {
          applyState(result.data.state);
          flashSaved("Online data changed. Reloaded latest.");
          return;
        }
        if (!result.ok) {
          remoteAuthenticated = false;
          flashSaved("Online save failed. Saved locally.");
          return;
        }
        if (result.data?.state?.updatedAt) {
          remoteUpdatedAt = result.data.state.updatedAt;
        }
        flashSaved("Saved online.");
      } catch {
        flashSaved("Offline. Saved locally.");
      }
    }, 450);
  }

  // ── Bind dashboard interactivity after injection ───────────

  function bindDashboard() {
    // Stored fields
    getStoredFields().forEach((field) => {
      const key = field.getAttribute("data-store");
      if (!key) return;
      const saved = localStorage.getItem(key);
      if (saved !== null) field.value = saved;
      field.addEventListener("input", () => persistState());
      field.addEventListener("change", () => persistState());
    });

    // Progress inputs
    const storedProgress = readJSON(progressKey, {});
    getProgressInputs().forEach((input) => {
      input.checked = Boolean(storedProgress[input.value]);
      input.addEventListener("change", () => persistState("Progress saved."));
    });
    updateProgress();

    // Applications
    const savedApplications = readJSON(applicationKey, null);
    if (Array.isArray(savedApplications)) applyApplications(savedApplications);
    getApplicationRows().forEach((row) => {
      getApplicationFields(row).forEach((field) => {
        field.addEventListener("input", () => persistState("Application tracker saved."));
        field.addEventListener("change", () => persistState("Application tracker saved."));
      });
    });

    // Lock button
    const lockBtn = dashboardMount?.querySelector("[data-lock-dashboard]");
    lockBtn?.addEventListener("click", async () => {
      remoteAuthenticated = false;
      remoteUpdatedAt = null;
      await setDashboardVisible(false);
      loginPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
      // Reset rate limit on explicit lock
      attemptCount = 0;
      lockedUntil = 0;

      if (!backendAvailable) return;
      try {
        await fetchJSON(API_AUTH_URL, {
          method: "POST",
          body: JSON.stringify({ action: "logout" }),
        });
      } catch {
        // Local lock has already happened.
      }
    });
  }

  // ── PIN form & rate limiting ───────────────────────────────

  const pinForm = document.querySelector("[data-pin-form]");
  const pinStatus = document.querySelector("[data-pin-status]");
  const pinButton = pinForm?.querySelector("button[type='submit']");

  function setPinBusy(isBusy) {
    if (!pinButton) return;
    pinButton.disabled = isBusy;
    pinButton.textContent = isBusy ? "Opening..." : "Open workspace";
  }

  async function authenticateOnline(pin) {
    const result = await fetchJSON(API_AUTH_URL, {
      method: "POST",
      body: JSON.stringify({ pin }),
    });

    if (result.status === 404 || !result.data) {
      backendAvailable = false;
      throw new Error("Backend unavailable. Workspace cannot be opened.");
    }

    backendAvailable = true;

    if (!result.ok || !result.data?.authenticated) {
      throw new Error(result.data?.error || "Incorrect PIN. Try again.");
    }

    remoteAuthenticated = true;
    const remoteState = result.data.state;

    await setDashboardVisible(true);
    if (hasRemoteData(remoteState)) {
      applyState(remoteState);
    } else {
      persistState("Connected. Local changes saved online.");
    }

    dashboardMount?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  pinForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const now = Date.now();

    // Enforce lockout
    if (now < lockedUntil) {
      const remaining = Math.ceil((lockedUntil - now) / 1000);
      pinStatus.textContent = `Too many attempts. Wait ${remaining} seconds.`;
      pinStatus.classList.add("error");
      return;
    }

    const form = new FormData(pinForm);
    const pin = String(form.get("pin") || "").trim();

    pinStatus.textContent = "Opening workspace...";
    pinStatus.classList.remove("error");
    setPinBusy(true);

    try {
      await authenticateOnline(pin);
      // Successful auth resets counter
      attemptCount = 0;
      lockedUntil = 0;
      return;
    } catch (error) {
      if (backendAvailable) {
        // Count this as a failed attempt only when backend responded
        attemptCount += 1;
        if (attemptCount >= MAX_ATTEMPTS) {
          lockedUntil = Date.now() + LOCKOUT_MS;
          attemptCount = 0;
          pinStatus.textContent = "Too many incorrect attempts. Locked for 60 seconds.";
          pinStatus.classList.add("error");
          return;
        }
        pinStatus.textContent = error.message || "Incorrect PIN. Try again.";
        pinStatus.classList.add("error");
        return;
      }

      // Backend unavailable: stay locked, no fallback
      pinStatus.textContent = "Workspace is offline. Try again later.";
      pinStatus.classList.add("error");
    } finally {
      setPinBusy(false);
    }
  });

  // ── Bootstrap: verify server session on load ───────────────
  // No sessionStorage auto-unlock. Server is the only source of truth.

  async function bootstrapRemoteState() {
    try {
      const result = await fetchJSON(API_STATE_URL, { method: "GET" });

      if (result.status === 401) {
        backendAvailable = true;
        remoteAuthenticated = false;
        remoteUpdatedAt = null;
        // Default locked — do nothing
        return;
      }

      if (!result.ok || !result.data) return;

      backendAvailable = true;
      remoteAuthenticated = Boolean(result.data.authenticated);

      if (remoteAuthenticated) {
        await setDashboardVisible(true);
        applyState(result.data.state);
        flashSaved("Connected to shared online data.");
      }
    } catch {
      backendAvailable = false;
      remoteAuthenticated = false;
      remoteUpdatedAt = null;
      // Stays locked
    }
  }

  bootstrapRemoteState();
})();
