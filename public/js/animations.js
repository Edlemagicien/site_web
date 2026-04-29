/**
 * @file animations.js
 * @description Scroll-reveal animations using IntersectionObserver.
 * Elements with [data-reveal] animate in when they enter the viewport.
 *
 * Usage in HTML:
 *   <div data-reveal>...</div>
 *   <div data-reveal="delay-1">...</div>  <!-- delay-1 to delay-5 -->
 *   <div data-reveal="fade-left">...</div>
 */

(function () {
  'use strict';

  /** @type {IntersectionObserverInit} */
  const OBSERVER_OPTIONS = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12,
  };

  /**
   * Injects the base CSS for reveal animations into the document head.
   * Keeps animation logic co-located with JS rather than requiring CSS edits.
   */
  function injectStyles() {
    if (document.getElementById('edgar-reveal-styles')) return;

    const style = document.createElement('style');
    style.id = 'edgar-reveal-styles';
    style.textContent = `
      [data-reveal] {
        opacity: 0;
        transform: translateY(32px);
        transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
      }
      [data-reveal="fade-left"] {
        transform: translateX(-32px);
      }
      [data-reveal="fade-right"] {
        transform: translateX(32px);
      }
      [data-reveal].is-visible,
      [data-reveal^="delay-"].is-visible,
      [data-reveal="fade-left"].is-visible,
      [data-reveal="fade-right"].is-visible {
        opacity: 1;
        transform: translate(0, 0);
      }
      [data-reveal^="delay-"] {
        opacity: 0;
        transform: translateY(32px);
      }
      [data-reveal="delay-1"].is-visible { transition-delay: 0.1s; }
      [data-reveal="delay-2"].is-visible { transition-delay: 0.2s; }
      [data-reveal="delay-3"].is-visible { transition-delay: 0.3s; }
      [data-reveal="delay-4"].is-visible { transition-delay: 0.4s; }
      [data-reveal="delay-5"].is-visible { transition-delay: 0.5s; }
    `;
    document.head.appendChild(style);
  }

  /**
   * Creates and starts the IntersectionObserver.
   * Adds 'is-visible' class to elements when they enter the viewport,
   * then unobserves them for performance.
   */
  function initReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // observe once only
        }
      });
    }, OBSERVER_OPTIONS);

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /**
   * Initialises animations once the DOM is ready.
   */
  function init() {
    injectStyles();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();