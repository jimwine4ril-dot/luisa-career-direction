(function () {
  "use strict";

  const FALLBACK_PINS = ["2468", "1357"];
  const STORAGE_PREFIX = "luisaCareerPortal.";
  const API_STATE_URL = "api/state.php";
  const API_AUTH_URL = "api/auth.php";
  const saveStatus = document.querySelector("[data-save-status]");

  let backendAvailable = false;
  let remoteAuthenticated = false;
  let remoteSaveTimer = 0;

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
      saveStatus.textContent = "";
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

  const directionCards = Array.from(document.querySelectorAll(".direction-card"));
  const expandAllButton = document.querySelector("[data-expand-all]");

  function setDirectionOpen(card, open) {
    const trigger = card.querySelector(".direction-trigger");
    const body = card.querySelector(".direction-body");
    card.classList.toggle("is-open", open);
    trigger?.setAttribute("aria-expanded", String(open));
    if (body) body.hidden = !open;
  }

  directionCards.forEach((card) => {
    const trigger = card.querySelector(".direction-trigger");
    trigger?.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      setDirectionOpen(card, !isOpen);
    });
  });

  expandAllButton?.addEventListener("click", () => {
    const shouldExpand = directionCards.some((card) => !card.classList.contains("is-open"));
    directionCards.forEach((card) => setDirectionOpen(card, shouldExpand));
    expandAllButton.textContent = shouldExpand ? "Collapse all" : "Expand all";
  });

  const progressInputs = Array.from(document.querySelectorAll("[data-progress-list] input"));
  const progressPercent = document.querySelector("[data-progress-percent]");
  const progressBar = document.querySelector("[data-progress-bar]");
  const progressKey = storageKey("progress");
  const storedProgress = readJSON(progressKey, {});

  function serializeProgress() {
    return progressInputs.reduce((acc, input) => {
      acc[input.value] = input.checked;
      return acc;
    }, {});
  }

  function updateProgress() {
    let completed = 0;

    progressInputs.forEach((input) => {
      const isComplete = Boolean(input.checked);
      input.closest(".week-item")?.classList.toggle("is-complete", isComplete);
      if (isComplete) completed += 1;
    });

    const percentage = progressInputs.length ? Math.round((completed / progressInputs.length) * 100) : 0;
    if (progressPercent) progressPercent.textContent = `${percentage}%`;
    if (progressBar) progressBar.style.width = `${percentage}%`;
  }

  progressInputs.forEach((input) => {
    input.checked = Boolean(storedProgress[input.value]);
    input.addEventListener("change", () => {
      persistState("Progress saved.");
    });
  });
  updateProgress();

  const pinForm = document.querySelector("[data-pin-form]");
  const pinStatus = document.querySelector("[data-pin-status]");
  const loginPanel = document.querySelector("[data-login-panel]");
  const dashboard = document.querySelector("[data-dashboard]");
  const mentorZone = document.querySelector(".mentor-zone");
  const lockDashboard = document.querySelector("[data-lock-dashboard]");

  function setDashboardVisible(visible) {
    if (dashboard) dashboard.hidden = !visible;
    if (loginPanel) loginPanel.hidden = visible;
    mentorZone?.classList.toggle("dashboard-unlocked", visible);
    sessionStorage.setItem(storageKey("mentorUnlocked"), String(visible));
  }

  if (sessionStorage.getItem(storageKey("mentorUnlocked")) === "true") {
    setDashboardVisible(true);
  }

  const storedFields = Array.from(document.querySelectorAll("[data-store]"));

  storedFields.forEach((field) => {
    const key = field.getAttribute("data-store");
    if (!key) return;
    const saved = localStorage.getItem(key);
    if (saved !== null) field.value = saved;

    field.addEventListener("input", () => {
      persistState();
    });

    field.addEventListener("change", () => {
      persistState();
    });
  });

  const applicationKey = storageKey("applications");
  const applicationRows = Array.from(document.querySelectorAll("[data-application-row]"));
  const savedApplications = readJSON(applicationKey, null);

  function getApplicationFields(row) {
    return Array.from(row.querySelectorAll("input, select"));
  }

  function serializeApplications() {
    return applicationRows.map((row) => {
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
    applicationRows.forEach((row, index) => {
      const data = applications[index];
      if (!data) return;
      const [role, organisation, status, nextStep] = getApplicationFields(row);
      if (role) role.value = data.role || "";
      if (organisation) organisation.value = data.organisation || "";
      if (status) status.value = data.status || "";
      if (nextStep) nextStep.value = data.nextStep || "";
    });
  }

  if (Array.isArray(savedApplications)) {
    applyApplications(savedApplications);
  }

  applicationRows.forEach((row) => {
    getApplicationFields(row).forEach((field) => {
      field.addEventListener("input", () => {
        persistState("Application tracker saved.");
      });
      field.addEventListener("change", () => {
        persistState("Application tracker saved.");
      });
    });
  });

  function collectStoredFields() {
    return storedFields.reduce((acc, field) => {
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

    const progress = state.progress || {};
    progressInputs.forEach((input) => {
      input.checked = Boolean(progress[input.value]);
    });
    updateProgress();

    Object.entries(state.fields || {}).forEach(([key, value]) => {
      const field = storedFields.find((item) => item.getAttribute("data-store") === key);
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
          body: JSON.stringify({ state }),
        });
        if (!result.ok) {
          remoteAuthenticated = false;
          flashSaved("Online save failed. Saved locally.");
          return;
        }
        flashSaved("Saved online.");
      } catch {
        flashSaved("Offline. Saved locally.");
      }
    }, 450);
  }

  async function authenticateOnline(pin) {
    const result = await fetchJSON(API_AUTH_URL, {
      method: "POST",
      body: JSON.stringify({ pin }),
    });

    if (result.status === 404 || !result.data) {
      backendAvailable = false;
      throw new Error("Backend unavailable.");
    }

    backendAvailable = true;

    if (!result.ok || !result.data?.authenticated) {
      throw new Error(result.data?.error || "Incorrect PIN. Try again.");
    }

    remoteAuthenticated = true;
    const remoteState = result.data.state;

    if (hasRemoteData(remoteState)) {
      applyState(remoteState);
    } else {
      persistState("Connected. Local changes saved online.");
    }

    setDashboardVisible(true);
    dashboard?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  pinForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(pinForm);
    const pin = String(form.get("pin") || "").trim();

    pinStatus.textContent = "";
    pinStatus.classList.remove("error");

    try {
      await authenticateOnline(pin);
      return;
    } catch (error) {
      if (backendAvailable) {
        pinStatus.textContent = error.message || "Incorrect PIN. Try again.";
        pinStatus.classList.add("error");
        return;
      }
    }

    if (FALLBACK_PINS.includes(pin)) {
      setDashboardVisible(true);
      dashboard?.scrollIntoView({ behavior: "smooth", block: "start" });
      flashSaved("Backend unavailable. Saved locally on this browser.");
      return;
    }

    pinStatus.textContent = "Incorrect PIN. Try again.";
    pinStatus.classList.add("error");
  });

  lockDashboard?.addEventListener("click", async () => {
    remoteAuthenticated = false;
    setDashboardVisible(false);
    loginPanel?.scrollIntoView({ behavior: "smooth", block: "start" });

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

  async function bootstrapRemoteState() {
    try {
      const result = await fetchJSON(API_STATE_URL, { method: "GET" });
      if (result.status === 401) {
        backendAvailable = true;
        remoteAuthenticated = false;
        setDashboardVisible(false);
        return;
      }

      if (!result.ok || !result.data) return;

      backendAvailable = true;
      remoteAuthenticated = Boolean(result.data.authenticated);

      if (remoteAuthenticated) {
        applyState(result.data.state);
        setDashboardVisible(true);
        flashSaved("Connected to shared online data.");
      }
    } catch {
      backendAvailable = false;
      remoteAuthenticated = false;
    }
  }

  bootstrapRemoteState();
})();
