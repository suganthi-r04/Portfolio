// script.js
// Smooth scroll, typing, intersection reveals, EmailJS, popup, canvas particles

document.addEventListener("DOMContentLoaded", () => {
  /* ------------------ Smooth scroll for nav links ------------------ */
  document.querySelectorAll(".nav-links a[href^='#']").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });


// ----- Ensure "Get in Touch" anchors reveal + scroll to contact form -----
document.querySelectorAll('a[href="#contact"], a[href="#contact-section"], .btn-get-in-touch').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();

    // prefer id "contact-section", fallback to "contact", then "contact-preview"
    const contactSection = document.getElementById('contact-section') || document.getElementById('contact');
    const contactPreview = document.getElementById('contact-preview');

    // If the contact form section exists but is hidden, show it and hide preview
    if (contactSection) {
      // if it's hidden (display:none), reveal it
      const style = window.getComputedStyle(contactSection);
      if (style.display === 'none') {
        contactSection.style.display = 'block';
      }
      // hide the preview (if present)
      if (contactPreview) contactPreview.style.display = 'none';

      // then smooth-scroll to the visible contact section
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // If only preview exists, scroll to preview
    if (contactPreview) {
      contactPreview.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // fallback: try to find any id that contains "contact"
    const fallback = document.querySelector('[id*="contact"]');
    if (fallback) {
      fallback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});


  /* ------------------ Typing effect ------------------ */
  const typedTextEl = document.querySelector(".typed-text");
  const text = "Suganthi R";
  if (typedTextEl) {
    let index = 0;
    typedTextEl.textContent = "";
    (function type() {
      if (index < text.length) {
        typedTextEl.textContent += text.charAt(index);
        index++;
        setTimeout(type, 110);
      }
    })();
  }

  /* ------------------ IntersectionObserver: reveal sections & projects ------------------ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  // Observe .project-wrapper and .section-inner (for subtle reveal)
  document.querySelectorAll(".project-wrapper, .section-inner").forEach(el => revealObserver.observe(el));

  /* ------------------ Show contact form (toggle preview -> form) ------------------ */
  const showContactBtn = document.getElementById("show-contact-form");
  if (showContactBtn) {
    showContactBtn.addEventListener("click", () => {
      const preview = document.getElementById("contact-preview");
      const contactSection = document.getElementById("contact-section");
      if (preview) preview.style.display = "none";
      if (contactSection) contactSection.style.display = "block";
      if (contactSection) contactSection.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* ------------------ EmailJS init ------------------ */
  (function() {
    if (typeof emailjs !== "undefined") {
      try {
        emailjs.init("VkbCXKCTAwtjwpa3A"); // keep your public key or replace if needed
      } catch (err) {
        console.warn("EmailJS init error (safe to ignore if offline):", err);
      }
    }
  })();

  /* ------------------ Contact form submit with EmailJS ------------------ */
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
      if (typeof emailjs === "undefined") {
        alert("EmailJS not available. Check your connection and script include.");
        return;
      }
      emailjs.sendForm('service_oofbd6h', 'template_arbvzir', this)
        .then(() => {
          const popup = document.getElementById("popup");
          if (popup) {
            popup.classList.add("show");
            setTimeout(() => {
              popup.classList.remove("show");
              contactForm.reset();
              // return to preview after send
              const contactSection = document.getElementById("contact-section");
              const preview = document.getElementById("contact-preview");
              if (contactSection) contactSection.style.display = "none";
              if (preview) preview.style.display = "block";
            }, 3000);
          }
        }, (error) => {
          alert("Failed to send message: " + (error && error.text ? error.text : "Unknown error"));
        });
    });
  }

  /* ------------------ Accessibility: make project cards keyboard clickable ------------------ */
  document.querySelectorAll(".project-card").forEach(card => {
    const link = card.closest("a");
    if (link) {
      card.setAttribute("tabindex", "0");
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          window.open(link.href, "_blank");
        }
      });
    }
  });

  /* ------------------ Small entrance animations (add .show styles) ------------------ */
  // add base styles for reveal via JS by toggling .show (CSS handles transition)
  document.querySelectorAll(".project-wrapper, .section-inner").forEach(el => {
    el.classList.add("pre-reveal");
  });
});

/* ===================== Canvas particles (simple floating dots) ===================== */

(function initBackgroundCanvas() {
  const canvas = document.getElementById("background-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, particles;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    w = canvas.width = window.innerWidth * dpr;
    h = canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  }
  window.addEventListener("resize", resize);
  resize();

  function random(min, max) { return Math.random() * (max - min) + min; }

  function createParticles(count = 50) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: random(0, w),
        y: random(0, h),
        r: random(1.4, 3.4),
        alpha: random(0.07, 0.22),
        vx: random(-0.12, 0.12),
        vy: random(-0.2, 0.2),
        hueShift: random(0, 360)
      });
    }
  }
  createParticles();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 110, 199,${p.alpha + 0.25})`; // pinkish glow
      ctx.shadowColor = `rgba(108, 99, 255, 0.16)`;
      ctx.shadowBlur = 12;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      // move
      p.x += p.vx;
      p.y += p.vy;

      // wrap
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();
