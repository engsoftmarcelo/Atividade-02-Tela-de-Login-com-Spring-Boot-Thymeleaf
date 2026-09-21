/**
 * PUC Minas - Orquestração de Animações e Microinterações
 * GSAP Timeline, VanillaTilt e Medidor de Força de Senha em 4 Segmentos
 * Baseado no guia de Creative Development do Perplexity
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Linha do Tempo de Entrada Fluida com GSAP
  if (window.gsap) {
    const visual = document.querySelector(".auth-visual");
    const card = document.querySelector(".auth-card, .home-card");
    const inputs = document.querySelectorAll(".input-group, .profile-item");
    const primaryBtn = document.querySelector(".btn-primary, .btn-logout");

    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.7 } });

    if (visual) {
      tl.from(visual, { opacity: 0, y: 35 });
    }
    if (card) {
      tl.from(card, { opacity: 0, y: 28 }, visual ? "-=0.35" : 0);
    }
    if (inputs.length > 0) {
      tl.from(inputs, { opacity: 0, y: 16, stagger: 0.05 }, "-=0.25");
    }
    if (primaryBtn) {
      tl.from(primaryBtn, { opacity: 0, y: 14 }, "-=0.15");
    }
  }

  // 2. Efeito 3D Glass Tilt com VanillaTilt
  if (window.VanillaTilt) {
    const card = document.querySelector(".auth-card, .home-card");
    if (card) {
      VanillaTilt.init(card, {
        max: 6,
        speed: 400,
        glare: true,
        "max-glare": 0.12,
        scale: 1.01
      });
    }

    const primaryBtn = document.querySelector(".btn-primary");
    if (primaryBtn) {
      VanillaTilt.init(primaryBtn, {
        max: 5,
        speed: 300,
        glare: false,
        scale: 1.02
      });
    }
  }

  // 3. Alternância de Visibilidade de Senha (Toggle Password)
  const toggleBtns = document.querySelectorAll(".toggle-password");
  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>`;
      } else {
        input.type = "password";
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>`;
      }
    });
  });

  // 4. Medidor de Força de Senha em 4 Segmentos (Perplexity Spec)
  const passwordInput = document.getElementById("password") || document.getElementById("reg-password");
  const strengthContainer = document.querySelector(".password-strength");

  if (passwordInput && strengthContainer) {
    const label = strengthContainer.querySelector(".password-strength-label");

    function computeStrength(val) {
      if (!val) return 0;
      let score = 0;
      if (val.length >= 6) score++;
      if (val.length >= 10 || (/[A-Z]/.test(val) && val.length >= 8)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;
      return Math.max(1, Math.min(score, 4));
    }

    function updateStrengthUI(score) {
      strengthContainer.classList.remove(
        "password-strength--1",
        "password-strength--2",
        "password-strength--3",
        "password-strength--4"
      );

      if (score > 0) {
        strengthContainer.classList.add(`password-strength--${score}`);
      }

      if (!label) return;

      switch (score) {
        case 0:
          label.textContent = "Digite uma senha";
          label.style.color = "var(--text-muted)";
          break;
        case 1:
          label.textContent = "Senha muito fraca";
          label.style.color = "#ef4444";
          break;
        case 2:
          label.textContent = "Senha razoável";
          label.style.color = "#f59e0b";
          break;
        case 3:
          label.textContent = "Boa senha";
          label.style.color = "#38bdf8";
          break;
        case 4:
          label.textContent = "Senha forte e segura";
          label.style.color = "#22c55e";
          break;
      }
    }

    passwordInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      const score = val.length === 0 ? 0 : computeStrength(val);
      updateStrengthUI(score);
    });
  }
});
