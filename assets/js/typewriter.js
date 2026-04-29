/**
 * @file typewriter.js
 * @description permet d'avoir un effet de machine à écrire sur n'importe quel élément avec l'attribut data-typewriter, avec personnalisation possible via des attributs data-speed, data-pause, data-delay et data-phrases.
 */
(function () {
  'use strict';

  /** @type {number} vitesse de frappe */
  var DEFAULT_SPEED = 55;

  /** @type {number} Pause en ms */
  var DEFAULT_PAUSE = 2200;

  /** @type {number} Délai initial en ms */
  var DEFAULT_DELAY = 400;

 
  function injectStyles() {
    if (document.getElementById('edgar-typewriter-styles')) return;

    var style = document.createElement('style');
    style.id = 'edgar-typewriter-styles';
    style.textContent = `
      [data-typewriter] {
        display: inline-block;
        min-height: 1.5em;
      }
      .tw-cursor {
        display: inline-block;
        width: 2px;
        height: 1em;
        background: var(--accent, #00CFFF);
        margin-left: 2px;
        vertical-align: middle;
        animation: tw-blink 0.75s step-end infinite;
      }
      @keyframes tw-blink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * @param {HTMLElement} el
   * @returns {{ textSpan: HTMLElement, cursor: HTMLElement }}
   */
  function setupElement(el) {
    el.textContent = '';

    var textSpan = document.createElement('span');
    textSpan.className = 'tw-text';

    var cursor = document.createElement('span');
    cursor.className = 'tw-cursor';
    cursor.setAttribute('aria-hidden', 'true');

    el.appendChild(textSpan);
    el.appendChild(cursor);

    return { textSpan: textSpan, cursor: cursor };
  }

  /**
   * @param {HTMLElement} textSpan - l'élément où le texte est tapé
   * @param {string}      phrase   - la phrase à taper
   * @param {number}      speed    - vitesse de frappe en ms par caractère
   * @returns {Promise<void>}
   */
  function type(textSpan, phrase, speed) {
    return new Promise(function (resolve) {
      var i = 0;

      function tick() {
        if (i < phrase.length) {
          textSpan.textContent += phrase.charAt(i);
          i++;
          setTimeout(tick, speed + Math.random() * 25);
        } else {
          resolve();
        }
      }

      tick();
    });
  }

  /**
   * @param {HTMLElement} textSpan
   * @param {number}      speed
   * @returns {Promise<void>}
   */
  function erase(textSpan, speed) {
    return new Promise(function (resolve) {
      function tick() {
        var text = textSpan.textContent;
        if (text.length > 0) {
          textSpan.textContent = text.slice(0, -1);
          setTimeout(tick, speed * 0.5); 
        } else {
          resolve();
        }
      }

      tick();
    });
  }

  /**
   * @param {number} ms
   * @returns {Promise<void>}
   */
  function wait(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  /**
   * @param {HTMLElement} el
   */
  function runTypewriter(el) {
    var speed  = parseInt(el.getAttribute('data-speed'),  10) || DEFAULT_SPEED;
    var pause  = parseInt(el.getAttribute('data-pause'),  10) || DEFAULT_PAUSE;
    var delay  = parseInt(el.getAttribute('data-delay'),  10) || DEFAULT_DELAY;

    var phrasesAttr = el.getAttribute('data-phrases');
    var phrases;

    if (phrasesAttr) {
      phrases = phrasesAttr.split(',').map(function (p) { return p.trim(); });
    } else {
      var original = el.textContent.trim();
      phrases = original ? [original] : [''];
    }

    var parts = setupElement(el);
    var textSpan = parts.textSpan;
    var isCycling = phrases.length > 1;
    var index = 0;

    /**
     * Main async loop.
     */
    async function loop() {
      await wait(delay);

      while (true) {
        var phrase = phrases[index];

        await type(textSpan, phrase, speed);
        await wait(pause);

        if (isCycling) {
          await erase(textSpan, speed);
          await wait(300);
          index = (index + 1) % phrases.length;
        } else {
          parts.cursor.style.display = 'none';
          break;
        }
      }
    }

    loop();
  }

  function init() {
    injectStyles();

    var elements = document.querySelectorAll('[data-typewriter]');
    elements.forEach(function (el) {
      runTypewriter(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();