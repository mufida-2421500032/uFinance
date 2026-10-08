/* ============================================
   THEME — uFinance
   Light/Dark toggle + Color Presets + Custom Colors
   + Font Selector + User Name system
   ============================================ */

// ========== PRESETS ==========
const colorPresets = {
  rose:     { primary: '#FF2D78', secondary: '#7C3AED', accent: '#FF6B9D', label: 'Rose' },
  ocean:    { primary: '#0EA5E9', secondary: '#6366F1', accent: '#38BDF8', label: 'Ocean' },
  emerald:  { primary: '#10B981', secondary: '#14B8A6', accent: '#34D399', label: 'Emerald' },
  sunset:   { primary: '#F97316', secondary: '#EF4444', accent: '#FB923C', label: 'Sunset' },
  lavender: { primary: '#8B5CF6', secondary: '#A855F7', accent: '#C084FC', label: 'Lavender' },
  midnight: { primary: '#6366F1', secondary: '#4F46E5', accent: '#818CF8', label: 'Midnight' },
};

const fontOptions = [
  { family: 'Inter', css: "'Inter', sans-serif", label: 'Inter' },
  { family: 'Poppins', css: "'Poppins', sans-serif", label: 'Poppins' },
  { family: 'Outfit', css: "'Outfit', sans-serif", label: 'Outfit' },
  { family: 'Space Grotesk', css: "'Space Grotesk', sans-serif", label: 'Space Grotesk' },
  { family: 'DM Serif Display', css: "'DM Serif Display', serif", label: 'DM Serif' },
  { family: 'Playfair Display', css: "'Playfair Display', serif", label: 'Playfair' },
  { family: 'Arvo', css: "'Arvo', serif", label: 'Arvo' },
];

// ========== DEFAULTS ==========
function getDefaults() {
  return {
    mode: 'light',
    preset: 'rose',
    colors: { primary: '#FF2D78', secondary: '#7C3AED', accent: '#FF6B9D' },
    font: fontOptions[0],
    user: { name: '' },
  };
}

// ========== LOAD / SAVE ==========
function loadSettings() {
  try {
    const raw = localStorage.getItem('ufinance_settings');
    if (!raw) {
      // Migrate old data
      const oldTheme = localStorage.getItem('theme_settings');
      if (oldTheme) {
        const parsed = JSON.parse(oldTheme);
        const defaults = getDefaults();
        defaults.user = parsed.user || { name: '' };
        return defaults;
      }
      return getDefaults();
    }
    const parsed = JSON.parse(raw);
    const defaults = getDefaults();
    return {
      mode: parsed.mode || defaults.mode,
      preset: parsed.preset || defaults.preset,
      colors: { ...defaults.colors, ...(parsed.colors || {}) },
      font: parsed.font && parsed.font.family ? parsed.font : defaults.font,
      user: { ...defaults.user, ...(parsed.user || {}) },
    };
  } catch (e) {
    return getDefaults();
  }
}

function saveSettings(settings) {
  localStorage.setItem('ufinance_settings', JSON.stringify(settings));
  // Also keep backwards compat for user name
  localStorage.setItem('theme_settings', JSON.stringify({ user: settings.user }));
}

// ========== APPLY ==========
function applyTheme(settings) {
  const root = document.documentElement;

  // Dark / Light mode
  root.setAttribute('data-theme', settings.mode);

  // Colors
  root.style.setProperty('--primary', settings.colors.primary);
  root.style.setProperty('--primary-light', settings.colors.accent);
  root.style.setProperty('--secondary', settings.colors.secondary);

  // Generate gradient
  root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${settings.colors.primary} 0%, ${settings.colors.accent} 100%)`);
  root.style.setProperty('--gradient-secondary', `linear-gradient(135deg, ${settings.colors.secondary} 0%, ${lightenColor(settings.colors.secondary, 30)} 100%)`);
  root.style.setProperty('--gradient-mixed', `linear-gradient(135deg, ${settings.colors.primary} 0%, ${settings.colors.secondary} 100%)`);

  // Font
  root.style.setProperty('--font-main', settings.font.css);
  document.body.style.fontFamily = settings.font.css;

  // Update all theme toggle icons
  updateThemeIcons(settings.mode);
}

function lightenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * percent / 100));
  const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(255 * percent / 100));
  const b = Math.min(255, (num & 0x0000FF) + Math.round(255 * percent / 100));
  return `#${(0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function updateThemeIcons(mode) {
  const isDark = mode === 'dark';
  document.querySelectorAll('.theme-switch-icon').forEach((el) => {
    el.textContent = isDark ? 'light_mode' : 'dark_mode';
  });
  document.querySelectorAll('.theme-switch-label').forEach((el) => {
    el.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  });
}

// ========== THEME TOGGLE ==========
function toggleTheme() {
  const settings = loadSettings();
  settings.mode = settings.mode === 'dark' ? 'light' : 'dark';
  saveSettings(settings);
  applyTheme(settings);
}

// ========== USER NAME ==========
function getUserName() {
  // Nama bawaan = nama akun yang login. Nama yang diedit manual disimpan per akun
  // (supaya tidak tertukar kalau beberapa akun memakai browser yang sama).
  const accountName = (window.APP && window.APP.userName || '').trim();
  const uid = window.APP && window.APP.userId;
  const user = loadSettings().user || {};
  if (uid && String(user.owner) !== String(uid)) return accountName || null;
  return user.name?.trim() || accountName || null;
}

function saveUserName(name) {
  const settings = loadSettings();
  settings.user = { name: name.trim().slice(0, 30), owner: (window.APP && window.APP.userId) || null };
  saveSettings(settings);
}

function applyUserName() {
  const name = getUserName();
  document.querySelectorAll('.user-name-display').forEach((el) => {
    el.textContent = name || 'User';
  });
}

function setGreetingDate() {
  const target = document.querySelector('#greeting-date');
  if (!target) return;
  target.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ========== NAME MODAL ==========
function mountNameModal() {
  if (document.querySelector('#modal-name')) return;
  document.body.insertAdjacentHTML('beforeend', `
    <div id="modal-name" class="u-modal-overlay">
      <div class="u-modal" style="max-width: 420px; width: 90%;">
        <div class="u-modal__head">
          <h2 class="u-modal__title">What is your name?</h2>
        </div>
        <div>
          <input type="text" id="input-user-name" class="u-input" placeholder="Enter your name..." maxlength="30">
          <p class="input-hint">This name is only stored on your device.</p>
        </div>
        <div class="u-modal__footer" style="display: flex; gap: var(--space-sm);">
          <button class="u-btn u-btn--secondary" style="flex:1;" type="button" id="cancelUserName">Cancel</button>
          <button class="u-btn u-btn--primary" style="flex:1;" type="button" id="saveUserName">Save</button>
        </div>
      </div>
    </div>
  `);
  document.querySelector('#saveUserName').addEventListener('click', submitUserName);
  document.querySelector('#cancelUserName').addEventListener('click', closeNameModal);
  document.querySelector('#input-user-name').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitUserName();
  });
}

function openNameModal() {
  mountNameModal();
  const input = document.querySelector('#input-user-name');
  input.value = getUserName() || '';
  document.querySelector('#modal-name').classList.add('open');
  input.focus();
}

function closeNameModal() {
  const modal = document.querySelector('#modal-name');
  if (modal) modal.classList.remove('open');
}

function submitUserName() {
  const input = document.querySelector('#input-user-name');
  const name = input.value.trim().slice(0, 30);
  if (!name) return;
  saveUserName(name);
  applyUserName();
  closeNameModal();
}

function checkUserName() {
  if (!getUserName()) openNameModal();
}

// ========== THEME CUSTOMIZER ==========
function mountThemeCustomizer() {
  const settings = loadSettings();

  const presetsHtml = Object.entries(colorPresets).map(([key, preset]) =>
    `<button type="button" class="preset-btn${settings.preset === key ? ' active' : ''}" data-preset="${key}">
      <span class="preset-swatch" style="background:${preset.primary}"></span>
      ${preset.label}
    </button>`
  ).join('');

  const fontsHtml = fontOptions.map((font) =>
    `<button type="button" class="font-btn${settings.font.family === font.family ? ' active' : ''}" data-font="${font.family}" style="font-family:${font.css}">
      ${font.label}
    </button>`
  ).join('');

  document.body.insertAdjacentHTML('beforeend', `
    <button id="themeFab" class="theme-fab" data-tooltip="Theme Customizer">palette</button>
    <aside id="themeCustomizer" class="theme-customizer">
      <div class="theme-customizer__head">
        <h3><span class="material-symbols-rounded">palette</span> Theme</h3>
        <button type="button" id="themeClose" class="u-btn u-btn--icon">
          <span class="material-symbols-rounded icon-sm">close</span>
        </button>
      </div>
      <div class="theme-customizer__body">
        <div class="theme-section">
          <h4 class="theme-section__title">Color Presets</h4>
          <div class="preset-grid" id="presetGrid">${presetsHtml}</div>
        </div>
        <div class="theme-section">
          <h4 class="theme-section__title">Custom Colors</h4>
          <div class="color-row"><label>Primary</label><input type="color" id="cPrimary" value="${settings.colors.primary}"></div>
          <div class="color-row"><label>Secondary</label><input type="color" id="cSecondary" value="${settings.colors.secondary}"></div>
          <div class="color-row"><label>Accent</label><input type="color" id="cAccent" value="${settings.colors.accent}"></div>
        </div>
        <div class="theme-section">
          <h4 class="theme-section__title">Typography</h4>
          <div class="font-grid" id="fontGrid">${fontsHtml}</div>
          <div class="font-preview" id="fontPreview" style="font-family:${settings.font.css}">
            <strong>Aa</strong>
            The quick brown fox jumps<br>
            1234567890 — Rp 450.000
          </div>
        </div>
      </div>
      <div class="theme-actions">
        <button type="button" id="themeReset" class="u-btn u-btn--secondary">
          <span class="material-symbols-rounded icon-sm">restart_alt</span> Reset
        </button>
        <button type="button" id="themeApply" class="u-btn u-btn--primary">
          <span class="material-symbols-rounded icon-sm">check</span> Apply
        </button>
      </div>
    </aside>
  `);

  // — Bindings —
  const panel = document.querySelector('#themeCustomizer');
  const fab = document.querySelector('#themeFab');
  const colorInputs = {
    primary: document.querySelector('#cPrimary'),
    secondary: document.querySelector('#cSecondary'),
    accent: document.querySelector('#cAccent'),
  };

  fab.addEventListener('click', () => {
    panel.classList.toggle('open');
    fab.classList.toggle('hidden');
  });
  document.querySelector('#themeClose').addEventListener('click', () => {
    panel.classList.remove('open');
    fab.classList.remove('hidden');
  });

  // Presets
  document.querySelector('#presetGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-preset]');
    if (!btn) return;
    const key = btn.dataset.preset;
    const preset = colorPresets[key];
    colorInputs.primary.value = preset.primary;
    colorInputs.secondary.value = preset.secondary;
    colorInputs.accent.value = preset.accent;
    document.querySelectorAll('.preset-btn').forEach((b) => b.classList.toggle('active', b.dataset.preset === key));
    const s = loadSettings();
    s.preset = key;
    s.colors = { ...preset };
    delete s.colors.label;
    applyTheme(s);
  });

  // Custom colors (live preview)
  Object.values(colorInputs).forEach((input) => {
    input.addEventListener('input', () => {
      const s = loadSettings();
      s.colors.primary = colorInputs.primary.value;
      s.colors.secondary = colorInputs.secondary.value;
      s.colors.accent = colorInputs.accent.value;
      s.preset = 'custom';
      document.querySelectorAll('.preset-btn').forEach((b) => b.classList.remove('active'));
      applyTheme(s);
    });
  });

  // Fonts
  document.querySelector('#fontGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-font]');
    if (!btn) return;
    const font = fontOptions.find((f) => f.family === btn.dataset.font);
    if (!font) return;
    document.querySelectorAll('.font-btn').forEach((b) => b.classList.toggle('active', b.dataset.font === font.family));
    document.querySelector('#fontPreview').style.fontFamily = font.css;
    const s = loadSettings();
    s.font = font;
    applyTheme(s);
  });

  // Apply (save)
  document.querySelector('#themeApply').addEventListener('click', () => {
    const s = loadSettings();
    s.colors.primary = colorInputs.primary.value;
    s.colors.secondary = colorInputs.secondary.value;
    s.colors.accent = colorInputs.accent.value;
    const activePreset = document.querySelector('.preset-btn.active');
    s.preset = activePreset ? activePreset.dataset.preset : 'custom';
    const activeFont = document.querySelector('.font-btn.active');
    if (activeFont) {
      s.font = fontOptions.find((f) => f.family === activeFont.dataset.font) || fontOptions[0];
    }
    saveSettings(s);
    applyTheme(s);
    panel.classList.remove('open');
    fab.classList.remove('hidden');
  });

  // Reset
  document.querySelector('#themeReset').addEventListener('click', () => {
    const defaults = getDefaults();
    defaults.user = loadSettings().user; // preserve user name
    defaults.mode = loadSettings().mode; // preserve mode
    colorInputs.primary.value = defaults.colors.primary;
    colorInputs.secondary.value = defaults.colors.secondary;
    colorInputs.accent.value = defaults.colors.accent;
    document.querySelectorAll('.preset-btn').forEach((b) => b.classList.toggle('active', b.dataset.preset === 'rose'));
    document.querySelectorAll('.font-btn').forEach((b) => b.classList.toggle('active', b.dataset.font === 'Inter'));
    document.querySelector('#fontPreview').style.fontFamily = defaults.font.css;
    saveSettings(defaults);
    applyTheme(defaults);
  });
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  const settings = loadSettings();
  applyTheme(settings);
  mountThemeCustomizer();
  mountNameModal();
  applyUserName();
  setGreetingDate();
  checkUserName();

  // Bind sidebar dark/light toggle
  document.querySelectorAll('[data-toggle-theme]').forEach((btn) => {
    btn.addEventListener('click', toggleTheme);
  });
});
