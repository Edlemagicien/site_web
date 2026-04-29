/**
 * @file counters.js
 * @description Animated number counters triggered by IntersectionObserver.
 * Elements with [data-counter] animate from 0 to their target value.
 *
 * Usage in HTML:
 *   <span data-counter="200" data-suffix="+">200+</span>
 *   <span data-counter="98" data-suffix="%" data-duration="1500">98%</span>
 *   <span data-counter="5" data-prefix="" data-label="ans">5</span>
 */

(function () {
  'use strict';

  /** Default animation duration in milliseconds */
  var DEFAULT_DURATION = 1800;

  /**
   * Easing function — ease out cubic.
   * @param {number} t - Progress from 0 to 1
   * @returns {number} Eased value
   */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * Animates a single counter element from 0 to its target value.
   * @param {HTMLElement} el - The element to animate
   */
function animateCounter(el) {
  var target   = parseInt(el.getAttribute('data-counter'), 10);
  var duration = parseInt(el.getAttribute('data-duration'), 10) || DEFAULT_DURATION;
  var prefix   = el.getAttribute('data-prefix') || '';
  var suffix   = el.getAttribute('data-suffix') || '';
  var start    = null;

  el.textContent = prefix + '0' + suffix; // ← reset à 0 avant de rejouer

  function step(timestamp) {
    if (!start) start = timestamp;
    var elapsed  = timestamp - start;
    var progress = Math.min(elapsed / duration, 1);
    var eased    = easeOutCubic(progress);
    var current  = Math.round(eased * target);
    el.textContent = prefix + current + suffix;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = prefix + target + suffix;
    }
  }

  requestAnimationFrame(step);
}

  /**
   * Sets up IntersectionObserver to trigger counters when visible.
   * Each counter animates once and is then unobserved.
   */
function initCounters() {
  var elements = document.querySelectorAll('[data-counter]');
  if (!elements.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target); // pas de unobserve → rejoue à chaque fois
      }
    });
  }, { threshold: 0.5 });

  elements.forEach(function (el) {
    observer.observe(el);
  });
}
  /**
   * Initialises counters once the DOM is ready.
   */
  function init() {
    initCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();