/* ============================================================
   LIFE JOURNEY — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ── Theme Toggle ─────────────────────────────────────────

  const THEME_KEY = 'lj-theme';
  const htmlEl = document.documentElement;

  function getStoredTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem(THEME_KEY, theme);
  }

  function toggleTheme() {
    const current = htmlEl.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Apply stored theme immediately (before DOM paint)
  applyTheme(getStoredTheme());

  document.addEventListener('DOMContentLoaded', function () {

    // ── Theme Button ───────────────────────────────────────
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
      // Update icon to match current theme
      themeBtn.textContent = getStoredTheme() === 'dark' ? '🌙' : '☀️';
    }

    // ── Hamburger / Mobile Menu ────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function () {
        const isOpen = hamburger.classList.toggle('open');
        if (isOpen) {
          mobileMenu.classList.add('open');
          mobileMenu.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        } else {
          closeMobileMenu();
        }
      });

      // Close mobile menu on link click
      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
      });

      // Close on outside click
      document.addEventListener('click', function (e) {
        if (
          mobileMenu.classList.contains('open') &&
          !mobileMenu.contains(e.target) &&
          !hamburger.contains(e.target)
        ) {
          closeMobileMenu();
        }
      });
    }

    function closeMobileMenu() {
      if (hamburger) hamburger.classList.remove('open');
      if (mobileMenu) {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        // Delay hiding to allow fade transition
        setTimeout(function () {
          if (!mobileMenu.classList.contains('open')) {
            mobileMenu.style.display = '';
          }
        }, 350);
      }
    }

    // ── Scroll Reveal ──────────────────────────────────────
    const revealEls = document.querySelectorAll('.reveal');

    if (revealEls.length > 0) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      revealEls.forEach(function (el) {
        observer.observe(el);
      });
    }

    // ── Contact Form Validation ────────────────────────────
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateForm()) {
          submitForm();
        }
      });

      // Live validation on blur
      ['firstName', 'lastName', 'email', 'message'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('blur', function () { validateField(id); });
          el.addEventListener('input', function () {
            if (el.classList.contains('error')) validateField(id);
          });
        }
      });
    }

    function validateField(id) {
      const el = document.getElementById(id);
      const err = document.getElementById(id + 'Error');
      if (!el || !err) return true;

      let valid = true;
      const val = el.value.trim();

      if (id === 'email') {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      } else if (id === 'message') {
        valid = val.length >= 20;
      } else if (id === 'subject') {
        valid = val !== '';
      } else {
        valid = val.length > 0;
      }

      if (valid) {
        el.classList.remove('error');
        err.classList.remove('show');
      } else {
        el.classList.add('error');
        err.classList.add('show');
      }

      return valid;
    }

    function validateForm() {
      const fields = ['firstName', 'lastName', 'email', 'subject', 'message'];
      return fields.map(validateField).every(Boolean);
    }

    function submitForm() {
      const btn = document.getElementById('submitBtn');
      const text = document.getElementById('submitText');

      if (btn) {
        btn.disabled = true;
        if (text) text.textContent = 'Sending…';
      }

      // Simulate async send
      setTimeout(function () {
        const formContent = document.getElementById('formContent');
        const formSuccess = document.getElementById('formSuccess');
        if (formContent) formContent.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('show');
        if (btn) btn.disabled = false;
        if (text) text.textContent = 'Send Message →';
      }, 1200);
    }

    // ── Smooth Scroll for Anchor Links ────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const navH = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--nav-h')) || 72;
          const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    // ── Nav Scroll Behaviour ──────────────────────────────
    let lastScroll = 0;
    const nav = document.getElementById('nav');

    window.addEventListener('scroll', function () {
      const current = window.scrollY;
      if (nav) {
        if (current > 20) {
          nav.style.background = 'rgba(10,10,15,0.92)';
        } else {
          nav.style.background = '';
        }
      }
      lastScroll = current;
    }, { passive: true });

  }); // end DOMContentLoaded

  // ── Reset Form (global for inline onclick) ─────────────
  window.resetForm = function () {
    const formContent = document.getElementById('formContent');
    const formSuccess = document.getElementById('formSuccess');
    const form = document.getElementById('contactForm');
    if (formContent) formContent.style.display = '';
    if (formSuccess) formSuccess.classList.remove('show');
    if (form) form.reset();
    document.querySelectorAll('.form-error').forEach(function (el) {
      el.classList.remove('show');
    });
    document.querySelectorAll('.error').forEach(function (el) {
      el.classList.remove('error');
    });
  };

})();
