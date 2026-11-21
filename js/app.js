/**
 * Bigwin Digital - Core Interactive Functionality
 * Tagline: "Grand Your Brand Day."
 * Includes: ROI Calculator, Multi-step Audit Modal, Pricing Toggle, Case Study Filters,
 * Interactive Call Booking, FAQ Accordions, and Social Proof Toasts.
 */

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initRoiCalculator();
    initAuditModal();
    initPricingToggle();
    initCaseStudyFilters();
    initCalendarScheduler();
    initFaqAccordion();
    initMobileMenu();
    initSocialProofToast();
  });
} else {
  console.log('\n==================================================');
  console.log('  [Bigwin Digital Notice]');
  console.log('  js/app.js is a frontend browser script.');
  console.log('  To launch the local web server, run:');
  console.log('     node server.js');
  console.log('==================================================\n');
}

/* ==========================================================================
   1. Interactive ROI & Revenue Calculator
   ========================================================================== */
function initRoiCalculator() {
  const adSpendInput = document.getElementById('calc-ad-spend');
  const aovInput = document.getElementById('calc-aov');
  const convRateSelect = document.getElementById('calc-conv-rate');

  const adSpendDisplay = document.getElementById('display-ad-spend');
  const aovDisplay = document.getElementById('display-aov');
  
  const projectedRevenueEl = document.getElementById('calc-projected-revenue');
  const projectedOrdersEl = document.getElementById('calc-projected-orders');
  const projectedRoasEl = document.getElementById('calc-projected-roas');
  const netGrowthEl = document.getElementById('calc-net-growth');
  const claimStrategyBtn = document.getElementById('calc-claim-btn');

  if (!adSpendInput || !aovInput) return;

  function calculate() {
    const adSpend = parseFloat(adSpendInput.value) || 5000;
    const aov = parseFloat(aovInput.value) || 85;
    const convRate = parseFloat(convRateSelect ? convRateSelect.value : 2.5);

    // Update slider label texts
    adSpendDisplay.textContent = `$${adSpend.toLocaleString()}`;
    aovDisplay.textContent = `$${aov.toLocaleString()}`;

    // Dynamic ROAS calculation algorithm for e-commerce DTC
    // Larger ad spends yield high volume, optimized campaigns yield blended 3.4x to 5.2x
    let roasMultiplier = 3.6;
    if (convRate >= 3.5) roasMultiplier = 4.8;
    else if (convRate >= 2.5) roasMultiplier = 4.1;
    else roasMultiplier = 3.4;

    // Adjust slightly by spend efficiency
    if (adSpend > 20000) roasMultiplier += 0.3;

    const projectedRevenue = Math.round(adSpend * roasMultiplier);
    const projectedOrders = Math.round(projectedRevenue / aov);
    const netGrowth = projectedRevenue - adSpend;

    // Display formatted outputs with countup effect
    projectedRevenueEl.textContent = `$${projectedRevenue.toLocaleString()}`;
    projectedOrdersEl.textContent = `${projectedOrders.toLocaleString()} orders`;
    projectedRoasEl.textContent = `${roasMultiplier.toFixed(1)}x ROAS`;
    netGrowthEl.textContent = `+$${netGrowth.toLocaleString()}`;

    if (claimStrategyBtn) {
      claimStrategyBtn.setAttribute('data-spend', adSpend);
      claimStrategyBtn.setAttribute('data-target-rev', projectedRevenue);
    }
  }

  adSpendInput.addEventListener('input', calculate);
  aovInput.addEventListener('input', calculate);
  if (convRateSelect) convRateSelect.addEventListener('change', calculate);

  if (claimStrategyBtn) {
    claimStrategyBtn.addEventListener('click', () => {
      const spend = claimStrategyBtn.getAttribute('data-spend');
      const rev = claimStrategyBtn.getAttribute('data-target-rev');
      openAuditModalWithPreset({ spend, rev });
    });
  }

  // Initial calculation
  calculate();
}

/* ==========================================================================
   2. Multi-Step Free Marketing & Website Audit Modal
   ========================================================================== */
function initAuditModal() {
  const modal = document.getElementById('audit-modal');
  const openButtons = document.querySelectorAll('[data-open-audit-modal]');
  const closeButtons = document.querySelectorAll('[data-close-audit-modal]');
  const nextButtons = document.querySelectorAll('[data-audit-next]');
  const prevButtons = document.querySelectorAll('[data-audit-prev]');
  const form = document.getElementById('audit-form');

  if (!modal) return;

  window.openAuditModalWithPreset = function(presets = {}) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (presets.spend) {
      const notesField = document.getElementById('audit-notes');
      if (notesField) {
        notesField.value = `Target monthly ad budget: $${parseInt(presets.spend).toLocaleString()} | Aiming for $${parseInt(presets.rev).toLocaleString()} monthly revenue.`;
      }
    }
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  let currentStep = 1;
  const totalSteps = 3;

  function showStep(step) {
    for (let i = 1; i <= totalSteps; i++) {
      const stepEl = document.getElementById(`audit-step-${i}`);
      const stepPill = document.getElementById(`step-indicator-${i}`);
      if (stepEl) {
        if (i === step) {
          stepEl.classList.remove('hidden');
          stepEl.classList.add('block');
        } else {
          stepEl.classList.add('hidden');
          stepEl.classList.remove('block');
        }
      }
      if (stepPill) {
        if (i <= step) {
          stepPill.classList.add('bg-green-500', 'text-black', 'font-bold');
          stepPill.classList.remove('bg-zinc-800', 'text-zinc-400');
        } else {
          stepPill.classList.remove('bg-green-500', 'text-black', 'font-bold');
          stepPill.classList.add('bg-zinc-800', 'text-zinc-400');
        }
      }
    }
    currentStep = step;
  }

  nextButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Validate step 1 if required
      if (currentStep === 1) {
        const urlInput = document.getElementById('audit-website-url');
        if (urlInput && !urlInput.value.trim()) {
          urlInput.focus();
          urlInput.classList.add('ring-2', 'ring-red-500');
          setTimeout(() => urlInput.classList.remove('ring-2', 'ring-red-500'), 2000);
          return;
        }
      }
      if (currentStep < totalSteps) {
        showStep(currentStep + 1);
      }
    });
  });

  prevButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        showStep(currentStep - 1);
      }
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Analyzing Store Data...
        `;
      }

      setTimeout(() => {
        // Show success state
        document.getElementById('audit-step-3').classList.add('hidden');
        const successState = document.getElementById('audit-step-success');
        if (successState) {
          successState.classList.remove('hidden');
          successState.classList.add('block');
        }
      }, 1200);
    });
  }
}

/* ==========================================================================
   3. Pricing Toggle (Monthly vs Quarterly - 15% discount)
   ========================================================================== */
function initPricingToggle() {
  const toggle = document.getElementById('pricing-toggle');
  if (!toggle) return;

  const starterPrice = document.getElementById('price-starter');
  const scalePrice = document.getElementById('price-scale');
  const enterprisePrice = document.getElementById('price-enterprise');
  const durationLabels = document.querySelectorAll('.pricing-duration');

  toggle.addEventListener('change', () => {
    const isQuarterly = toggle.checked;

    if (isQuarterly) {
      if (starterPrice) starterPrice.textContent = '$2,125';
      if (scalePrice) scalePrice.textContent = '$3,825';
      if (enterprisePrice) enterprisePrice.textContent = '$6,375';
      durationLabels.forEach(el => el.textContent = '/ month (billed quarterly)');
    } else {
      if (starterPrice) starterPrice.textContent = '$2,500';
      if (scalePrice) scalePrice.textContent = '$4,500';
      if (enterprisePrice) enterprisePrice.textContent = '$7,500';
      durationLabels.forEach(el => el.textContent = '/ month');
    }
  });
}

/* ==========================================================================
   4. Case Study Category Filters
   ========================================================================== */
function initCaseStudyFilters() {
  const filterButtons = document.querySelectorAll('[data-case-filter]');
  const caseCards = document.querySelectorAll('[data-case-category]');

  if (!filterButtons.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button style
      filterButtons.forEach(b => {
        b.classList.remove('bg-green-500', 'text-black', 'font-bold');
        b.classList.add('bg-zinc-900', 'text-zinc-400', 'border', 'border-zinc-800');
      });
      btn.classList.add('bg-green-500', 'text-black', 'font-bold');
      btn.classList.remove('bg-zinc-900', 'text-zinc-400', 'border-zinc-800');

      const filterValue = btn.getAttribute('data-case-filter');

      caseCards.forEach(card => {
        const categories = card.getAttribute('data-case-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease';
            card.style.opacity = '1';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   5. Interactive Discovery Call Scheduler
   ========================================================================== */
function initCalendarScheduler() {
  const dayButtons = document.querySelectorAll('[data-calendar-day]');
  const slotButtons = document.querySelectorAll('[data-time-slot]');
  const bookingConfirmBtn = document.getElementById('book-call-confirm-btn');
  const selectedDetailsEl = document.getElementById('selected-slot-details');
  const bookingSuccessEl = document.getElementById('booking-confirmed-card');
  const bookingInterfaceEl = document.getElementById('booking-calendar-card');

  let selectedDay = 'Tomorrow';
  let selectedTime = '02:00 PM EST';

  dayButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dayButtons.forEach(b => {
        b.classList.remove('border-green-500', 'bg-green-950/40', 'text-green-400');
        b.classList.add('border-zinc-800', 'bg-zinc-900/60', 'text-zinc-300');
      });
      btn.classList.add('border-green-500', 'bg-green-950/40', 'text-green-400');
      btn.classList.remove('border-zinc-800', 'bg-zinc-900/60', 'text-zinc-300');
      selectedDay = btn.getAttribute('data-calendar-day');
      updateSlotDisplay();
    });
  });

  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      slotButtons.forEach(b => {
        b.classList.remove('bg-green-500', 'text-black', 'font-bold');
        b.classList.add('bg-zinc-900', 'text-zinc-300', 'border-zinc-800');
      });
      btn.classList.add('bg-green-500', 'text-black', 'font-bold');
      btn.classList.remove('bg-zinc-900', 'text-zinc-300', 'border-zinc-800');
      selectedTime = btn.getAttribute('data-time-slot');
      updateSlotDisplay();
    });
  });

  function updateSlotDisplay() {
    if (selectedDetailsEl) {
      selectedDetailsEl.textContent = `${selectedDay} at ${selectedTime}`;
    }
  }

  if (bookingConfirmBtn && bookingSuccessEl && bookingInterfaceEl) {
    bookingConfirmBtn.addEventListener('click', () => {
      const emailInput = document.getElementById('booking-email-input');
      if (emailInput && !emailInput.value.includes('@')) {
        emailInput.focus();
        emailInput.classList.add('ring-2', 'ring-red-500');
        setTimeout(() => emailInput.classList.remove('ring-2', 'ring-red-500'), 2000);
        return;
      }

      bookingInterfaceEl.classList.add('hidden');
      bookingSuccessEl.classList.remove('hidden');
      document.getElementById('confirmed-datetime-pill').textContent = `${selectedDay} at ${selectedTime}`;
    });
  }
}

/* ==========================================================================
   6. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('[data-faq-item]');

  faqItems.forEach(item => {
    const trigger = item.querySelector('[data-faq-trigger]');
    const answer = item.querySelector('[data-faq-answer]');
    const icon = item.querySelector('[data-faq-icon]');

    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isOpen = !answer.classList.contains('hidden');

      // Close all other faqs
      faqItems.forEach(otherItem => {
        const otherAnswer = otherItem.querySelector('[data-faq-answer]');
        const otherIcon = otherItem.querySelector('[data-faq-icon]');
        if (otherAnswer && otherAnswer !== answer) {
          otherAnswer.classList.add('hidden');
          otherItem.classList.remove('border-green-500/50');
          otherItem.classList.add('border-zinc-800');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      if (isOpen) {
        answer.classList.add('hidden');
        item.classList.remove('border-green-500/50');
        item.classList.add('border-zinc-800');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        answer.classList.remove('hidden');
        item.classList.add('border-green-500/50');
        item.classList.remove('border-zinc-800');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* ==========================================================================
   7. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.add('hidden');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   8. Live Social Proof Notification Toast
   ========================================================================== */
function initSocialProofToast() {
  const toast = document.getElementById('social-proof-toast');
  const closeBtn = document.getElementById('close-toast-btn');
  if (!toast) return;

  const notifications = [
    { brand: 'Lumina Apparel', action: 'hit 5.4x ROAS on TikTok Ads', time: '8m ago' },
    { brand: 'VitalGlow Organics', action: 'booked a Free E-Com Audit', time: '14m ago' },
    { brand: 'Zenith Audio', action: 'grew organic search traffic by +340%', time: '29m ago' },
    { brand: 'PureBloom Skincare', action: 'scaled from $42k to $310k/mo', time: '41m ago' }
  ];

  let index = 0;

  function showToast() {
    if (toast.classList.contains('dismissed')) return;
    const item = notifications[index];
    document.getElementById('toast-brand-name').textContent = item.brand;
    document.getElementById('toast-action-text').textContent = item.action;
    document.getElementById('toast-time-text').textContent = item.time;

    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-24', 'opacity-0');
      index = (index + 1) % notifications.length;
    }, 6000);
  }

  // Initial delay
  setTimeout(showToast, 4000);
  // Interval
  setInterval(showToast, 18000);

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      toast.classList.add('dismissed', 'translate-y-24', 'opacity-0');
    });
  }
}
