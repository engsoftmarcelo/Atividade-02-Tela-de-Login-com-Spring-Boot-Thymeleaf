/**
 * PUC Minas - Scripts de Interatividade e Validacoes de Interface
 */
document.addEventListener("DOMContentLoaded", () => {
  // Animacao de entrada dos elementos do formulario
  if (typeof gsap !== "undefined") {
    gsap.from(".stagger-item", {
      y: 25,
      opacity: 0,
      duration: 0.75,
      stagger: 0.07,
      ease: "power3.out",
      delay: 0.1
    });

    gsap.from(".visual-content", {
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: "power3.out"
    });
  }

  // Efeito tilt nos cards
  if (window.VanillaTilt) {
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
      max: 3,
      speed: 400,
      glare: true,
      "max-glare": 0.18,
      scale: 1.01
    });
  }

  // Alternador de visibilidade da senha (mostrar/ocultar)
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

  // Indicador de forca da senha
  const passInput = document.getElementById("password") || document.getElementById("reg-password");
  const meterFill = document.getElementById("pass-meter-fill");
  const meterLabel = document.getElementById("pass-meter-label");

  if (passInput && meterFill) {
    passInput.addEventListener("input", (e) => {
      const val = e.target.value;
      if (!val) {
        meterFill.style.width = "0%";
        if (meterLabel) {
          meterLabel.textContent = "";
        }
        return;
      }

      let strength = 0;
      if (val.length >= 6) strength += 30;
      if (val.match(/[A-Z]/)) strength += 20;
      if (val.match(/[0-9]/)) strength += 20;
      if (val.match(/[^a-zA-Z0-9]/)) strength += 30;

      meterFill.style.width = strength + "%";

      if (strength <= 30) {
        meterFill.style.backgroundColor = "#ef4444"; // Vermelho
        meterFill.style.boxShadow = "none";
        if (meterLabel) {
          meterLabel.textContent = "Senha fraca";
          meterLabel.style.color = "#ef4444";
        }
      } else if (strength <= 70) {
        meterFill.style.backgroundColor = "var(--puc-amber)"; // Âmbar
        meterFill.style.boxShadow = "none";
        if (meterLabel) {
          meterLabel.textContent = "Senha razoável";
          meterLabel.style.color = "var(--puc-amber)";
        }
      } else {
        meterFill.style.backgroundColor = "var(--puc-cyan)"; // Ciano Neon
        meterFill.style.boxShadow = "0 0 12px var(--puc-cyan)";
        if (meterLabel) {
          meterLabel.textContent = "Senha forte e segura";
          meterLabel.style.color = "var(--puc-cyan)";
        }
      }
    });
  }
});
