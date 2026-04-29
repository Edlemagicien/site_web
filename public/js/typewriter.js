/**
 * @file typewriter.js
 * @description Typewriter effect for elements with [data-typewriter].
 * Types the text content character by character, with an optional cursor blink.
 * Supports multiple phrases that cycle in a loop.
 *
 * Usage in HTML — single phrase:
 *   <p data-typewriter>L'impossible à portée de main</p>
 *
 * Usage — cycling phrases (comma-separated in data-phrases):
 *   <p data-typewriter
 *      data-phrases="Mariage & Vin d'honneur,Soirées d'entreprise,Fêtes privées"
 *      data-speed="60">
 *   </p>
 *
 * Attributes:
 *   data-typewriter   — activates the effect (required)
 *   data-phrases      — comma-separated list of phrases to cycle (optional)
 *   data-speed        — typing speed in ms per character (default: 55)
 *   data-pause        — pause duration between phrases in ms (default: 2200)
 *   data-delay        — initial delay before typing starts in ms (default: 400)
 */

(function () {
  'use strict';

  /** @type {number} Default typing speed (ms per character) */
  var DEFAULT_SPEED = 55;

  /** @type {number} Default pause between phrases (ms) */
  var DEFAULT_PAUSE = 2200;

  /** @type {number} Default initial delay (ms) */
  var DEFAULT_DELAY = 400;

  /**
   * Injects the blinking cursor CSS.
   */
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
   * Wraps the element's text content into a span + cursor element.
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
   * Types a single phrase into the textSpan character by character.
   * @param {HTMLElement} textSpan - The span to type into
   * @param {string}      phrase   - The text to type
   * @param {number}      speed    - Ms per character
   * @returns {Promise<void>}
   */
  function type(textSpan, phrase, speed) {
    return new Promise(function (resolve) {
      var i = 0;

      function tick() {
        if (i < phrase.length) {
          textSpan.textContent += phrase.charAt(i);
          i++;
          setTimeout(tick, speed + Math.random() * 25); // slight jitter for realism
        } else {
          resolve();
        }
      }

      tick();
    });
  }

  /**
   * Erases the current text in textSpan character by character.
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
          setTimeout(tick, speed * 0.5); // erase faster than type
        } else {
          resolve();
        }
      }

      tick();
    });
  }

  /**
   * Waits for a given duration.
   * @param {number} ms
   * @returns {Promise<void>}
   */
  function wait(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  /**
   * Runs the typewriter loop for a single element.
   * @param {HTMLElement} el
   */
  function runTypewriter(el) {
    var speed  = parseInt(el.getAttribute('data-speed'),  10) || DEFAULT_SPEED;
    var pause  = parseInt(el.getAttribute('data-pause'),  10) || DEFAULT_PAUSE;
    var delay  = parseInt(el.getAttribute('data-delay'),  10) || DEFAULT_DELAY;

    // Build phrases list
    var phrasesAttr = el.getAttribute('data-phrases');
    var phrases;

    if (phrasesAttr) {
      phrases = phrasesAttr.split(',').map(function (p) { return p.trim(); });
    } else {
      // Use original text content as single phrase
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
          // Single phrase — stop after typing, hide cursor
          parts.cursor.style.display = 'none';
          break;
        }
      }
    }

    loop();
  }

  /**
   * Finds all [data-typewriter] elements and initialises them.
   */
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