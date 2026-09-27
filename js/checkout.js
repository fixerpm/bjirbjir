/**
 * OSON PRAVA — Startup Monetization & Checkout Simulator
 * Payme, Click, Uzum Bank checkout flow, PRO membership upgrade, and referral system
 */

window.OSON_CHECKOUT = (function() {
  'use strict';

  let currentOrder = null;

  // Open Checkout Modal
  function openCheckout(planName, price, priceText) {
    currentOrder = { planName, price, priceText };
    const modal = document.getElementById('checkout-modal');
    const orderTitle = document.getElementById('checkout-order-title');
    const orderPrice = document.getElementById('checkout-order-price');

    if (orderTitle) orderTitle.textContent = planName;
    if (orderPrice) orderPrice.textContent = priceText;

    // Reset payment method buttons and steps
    selectPaymentMethod('payme');
    showCardStep();

    window.OSON_UI.openModal('checkout-modal');
  }

  function showCardStep() {
    const cardStep = document.getElementById('checkout-step-card');
    const otpStep = document.getElementById('checkout-step-otp');
    if (cardStep) cardStep.classList.remove('hidden');
    if (otpStep) otpStep.classList.add('hidden');
  }

  function showOtpStep() {
    const cardStep = document.getElementById('checkout-step-card');
    const otpStep = document.getElementById('checkout-step-otp');
    if (cardStep) cardStep.classList.add('hidden');
    if (otpStep) {
      otpStep.classList.remove('hidden');
      const otpInput = document.getElementById('checkout-otp-input');
      if (otpInput) {
        otpInput.value = '1234';
        setTimeout(() => otpInput.focus(), 100);
      }
    }
  }

  function selectPaymentMethod(method) {
    document.querySelectorAll('.payment-method-btn').forEach(btn => {
      btn.classList.remove('border-blue-600', 'bg-blue-50/50', 'dark:bg-blue-950/40');
      btn.classList.add('border-slate-200', 'dark:border-slate-700');
    });
    const selected = document.getElementById(`pay-method-${method}`);
    if (selected) {
      selected.classList.add('border-blue-600', 'bg-blue-50/50', 'dark:bg-blue-950/40');
      selected.classList.remove('border-slate-200', 'dark:border-slate-700');
    }
  }

  // Submit payment - transitions to OTP step
  function processPayment(e) {
    if (e) e.preventDefault();
    const btn = document.getElementById('checkout-pay-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Karta tekshirilmoqda...`;
    }

    setTimeout(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>To‘lovni davom ettirish</span> <i class="fa-solid fa-arrow-right ml-1"></i>`;
      }
      showOtpStep();
    }, 700);
  }

  // Confirm OTP simulation
  function confirmOtp(e) {
    if (e) e.preventDefault();
    const otpInput = document.getElementById('checkout-otp-input');
    const otpVal = otpInput ? otpInput.value.trim() : '';

    if (!otpVal || otpVal.length < 4) {
      window.OSON_UI.showToast('Iltimos, 4 xonali SMS kodni to‘liq kiriting (Demo: 1234)', 'error');
      return;
    }

    const confirmBtn = document.getElementById('checkout-confirm-otp-btn');
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Tasdiqlanmoqda...`;
    }

    setTimeout(() => {
      // Upgrade user to PRO
      let user = window.OSON_AUTH.getUser();
      if (!user) {
        user = {
          id: 'user_' + Date.now(),
          name: 'Foydalanuvchi',
          email: 'foydalanuvchi@osonprava.uz',
          avatar: 'FP',
          examDate: '2026-10-15',
          streak: 0
        };
      }
      user.isPro = true;
      user.plan = currentOrder ? currentOrder.planName : 'PRO Haydovchi';
      window.OSON_STORAGE.remove(window.OSON_STORAGE.KEYS.LOGGED_OUT);
      window.OSON_STORAGE.set(window.OSON_STORAGE.KEYS.USER, user);
      window.OSON_AUTH.syncAuthUI();

      window.OSON_UI.closeModal('checkout-modal');
      window.OSON_UI.triggerConfetti();
      window.OSON_UI.showToast('Tabriklaymiz! PRO hisobingiz muvaffaqiyatli faollashtirildi! 🌟', 'success');

      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = `<span>Kodni tasdiqlash</span>`;
      }

      // Refresh views
      if (window.OSON_PROFILE) {
        window.OSON_PROFILE.renderDashboard();
        window.OSON_PROFILE.renderProfile();
      }
    }, 900);
  }

  // Open Referral Modal
  function openReferralModal() {
    const user = window.OSON_AUTH.getUser() || { name: 'foydalanuvchi' };
    const refCode = (user.isDemo ? 'demo' : (user.name || 'USER')).toLowerCase().replace(/\s+/g, '') + '2026';
    const linkInput = document.getElementById('referral-link-input');
    if (linkInput) {
      linkInput.value = `https://osonprava.uz/ref/${refCode}`;
    }
    window.OSON_UI.openModal('referral-modal');
  }

  function copyReferralLink() {
    const linkInput = document.getElementById('referral-link-input');
    if (linkInput && navigator.clipboard) {
      navigator.clipboard.writeText(linkInput.value);
      window.OSON_UI.showToast('Havola nusxalandi! Do‘stlaringizga ulashing 🚀', 'success');
    } else {
      window.OSON_UI.showToast('Havola nusxalandi!', 'info');
    }
  }

  return {
    openCheckout,
    selectPaymentMethod,
    processPayment,
    showCardStep,
    showOtpStep,
    confirmOtp,
    openReferralModal,
    copyReferralLink
  };
})();
