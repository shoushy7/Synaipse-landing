/* ==========================================================================
   Synaipse – Shared JavaScript
   Mobile navigation, form validation, scroll handlers
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Mobile Menu Toggle ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    var menuBtn = document.querySelector('.mobile-menu-btn');
    var mobileMenu = document.querySelector('.mobile-menu');

    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', function () {
        var isOpen = mobileMenu.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', isOpen);
        menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      });

      // Close menu when a link is clicked
      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          mobileMenu.classList.remove('open');
          menuBtn.setAttribute('aria-expanded', 'false');
          menuBtn.setAttribute('aria-label', 'Open menu');
        });
      });

      // Close menu on Escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
          mobileMenu.classList.remove('open');
          menuBtn.setAttribute('aria-expanded', 'false');
          menuBtn.setAttribute('aria-label', 'Open menu');
          menuBtn.focus();
        }
      });
    }

    /* ---------- "Back to all articles" scroll (replaces inline onclick) ---------- */
    document.querySelectorAll('.back-link[data-scroll-top]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    /* ---------- Contact Form Validation ---------- */
    var contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        var valid = true;

        contactForm.querySelectorAll('.form-group').forEach(function (group) {
          group.classList.remove('invalid');
        });

        contactForm.querySelectorAll('[required]').forEach(function (input) {
          var group = input.closest('.form-group');
          if (!input.value.trim()) {
            if (group) group.classList.add('invalid');
            valid = false;
          }
          // Email pattern check
          if (input.type === 'email' && input.value.trim()) {
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value.trim())) {
              if (group) group.classList.add('invalid');
              valid = false;
            }
          }
        });

        if (!valid) {
          e.preventDefault();
          var firstInvalid = contactForm.querySelector('.form-group.invalid input, .form-group.invalid textarea, .form-group.invalid select');
          if (firstInvalid) firstInvalid.focus();
        }
      });
    }

    /* ---------- Subscribe Form Validation ---------- */
    var subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
      subscribeForm.addEventListener('submit', function (e) {
        var emailInput = subscribeForm.querySelector('input[type="email"]');
        if (emailInput && !emailInput.value.trim()) {
          e.preventDefault();
          emailInput.focus();
        }
      });
    }
  });
})();
