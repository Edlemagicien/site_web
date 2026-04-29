/**
 * @file counters.js
 * @description Animate counter elements on scroll.
 */
(function () {
  'use strict';

  var DEFAULT_DURATION = 1800;

  /**
   * @param {number} t 
   * @returns {number} 
   */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * @param {HTMLElement} el 
   */
function animateCounter(el) {
  var target   = parseInt(el.getAttribute('data-counter'), 10);
  var duration = parseInt(el.getAttribute('data-duration'), 10) || DEFAULT_DURATION;
  var prefix   = el.getAttribute('data-prefix') || '';
  var suffix   = el.getAttribute('data-suffix') || '';
  var start    = null;

  el.textContent = prefix + '0' + suffix; 

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


function initCounters() {
  var elements = document.querySelectorAll('[data-counter]');
  if (!elements.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  elements.forEach(function (el) {
    observer.observe(el);
  });
}

  function init() {
    initCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();