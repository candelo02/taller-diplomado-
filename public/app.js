document.addEventListener('DOMContentLoaded', () => {
  let currentUserId = 'user_123';
  let currentTheme = 'light';

  // DOM Elements - Feature Flag Panel
  const toggleEnabled = document.getElementById('toggle-enabled');
  const badgeEnabled = document.getElementById('badge-enabled');
  const rangeVisible = document.getElementById('range-visible');
  const labelVisiblePct = document.getElementById('label-visible-pct');
  const togglePersistence = document.getElementById('toggle-persistence');
  const badgePersistence = document.getElementById('badge-persistence');
  const userIdInput = document.getElementById('user-id-input');
  const btnApplyUser = document.getElementById('btn-apply-user');

  // DOM Elements - UI Theme & Banners
  const themeToggleContainer = document.getElementById('theme-toggle-container');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const bannerTicket1Off = document.getElementById('banner-ticket1-off');
  const bannerTicket2Off = document.getElementById('banner-ticket2-off');

  // Cargar flags y preferencia inicial
  loadFeatureFlags();

  // Event Listeners Panel Flags
  toggleEnabled.addEventListener('change', async () => {
    await updateFlagOnServer('dark_mode_enabled', toggleEnabled.checked);
    refreshView();
  });

  rangeVisible.addEventListener('change', async () => {
    labelVisiblePct.textContent = `${rangeVisible.value}%`;
    await updateFlagOnServer('dark_mode_visible_percentage', parseInt(rangeVisible.value, 10));
    refreshView();
  });

  togglePersistence.addEventListener('change', async () => {
    await updateFlagOnServer('dark_mode_persistence_enabled', togglePersistence.checked);
    refreshView();
  });

  btnApplyUser.addEventListener('click', () => {
    currentUserId = userIdInput.value.trim() || 'anonymous';
    refreshView();
  });

  // Toggle Button Click
  themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);

    // Ticket 3: Persistencia en localStorage y Backend si la persistencia está activa
    if (togglePersistence.checked && toggleEnabled.checked) {
      localStorage.setItem(`theme_${currentUserId}`, currentTheme);
      savePreferenceToBackend(currentUserId, currentTheme);
    }
  });

  async function loadFeatureFlags() {
    try {
      const res = await fetch('/api/feature-flags', {
        headers: { 'X-User-Id': currentUserId }
      });
      const data = await res.json();
      const raw = data.raw_flags;

      toggleEnabled.checked = raw.dark_mode_enabled;
      updateBadge(badgeEnabled, raw.dark_mode_enabled);

      rangeVisible.value = raw.dark_mode_visible_percentage;
      labelVisiblePct.textContent = `${raw.dark_mode_visible_percentage}%`;

      togglePersistence.checked = raw.dark_mode_persistence_enabled;
      updateBadge(badgePersistence, raw.dark_mode_persistence_enabled);

      await refreshView();
    } catch (err) {
      console.error('Error cargando flags:', err);
    }
  }

  async function refreshView() {
    updateBadge(badgeEnabled, toggleEnabled.checked);
    updateBadge(badgePersistence, togglePersistence.checked);

    try {
      const res = await fetch('/api/feature-flags', {
        headers: { 'X-User-Id': currentUserId }
      });
      const evaluation = await res.json();

      // Ticket 1: Si dark_mode_enabled es false, forzar tema light y mostrar banner
      if (!evaluation.dark_mode_enabled) {
        bannerTicket1Off.classList.remove('hidden');
        bannerTicket2Off.classList.add('hidden');
        themeToggleContainer.classList.add('hidden');
        applyTheme('light');
        return;
      }

      bannerTicket1Off.classList.add('hidden');

      // Ticket 2: Evaluación de visibilidad por % de rollout
      if (evaluation.dark_mode_visible) {
        bannerTicket2Off.classList.add('hidden');
        themeToggleContainer.classList.remove('hidden');
      } else {
        bannerTicket2Off.classList.remove('hidden');
        themeToggleContainer.classList.add('hidden');
        applyTheme('light');
        return;
      }

      // Ticket 3: Cargar preferencia persistida si aplica
      if (evaluation.dark_mode_persistence) {
        const savedLocal = localStorage.getItem(`theme_${currentUserId}`);
        if (savedLocal) {
          currentTheme = savedLocal;
        } else {
          const prefRes = await fetch('/api/user-preferences', {
            headers: { 'X-User-Id': currentUserId }
          });
          const prefData = await prefRes.json();
          if (prefData.theme) {
            currentTheme = prefData.theme;
          }
        }
      }

      applyTheme(currentTheme);
    } catch (err) {
      console.error('Error actualizando vista:', err);
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  async function updateFlagOnServer(flag, value) {
    try {
      await fetch('/api/feature-flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flag, value })
      });
    } catch (err) {
      console.error('Error actualizando flag:', err);
    }
  }

  async function savePreferenceToBackend(userId, theme) {
    try {
      await fetch('/api/user-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({ theme })
      });
    } catch (err) {
      console.error('Error guardando preferencia en backend:', err);
    }
  }

  function updateBadge(badgeElement, isOn) {
    badgeElement.textContent = isOn ? 'ON' : 'OFF';
    if (isOn) {
      badgeElement.classList.add('on');
    } else {
      badgeElement.classList.remove('on');
    }
  }
});
