(function () {
  'use strict';

  // Smooth scroll for anchor links (backup for older browsers)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Subtle fade-in on scroll for sections (skip hero so it's visible immediately)
  var sections = document.querySelectorAll('.section:not(.hero)');
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { rootMargin: '-10% 0px -10% 0px', threshold: 0 }
  );
  sections.forEach(function (section) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(16px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  // Add visible class styles via a small style block
  var style = document.createElement('style');
  style.textContent = '.section.is-visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

  // При клике по любой кнопке покупки (.btn-to-pay) — открыть модальное окно «Перейти к оплате» (PayAnyWay)
  var paymentModal = document.getElementById('payment-modal');
  var paymentGotoBtn = document.getElementById('payment-goto-btn');
  var paymentModalBackdrop = document.getElementById('payment-modal-backdrop');
  var paymentModalClose = document.getElementById('payment-modal-close');
  var payButtons = document.querySelectorAll('.btn-to-pay');

  function openPaymentModal(level, price) {
    if (!paymentModal || !paymentGotoBtn) return;
    var baseUrl = paymentModal.getAttribute('data-pay-base-url') || '#';
    var href = baseUrl;
    if (baseUrl.indexOf('?') !== -1) {
      href = baseUrl + '&level=' + encodeURIComponent(level) + '&amount=' + encodeURIComponent(price);
    } else if (baseUrl !== '#') {
      href = baseUrl + '?level=' + encodeURIComponent(level) + '&amount=' + encodeURIComponent(price);
    }
    paymentGotoBtn.setAttribute('href', href);
    paymentModal.classList.add('is-open');
    paymentModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePaymentModal() {
    if (!paymentModal) return;
    paymentModal.classList.remove('is-open');
    paymentModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  payButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var level = btn.getAttribute('data-level') || 'A1';
      var price = btn.getAttribute('data-price') || '999';
      openPaymentModal(level, price);
      var afterPayMessages = document.querySelectorAll('.js-after-pay');
      afterPayMessages.forEach(function (msg) {
        msg.classList.add('is-visible');
        msg.setAttribute('aria-hidden', 'false');
      });
    });
  });

  if (paymentModalBackdrop) paymentModalBackdrop.addEventListener('click', closePaymentModal);
  if (paymentModalClose) paymentModalClose.addEventListener('click', closePaymentModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && paymentModal && paymentModal.classList.contains('is-open')) {
      closePaymentModal();
    }
  });

  // Показать / скрыть уровни A2 и B1
  var showOtherLink = document.getElementById('show-other-levels');
  var otherLevelsBlock = document.getElementById('other-levels');
  if (showOtherLink && otherLevelsBlock) {
    showOtherLink.addEventListener('click', function (e) {
      e.preventDefault();
      if (otherLevelsBlock.hidden) {
        otherLevelsBlock.hidden = false;
        showOtherLink.textContent = 'Скрыть A2 и B1';
      } else {
        otherLevelsBlock.hidden = true;
        showOtherLink.textContent = 'Показать A2 и B1';
      }
    });
  }

  // Плавающая кнопка: показывать после скролла первого экрана
  var stickyCta = document.getElementById('sticky-cta');
  var hero = document.querySelector('.hero');
  if (stickyCta && hero) {
    var heroHeight = hero.offsetHeight;
    var showSticky = function () {
      var scrolled = window.scrollY || window.pageYOffset;
      if (scrolled > heroHeight * 0.5) {
        stickyCta.classList.add('is-visible');
        stickyCta.setAttribute('aria-hidden', 'false');
      } else {
        stickyCta.classList.remove('is-visible');
        stickyCta.setAttribute('aria-hidden', 'true');
      }
    };
    window.addEventListener('scroll', showSticky, { passive: true });
    window.addEventListener('resize', showSticky);
    showSticky();
  }
})();
