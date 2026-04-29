/**
 * @file cursor.js
 * @description Custom playing-card cursor with an interactive card picker.
 * - Card follows the mouse at a diagonal angle (like a real cursor)
 * - Click the card icon in the header to open the card picker
 * - Step-by-step selection: color → suit → rank
 * - Incomplete selections are randomised on exit
 * - Settings are saved to localStorage
 */

(function () {
  'use strict';

  /* ── DEFAULTS (used if no saved preference) ── */
  var DEFAULTS = {
    rank : null,   // null = random
    suit : null,   // null = random
    red  : null,   // null = random
  };

  /* ── CONFIG ── */
  var CARD_W     = 36;
  var CARD_H     = 50;
  var LERP       = 0.12;
  var MAX_ROTATE = 12;
  var STORAGE_KEY = 'edgar_cursor_card';

  /* ── STATE ── */
  var mouse   = { x: -300, y: -300 };
  var pos     = { x: -300, y: -300 };
  var prevPos = { x: -300, y: -300 };
  var vel     = { x: 0, y: 0 };
  var isVisible  = false;
  var isHovered  = false;
  var cursorEl   = null;
  var card       = {};

  var SUITS_RED   = ['♥', '♦'];
  var SUITS_BLACK = ['♠', '♣'];
  var RANKS_FACE  = ['J', 'Q', 'K', 'A'];
  var RANKS_PIP   = ['2','3','4','5','6','7','8','9','10'];

  var HOVER_SELECTORS = 'a, button, .btn-primary, .btn-secondary, .tc-card, .edgar-prestation-card, [data-cursor-hover]';

  /* ── HELPERS ── */
  function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, mn, mx) { return Math.min(Math.max(v, mn), mx); }

  /**
   * Resolves card config — fills nulls with random values.
   * @param {object} cfg
   * @returns {object}
   */
  function resolveCard(cfg) {
    var red  = cfg.red  !== null && cfg.red  !== undefined ? cfg.red  : Math.random() > 0.5;
    var suit = cfg.suit || rand(red ? SUITS_RED : SUITS_BLACK);
    // Ensure suit matches color
    if (red  && SUITS_BLACK.includes(suit)) suit = rand(SUITS_RED);
    if (!red && SUITS_RED.includes(suit))   suit = rand(SUITS_BLACK);
    var rank = cfg.rank || rand(Math.random() > 0.5 ? RANKS_FACE : RANKS_PIP);
    return { red: red, suit: suit, rank: rank };
  }

  /**
   * Saves card config to localStorage.
   * @param {object} cfg
   */
  function saveCard(cfg) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg)); } catch(e) {}
  }

  /**
   * Loads card config from localStorage.
   * @returns {object}
   */
  function loadCard() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return { red: null, suit: null, rank: null };
  }

  /* ── CURSOR DOM ── */

  function injectStyles() {
    if (document.getElementById('edgar-cursor-styles')) return;
    var style = document.createElement('style');
    style.id  = 'edgar-cursor-styles';
    style.textContent = `
      *, *::before, *::after { cursor: none !important; }

      #edgar-cursor {
        position: fixed;
        top: 0; left: 0;
        width: ${CARD_W}px;
        height: ${CARD_H}px;
        pointer-events: none;
        z-index: 99999;
        opacity: 0;
        will-change: transform;
        background: var(--card-bg, #fff);
        border: 1.5px solid var(--border, #90CAE8);
        border-radius: 5px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Cinzel', serif;
        font-weight: 700;
        user-select: none;
        transition: opacity 0.3s ease,
                    width 0.25s cubic-bezier(0.22,1,0.36,1),
                    height 0.25s cubic-bezier(0.22,1,0.36,1),
                    box-shadow 0.25s ease;
      }
      #edgar-cursor.is-visible { opacity: 1; }
      #edgar-cursor.is-hovered {
        width: ${Math.round(CARD_W * 1.45)}px;
        height: ${Math.round(CARD_H * 1.45)}px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2), 0 0 16px rgba(0,207,255,0.35);
        border-color: var(--accent, #00CFFF);
      }
      #edgar-cursor.is-clicking {
        width: ${Math.round(CARD_W * 0.85)}px;
        height: ${Math.round(CARD_H * 0.85)}px;
      }
      .ec-corner {
        position: absolute;
        font-size: 8px;
        line-height: 1.15;
        text-align: center;
      }
      .ec-corner.tl { top: 3px; left: 4px; }
      .ec-corner.br { bottom: 3px; right: 4px; transform: rotate(180deg); }
      .ec-center { font-size: 16px; line-height: 1; transition: font-size 0.25s ease; }
      #edgar-cursor.is-hovered .ec-center { font-size: 22px; }
      #edgar-cursor.is-clicking .ec-center { font-size: 12px; }

      /* ── PICKER TRIGGER in header ── */
      #edgar-card-trigger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px; height: 36px;
        background: var(--card-bg, #fff);
        border: 1.5px solid var(--border, #90CAE8);
        border-radius: 4px;
        cursor: pointer !important;
        font-family: 'Cinzel', serif;
        font-weight: 700;
        font-size: 13px;
        transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
        position: relative;
        box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        user-select: none;
      }
      #edgar-card-trigger:hover {
        border-color: var(--accent, #00CFFF);
        box-shadow: 0 0 10px rgba(0,207,255,0.3);
        transform: rotate(-5deg) scale(1.08);
      }
      #edgar-card-trigger .ect-rank {
        position: absolute;
        top: 2px; left: 3px;
        font-size: 7px; line-height: 1;
      }
      #edgar-card-trigger .ect-suit { font-size: 16px; }

      /* ── PICKER MODAL ── */
      #edgar-picker-overlay {
        position: fixed; inset: 0; z-index: 99998;
        background: rgba(5,13,46,0.7);
        display: flex; align-items: center; justify-content: center;
        opacity: 0; pointer-events: none;
        transition: opacity 0.3s ease;
      }
      #edgar-picker-overlay.open {
        opacity: 1; pointer-events: all;
      }
      #edgar-picker-box {
        background: var(--card-bg, #fff);
        border: 1.5px solid var(--border, #90CAE8);
        border-radius: 12px;
        padding: 2rem 2.5rem;
        min-width: 320px;
        max-width: 90vw;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(0,207,255,0.15);
        transform: scale(0.85);
        transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
        text-align: center;
        font-family: 'Cinzel', serif;
      }
      #edgar-picker-overlay.open #edgar-picker-box {
        transform: scale(1);
      }
      #edgar-picker-box h3 {
        font-size: 1rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--text, #0D1B6E);
        margin: 0 0 0.35rem;
      }
      #edgar-picker-box .ep-step {
        font-size: 0.7rem;
        letter-spacing: 0.1em;
        color: var(--text-2, #2A5080);
        margin-bottom: 1.5rem;
        text-transform: uppercase;
      }
      .ep-choices {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 1.5rem;
      }
      .ep-choice {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 72px; height: 100px;
        background: var(--bg, #E8F6FD);
        border: 1.5px solid var(--border, #90CAE8);
        border-radius: 8px;
        cursor: pointer !important;
        transition: all 0.2s;
        font-family: 'Cinzel', serif;
        font-weight: 700;
        gap: 0.3rem;
      }
      .ep-choice:hover {
        border-color: var(--accent, #00CFFF);
        box-shadow: 0 0 12px rgba(0,207,255,0.3);
        transform: translateY(-3px);
      }
      .ep-choice.selected {
        border-color: var(--accent, #00CFFF);
        background: var(--accent-glow, rgba(0,207,255,0.1));
      }
      .ep-choice-suit { font-size: 2rem; line-height: 1; }
      .ep-choice-label { font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-2, #2A5080); }
      .ep-choice-rank { font-size: 1.4rem; line-height: 1; }

      .ep-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 0.5rem;
      }
      .ep-btn {
        font-family: 'Cinzel', serif;
        font-size: 0.65rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        padding: 0.6rem 1.4rem;
        border-radius: 2px;
        border: 1.5px solid var(--border, #90CAE8);
        background: transparent;
        color: var(--text, #0D1B6E);
        cursor: pointer !important;
        transition: all 0.2s;
      }
      .ep-btn:hover { border-color: var(--accent, #00CFFF); color: var(--accent, #00CFFF); }
      .ep-btn.primary {
        background: var(--accent, #00CFFF);
        color: #fff;
        border-color: var(--accent, #00CFFF);
      }
      .ep-btn.primary:hover { background: transparent; color: var(--accent, #00CFFF); }

      .ep-progress {
        display: flex;
        justify-content: center;
        gap: 6px;
        margin-bottom: 1.5rem;
      }
      .ep-dot {
        width: 6px; height: 6px;
        border-radius: 50%;
        background: var(--border, #90CAE8);
        transition: background 0.2s;
      }
      .ep-dot.active { background: var(--accent, #00CFFF); }

      @media (hover: none) {
        *, *::before, *::after { cursor: auto !important; }
        #edgar-cursor { display: none !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function buildCursorEl() {
    var el = document.createElement('div');
    el.id  = 'edgar-cursor';
    el.innerHTML =
      '<div class="ec-corner tl" id="ec-tl"></div>' +
      '<div class="ec-center" id="ec-center"></div>' +
      '<div class="ec-corner br" id="ec-br"></div>';
    document.body.appendChild(el);
    return el;
  }

  /**
   * Updates the cursor card visuals.
   */
  function updateCursorVisual() {
    var color = card.red ? '#c0392b' : 'var(--text, #0D1B6E)';
    var tl = document.getElementById('ec-tl');
    var br = document.getElementById('ec-br');
    var ct = document.getElementById('ec-center');
    if (!tl) return;
    tl.style.color = color;
    br.style.color = color;
    ct.style.color = color;
    tl.innerHTML = card.rank + '<br>' + card.suit;
    br.innerHTML = card.rank + '<br>' + card.suit;
    ct.textContent = card.suit;
  }

  /* ── ANIMATION LOOP ── */

  function loop() {
    pos.x = lerp(pos.x, mouse.x, LERP);
    pos.y = lerp(pos.y, mouse.y, LERP);
    vel.x = pos.x - prevPos.x;
    vel.y = pos.y - prevPos.y;
    prevPos.x = pos.x;
    prevPos.y = pos.y;

    // Diagonal base angle ~-35deg like a real cursor, tilt on velocity
    var tiltZ = -35 + clamp(vel.x * 1.5, -MAX_ROTATE, MAX_ROTATE);
    var tiltX = clamp(vel.y * 0.6, -6, 6);

    cursorEl.style.transform =
      'translate3d(' + (pos.x) + 'px,' + (pos.y) + 'px,0)' +
      ' rotate(' + tiltZ + 'deg)' +
      ' rotateX(' + (-tiltX) + 'deg)';

    requestAnimationFrame(loop);
  }

  /* ── EVENT BINDINGS ── */

  function bindCursorEvents() {
    document.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!isVisible) {
        pos.x = mouse.x; pos.y = mouse.y;
        prevPos.x = mouse.x; prevPos.y = mouse.y;
        isVisible = true;
        cursorEl.classList.add('is-visible');
      }
    });

    document.addEventListener('mouseleave', function () {
      cursorEl.classList.remove('is-visible');
      isVisible = false;
    });

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(HOVER_SELECTORS)) {
        cursorEl.classList.add('is-hovered'); isHovered = true;
      }
    });

    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(HOVER_SELECTORS)) {
        cursorEl.classList.remove('is-hovered'); isHovered = false;
      }
    });

    document.addEventListener('mousedown', function () { cursorEl.classList.add('is-clicking'); });
    document.addEventListener('mouseup',   function () { cursorEl.classList.remove('is-clicking'); });
  }

  /* ── PICKER ── */

  var pickerState = { step: 0, red: null, suit: null, rank: null };

  var STEPS = ['Couleur', 'Symbole', 'Rang'];

  function buildTrigger() {
    var btn = document.createElement('div');
    btn.id = 'edgar-card-trigger';
    btn.title = 'Personnaliser le curseur';
    btn.innerHTML = '<span class="ect-rank" id="ect-rank"></span><span class="ect-suit" id="ect-suit"></span>';
    btn.addEventListener('click', openPicker);
    updateTriggerVisual(btn);
    return btn;
  }

  function updateTriggerVisual(btn) {
    var b = btn || document.getElementById('edgar-card-trigger');
    if (!b) return;
    var color = card.red ? '#c0392b' : 'var(--text, #0D1B6E)';
    b.style.color = color;
    var rk = b.querySelector('#ect-rank');
    var st = b.querySelector('#ect-suit');
    if (rk) rk.textContent = card.rank;
    if (st) st.textContent = card.suit;
  }

  function buildPickerOverlay() {
    var ov = document.createElement('div');
    ov.id = 'edgar-picker-overlay';
    ov.innerHTML =
      '<div id="edgar-picker-box">' +
        '<h3 id="ep-title">Votre carte</h3>' +
        '<div class="ep-step" id="ep-step"></div>' +
        '<div class="ep-progress" id="ep-progress"></div>' +
        '<div class="ep-choices" id="ep-choices"></div>' +
        '<div class="ep-actions">' +
          '<button class="ep-btn" id="ep-quit">Quitter</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);

    document.getElementById('ep-quit').addEventListener('click', closePicker);
    ov.addEventListener('click', function(e) {
      if (e.target === ov) closePicker();
    });
  }

  function openPicker() {
    pickerState = { step: 0, red: null, suit: null, rank: null };
    renderStep();
    document.getElementById('edgar-picker-overlay').classList.add('open');
  }

  function closePicker() {
    // Randomise unset values
    var cfg = {
      red:  pickerState.red  !== null ? pickerState.red  : Math.random() > 0.5,
      suit: pickerState.suit || null,
      rank: pickerState.rank || null,
    };
    applyCard(resolveCard(cfg));
    document.getElementById('edgar-picker-overlay').classList.remove('open');
  }

  function applyCard(resolved) {
    card = resolved;
    saveCard({ red: card.red, suit: card.suit, rank: card.rank });
    updateCursorVisual();
    updateTriggerVisual();
  }

  function renderStep() {
    var box      = document.getElementById('edgar-picker-box');
    var title    = document.getElementById('ep-title');
    var stepEl   = document.getElementById('ep-step');
    var progress = document.getElementById('ep-progress');
    var choices  = document.getElementById('ep-choices');

    title.textContent  = 'Votre carte';
    stepEl.textContent = 'Étape ' + (pickerState.step + 1) + ' / ' + STEPS.length + ' — ' + STEPS[pickerState.step];

    // Progress dots
    progress.innerHTML = '';
    STEPS.forEach(function(_, i) {
      var dot = document.createElement('div');
      dot.className = 'ep-dot' + (i <= pickerState.step ? ' active' : '');
      progress.appendChild(dot);
    });

    choices.innerHTML = '';

    if (pickerState.step === 0) {
      // Color choice
      [
        { label: 'Rouge', red: true,  suits: '♥ ♦' },
        { label: 'Noir',  red: false, suits: '♠ ♣' },
      ].forEach(function(opt) {
        var el = makeChoice(
          '<span class="ep-choice-suit" style="color:' + (opt.red ? '#c0392b' : 'var(--text)') + '">' + opt.suits + '</span>',
          opt.label
        );
        el.addEventListener('click', function() {
          pickerState.red = opt.red;
          pickerState.step = 1;
          renderStep();
        });
        choices.appendChild(el);
      });

    } else if (pickerState.step === 1) {
      // Suit choice
      var suits = pickerState.red ? SUITS_RED : SUITS_BLACK;
      var color = pickerState.red ? '#c0392b' : 'var(--text)';
      suits.forEach(function(suit) {
        var el = makeChoice(
          '<span class="ep-choice-suit" style="color:' + color + '">' + suit + '</span>',
          suit
        );
        el.addEventListener('click', function() {
          pickerState.suit = suit;
          pickerState.step = 2;
          renderStep();
        });
        choices.appendChild(el);
      });

    } else if (pickerState.step === 2) {
      // Rank choice — figures vs pip
      var color = pickerState.red ? '#c0392b' : 'var(--text)';

      // Figures
      var figGroup = document.createElement('div');
      figGroup.style.cssText = 'width:100%;text-align:center;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-2);margin-bottom:0.5rem;font-family:Cinzel,serif;';
      figGroup.textContent = 'Figures';
      choices.appendChild(figGroup);

      var figRow = document.createElement('div');
      figRow.className = 'ep-choices';
      figRow.style.marginBottom = '0.5rem';
      RANKS_FACE.forEach(function(rank) {
        var el = makeChoice(
          '<span class="ep-choice-rank" style="color:' + color + '">' + rank + '</span>' +
          '<span style="color:' + color + ';font-size:1rem;">' + (pickerState.suit || '♠') + '</span>',
          rank
        );
        el.addEventListener('click', function() { confirmRank(rank); });
        figRow.appendChild(el);
      });
      choices.appendChild(figRow);

      // Pip
      var pipGroup = figGroup.cloneNode(false);
      pipGroup.textContent = 'Cartes à points';
      choices.appendChild(pipGroup);

      var pipRow = document.createElement('div');
      pipRow.className = 'ep-choices';
      RANKS_PIP.forEach(function(rank) {
        var el = makeChoice(
          '<span class="ep-choice-rank" style="color:' + color + ';font-size:1.1rem;">' + rank + '</span>' +
          '<span style="color:' + color + ';font-size:0.9rem;">' + (pickerState.suit || '♠') + '</span>',
          rank
        );
        el.addEventListener('click', function() { confirmRank(rank); });
        pipRow.appendChild(el);
      });
      choices.appendChild(pipRow);
    }
  }

  function confirmRank(rank) {
    pickerState.rank = rank;
    var resolved = resolveCard({ red: pickerState.red, suit: pickerState.suit, rank: rank });
    applyCard(resolved);
    document.getElementById('edgar-picker-overlay').classList.remove('open');
  }

  function makeChoice(innerHTML, label) {
    var el = document.createElement('div');
    el.className = 'ep-choice';
    el.innerHTML = innerHTML + '<span class="ep-choice-label">' + label + '</span>';
    return el;
  }

  /* ── INJECT TRIGGER IN HEADER ── */

  function injectTrigger() {
    var actions = document.querySelector('.ed-header__actions');
    if (!actions) return;
    var trigger = buildTrigger();
    actions.insertBefore(trigger, actions.firstChild);
  }

  /* ── INIT ── */

  function isTouchDevice() {
    return window.matchMedia('(hover: none)').matches;
  }

  function init() {
    if (isTouchDevice()) return;

    // Load saved card or use random
    var saved = loadCard();
    card = resolveCard(saved);

    injectStyles();
    cursorEl = buildCursorEl();
    updateCursorVisual();
    bindCursorEvents();
    loop();

    buildPickerOverlay();
    injectTrigger();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();