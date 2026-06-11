// ===== TYPING EFFECT =====
const typingPhrases = [
  "AI ML Engineer",
  "AI Enthusiast",
  "Computer Science Student",
  "Web Developer",
  "Problem Solver"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById("typingText");

function typeEffect() {
  if (!typingEl) return;
  const current = typingPhrases[phraseIndex];
  if (isDeleting) {
    typingEl.textContent = current.substring(0, charIndex--);
  } else {
    typingEl.textContent = current.substring(0, charIndex++);
  }

  let speed = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === current.length + 1) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex < 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    speed = 400;
  }
  setTimeout(typeEffect, speed);
}

if (typingEl) {
  typeEffect();
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById("navbar");
const scrollTopBtn = document.getElementById("scrollTop");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  // Navbar background
  if (navbar) {
    navbar.classList.toggle("scrolled", scrollY > 50);
  }

  // Scroll-to-top button
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle("visible", scrollY > 600);
  }

  // Active nav link
  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute("id");
    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach((l) => l.classList.remove("active"));
      const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  });
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ===== MOBILE NAV =====
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
const mobileNavClose = document.getElementById("mobileNavClose");
const mobileNavLinks = mobileNav ? mobileNav.querySelectorAll("a") : [];

if (hamburger && mobileNav) {
  hamburger.addEventListener("click", () => mobileNav.classList.add("open"));
}
if (mobileNavClose && mobileNav) {
  mobileNavClose.addEventListener("click", () => mobileNav.classList.remove("open"));
}
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (mobileNav) mobileNav.classList.remove("open");
  });
});

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  const themeIcon = themeToggle.querySelector("i");
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
    }
  }
}

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");

        // Animate skill bars inside this element
        const bars = entry.target.querySelectorAll(".skill-bar-fill");
        bars.forEach((bar) => {
          const target = bar.style.getPropertyValue("--target-width");
          if (target) bar.style.width = target;
        });
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

revealElements.forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  revealObserver.observe(el);
});

// ===== TIMELINE SCROLL ANIMATION ENGINE =====
(function initTimelineAnimations() {
  const timeline = document.getElementById("timeline");
  const progressFill = document.getElementById("timelineProgressFill");
  const progressGlow = document.getElementById("timelineProgressGlow");
  const experienceSection = document.querySelector(".experience-section");
  const timelineItems = document.querySelectorAll(".timeline-item");

  if (!timeline || !progressFill || !progressGlow || !experienceSection) return;

  let ticking = false;

  function updateScrollProgress() {
    const timelineRect = timeline.getBoundingClientRect();
    const timelineTop = timelineRect.top + window.scrollY;
    const timelineHeight = timelineRect.height;
    const scrollY = window.scrollY + window.innerHeight * 0.5;

    let progress = (scrollY - timelineTop) / timelineHeight;
    progress = Math.max(0, Math.min(1, progress));

    const fillPercent = progress * 100;
    progressFill.style.height = fillPercent + "%";

    const trackHeight = timeline.querySelector(".timeline-progress-track").offsetHeight;
    const glowTop = (progress * trackHeight) - 5;
    progressGlow.style.top = Math.max(0, glowTop) + "px";

    if (progress > 0.01 && progress < 0.99) {
      progressGlow.classList.add("active");
    } else {
      progressGlow.classList.remove("active");
    }

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollProgress);
      ticking = true;
    }
  }, { passive: true });

  updateScrollProgress();

  const ambientObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          experienceSection.classList.add("glows-visible");
        } else {
          experienceSection.classList.remove("glows-visible");
        }
      });
    },
    { threshold: 0.1 }
  );
  ambientObserver.observe(experienceSection);

  const itemObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        } else {
          entry.target.classList.remove("in-view");
        }
      });
    },
    { threshold: 0.3, rootMargin: "0px 0px -80px 0px" }
  );

  timelineItems.forEach((item, index) => {
    const card = item.querySelector(".timeline-card");
    if (card) {
      card.style.transitionDelay = `${index * 0.08}s`;
    }
    itemObserver.observe(item);
  });
})();

// ===== CONTACT FORM & TOAST SYSTEM =====
const CONTACT_CONFIG = {
  useEmailJS: false, // Set to true to activate EmailJS, false for direct FormSubmit delivery
  emailjs: {
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
    serviceId: "YOUR_EMAILJS_SERVICE_ID",
    templateId: "YOUR_EMAILJS_TEMPLATE_ID"
  },
  formSubmit: {
    email: "chaudharyashutosh0701@gmail.com" // CHANGE THIS to your email to receive form submissions via FormSubmit.co
  }
};

// Initialize EmailJS if configured
if (CONTACT_CONFIG.useEmailJS && CONTACT_CONFIG.emailjs.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY") {
  if (typeof emailjs !== "undefined") {
    emailjs.init({
      publicKey: CONTACT_CONFIG.emailjs.publicKey
    });
  }
}

// Toast Notification Factory
function showToast(title, message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  
  const iconClass = type === "success" ? "fas fa-check-circle" : "fas fa-exclamation-circle";
  
  toast.innerHTML = `
    <div class="toast-icon"><i class="${iconClass}"></i></div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Close message">&times;</button>
  `;

  container.appendChild(toast);

  // Force layout reflow to trigger slide-in CSS transition
  toast.offsetHeight;
  toast.classList.add("show");

  const closeToast = () => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  };

  toast.querySelector(".toast-close").addEventListener("click", closeToast);
  setTimeout(closeToast, 4500);
}

// Real-time Form Validation
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("formName");
const emailInput = document.getElementById("formEmail");
const subjectInput = document.getElementById("formSubject");
const messageInput = document.getElementById("formMessage");
const submitBtn = document.getElementById("formSubmitBtn");

const validators = {
  from_name: (val) => val.trim().length >= 2,
  from_email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
  subject: (val) => val.trim().length >= 3,
  message: (val) => val.trim().length >= 10
};

function validateField(input, validator) {
  if (!input) return false;
  const isValid = validator(input.value);
  if (input.value.trim() === "") {
    input.classList.remove("valid", "invalid");
  } else if (isValid) {
    input.classList.remove("invalid");
    input.classList.add("valid");
  } else {
    input.classList.remove("valid");
    input.classList.add("invalid");
  }
  return isValid;
}

if (contactForm) {
  if (nameInput) {
    nameInput.addEventListener("input", () => validateField(nameInput, validators.from_name));
    nameInput.addEventListener("blur", () => validateField(nameInput, validators.from_name));
  }
  if (emailInput) {
    emailInput.addEventListener("input", () => validateField(emailInput, validators.from_email));
    emailInput.addEventListener("blur", () => validateField(emailInput, validators.from_email));
  }
  if (subjectInput) {
    subjectInput.addEventListener("input", () => validateField(subjectInput, validators.subject));
    subjectInput.addEventListener("blur", () => validateField(subjectInput, validators.subject));
  }
  if (messageInput) {
    messageInput.addEventListener("input", () => validateField(messageInput, validators.message));
    messageInput.addEventListener("blur", () => validateField(messageInput, validators.message));
  }

  const RATE_LIMIT_MS = 60000;
  const getLastSubmitTime = () => parseInt(localStorage.getItem("contact_last_submit") || "0", 10);
  const setLastSubmitTime = (time) => localStorage.setItem("contact_last_submit", time);

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Honeypot check
    const honeyField = contactForm.querySelector("input[name='_honey']");
    if (honeyField && honeyField.value !== "") {
      showToast("Message Sent", "Thank you! Your message has been sent successfully.", "success");
      contactForm.reset();
      return;
    }

    // 2. Cooldown Rate limit
    const currentTime = Date.now();
    const lastSubmitTime = getLastSubmitTime();
    if (currentTime - lastSubmitTime < RATE_LIMIT_MS) {
      const waitSeconds = Math.ceil((RATE_LIMIT_MS - (currentTime - lastSubmitTime)) / 1000);
      showToast("Submission Limited", `Please wait ${waitSeconds} seconds before sending another message.`, "error");
      return;
    }

    // 3. Validation Check
    const isNameValid = validateField(nameInput, validators.from_name);
    const isEmailValid = validateField(emailInput, validators.from_email);
    const isSubjectValid = validateField(subjectInput, validators.subject);
    const isMessageValid = validateField(messageInput, validators.message);

    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
      showToast("Validation Error", "Please fill in all fields correctly before sending.", "error");
      return;
    }

    // 4. Loading button state
    submitBtn.disabled = true;
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span class="spinner-icon"></span> Sending...`;

    try {
      const isEmailJSReady = CONTACT_CONFIG.useEmailJS && CONTACT_CONFIG.emailjs.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY";

      if (isEmailJSReady) {
        await emailjs.sendForm(
          CONTACT_CONFIG.emailjs.serviceId,
          CONTACT_CONFIG.emailjs.templateId,
          contactForm
        );
      } else {
        const formData = new FormData(contactForm);
        formData.delete("_honey");

        const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_CONFIG.formSubmit.email}`, {
          method: "POST",
          body: formData,
          headers: {
            "Accept": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("FormSubmit submission endpoint failed.");
        }
      }

      setLastSubmitTime(Date.now());
      showToast("Success!", "Your message has been sent successfully.", "success");
      
      submitBtn.innerHTML = `<i class="fas fa-check"></i> Message Sent Successfully`;
      submitBtn.style.background = "linear-gradient(135deg, #10B981, #059669)";

      contactForm.reset();
      
      document.querySelectorAll(".contact-form .form-group input, .contact-form .form-group textarea").forEach((el) => {
        el.classList.remove("valid", "invalid");
      });

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        submitBtn.style.background = "";
      }, 4000);

    } catch (err) {
      console.error("Transmission failed:", err);
      showToast("Transmission Error", "Unable to send your message. Please try again.", "error");
      
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }
  });
}

// ===== SMOOTH NAV LINK CLICK =====
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// ===== ABOUT PARTICLES CANVAS =====
(function initAboutParticles() {
  const canvas = document.getElementById("aboutParticles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, particles;
  const PARTICLE_COUNT = 120;

  function resize() {
    const section = canvas.parentElement;
    w = canvas.width = section.offsetWidth;
    h = canvas.height = section.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        baseX: Math.random() * w,
        baseY: Math.random() * h,
        size: Math.random() * 2.5 + 0.8,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
        amplitude: Math.random() * 20 + 10,
        color: Math.random() > 0.5 ? "0,255,220" : "64,121,255",
      });
    }
  }

  let time = 0;
  function animate() {
    ctx.clearRect(0, 0, w, h);
    time += 0.008;

    particles.forEach((p) => {
      p.x = p.baseX + Math.sin(time + p.phase) * p.amplitude;
      p.y = p.baseY + Math.cos(time * 0.7 + p.phase) * p.amplitude * 0.6;

      p.baseX += p.speedX;
      p.baseY += p.speedY;

      if (p.baseX < -20) p.baseX = w + 20;
      if (p.baseX > w + 20) p.baseX = -20;
      if (p.baseY < -20) p.baseY = h + 20;
      if (p.baseY > h + 20) p.baseY = -20;

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
      grad.addColorStop(0, `rgba(${p.color}, 0.6)`);
      grad.addColorStop(1, `rgba(${p.color}, 0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, 0.85)`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,255,220, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });
})();

// ===== INITIALIZE LUCIDE ICONS =====
if (typeof lucide !== "undefined") {
  lucide.createIcons();
}

// ===== CERTIFICATE PREVIEW MODAL & HOVER SYSTEM =====

const certificatePreviews = {
  "Microsoft AZ-900: Azure Fundamentals":
    "/image/azure-az900.png",

  "ITM Hackathon Project":
    "/image/itm.jpg",

  "VisionX – Misinformation Detection System":
    "/image/visionx.jpg",

  "Tata GenAI Powered Data Analytics Job Simulation – Forage":
    "/image/tata-forage.png",

  "Execute 5.0, E-Summit'26 – DTU":
    "/image/esummit-dtu.jpg",

  "Changethon, National Social Summit 2026 – IIT Roorkee":
    "/image/nss-iitr.jpg",

  "Campus Ambassador, BECON '26 – IIT Delhi":
    "/image/becon-iitd.jpg",
};

function resolveImagePath(path) {
  if (!path) return "";
  const resolved = path.startsWith('/') ? path.slice(1) : path;
  return resolved;
}

const certCards = document.querySelectorAll(".cert-card");
const certModal = document.getElementById("certModal");
const certModalImg = document.getElementById("certModalImg");
const certModalTitle = document.getElementById("certModalTitle");
const certModalSpinner = document.getElementById("certModalSpinner");
const certModalClose = document.getElementById("certModalClose");
const certModalOverlay = document.getElementById("certModalOverlay");

if (certCards.length && certModal) {
  certCards.forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      const titleEl = card.querySelector("h4");
      if (!titleEl) return;
      const title = titleEl.textContent.trim();
      const rawPath = certificatePreviews[title];
      
      certModalTitle.textContent = title;
      certModalImg.src = "";
      certModalImg.classList.remove("loaded");
      if (certModalSpinner) certModalSpinner.style.display = "block";
      certModal.classList.add("open");
      document.body.style.overflow = "hidden";

      if (!rawPath) {
        const fallbackUrl = `https://placehold.co/800x600/0a0a1a/00ffdc?text=${encodeURIComponent(title)}`;
        certModalImg.src = fallbackUrl;
        certModalImg.classList.add("loaded");
        if (certModalSpinner) certModalSpinner.style.display = "none";
        return;
      }

      const resolvedPath = resolveImagePath(rawPath);
      const tempImg = new Image();
      
      tempImg.onload = () => {
        certModalImg.src = resolvedPath;
        certModalImg.classList.add("loaded");
        if (certModalSpinner) certModalSpinner.style.display = "none";
      };
      
      tempImg.onerror = () => {
        certModalImg.src = `https://placehold.co/800x600/0a0a1a/00ffdc?text=${encodeURIComponent(title)}`;
        certModalImg.classList.add("loaded");
        if (certModalSpinner) certModalSpinner.style.display = "none";
      };
      
      tempImg.src = resolvedPath;
    });
  });

  const closeCertModal = () => {
    certModal.classList.remove("open");
    document.body.style.overflow = "";
  };

  if (certModalClose) certModalClose.addEventListener("click", closeCertModal);
  if (certModalOverlay) certModalOverlay.addEventListener("click", closeCertModal);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCertModal();
  });
}


