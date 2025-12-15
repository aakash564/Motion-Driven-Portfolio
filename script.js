const header = document.querySelector(".site-header");
let lastScrollY = window.scrollY;

// Sticky header reveal/hide
window.addEventListener("scroll", () => {
  const currentY = window.scrollY;
  if (currentY > lastScrollY + 4 && currentY > 80) {
    header.classList.add("hidden");
  } else if (currentY < lastScrollY - 4) {
    header.classList.remove("hidden");
  }
  lastScrollY = currentY;
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 8;
    const rect = target.getBoundingClientRect();
    const targetY = rect.top + window.scrollY - offset;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  });
});

// CTA shortcuts
document.getElementById("viewWorkBtn")?.addEventListener("click", () => {
  document.querySelector('a[href="#projects"]')?.click();
});
document.getElementById("contactBtn")?.addEventListener("click", () => {
  document.querySelector('a[href="#contact"]')?.click();
});

// Micro-interaction: ripple
function setupButtonRipple(button) {
  const ripple = button.querySelector(".btn-ripple");
  if (!ripple) return;
  button.addEventListener("pointerdown", (e) => {
    const rect = button.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ripple.style.setProperty("--x", `${x}%`);
    ripple.style.setProperty("--y", `${y}%`);
    button.classList.add("is-pressed");
    setTimeout(() => button.classList.remove("is-pressed"), 300);
  });
}

document.querySelectorAll(".btn-primary, .btn-ghost").forEach(setupButtonRipple);

// Hero particles
const particlesContainer = document.getElementById("heroParticles");

function createParticles() {
  if (!particlesContainer) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "hero-particle";
    const size = 4 + Math.random() * 6;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.bottom = `${Math.random() * 60}px`;
    p.style.animationDuration = `${8 + Math.random() * 6}s`;
    p.style.animationDelay = `${-Math.random() * 10}s`;
    p.style.opacity = String(0.2 + Math.random() * 0.5);
    particlesContainer.appendChild(p);
  }
}
createParticles();

// Project card tilt + parallax
const cards = document.querySelectorAll(".project-card");

cards.forEach((card) => {
  const maxTilt = 10; // deg
  const maxShift = 14; // px

  function handleMove(e) {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    const pctX = (x / rect.width - 0.5) * 2;
    const pctY = (y / rect.height - 0.5) * 2;

    const tiltX = -(pctY * maxTilt);
    const tiltY = pctX * maxTilt;

    card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    const preview = card.querySelector(".project-preview");
    if (preview) {
      const shiftX = -pctX * maxShift;
      const shiftY = -pctY * maxShift;
      preview.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0)`;
    }
  }

  function resetTilt() {
    card.style.transform = "";
    const preview = card.querySelector(".project-preview");
    if (preview) preview.style.transform = "";
  }

  card.addEventListener("pointermove", handleMove);
  card.addEventListener("pointerleave", resetTilt);
  card.addEventListener("pointerup", resetTilt);
});

// Scroll-triggered reveal
const revealTargets = [];
document.querySelectorAll(".section-header, .project-card, .about-timeline, .about-skills, .contact-card, .contact-meta").forEach((el) => {
  el.classList.add("reveal-on-scroll");
  revealTargets.push(el);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        if (entry.target.classList.contains("about-skills")) {
          animateSkills();
        }
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealTargets.forEach((el) => observer.observe(el));

// Skill bar animation
function animateSkills() {
  document.querySelectorAll(".skill-fill").forEach((bar) => {
    const level = bar.dataset.skillLevel || 0;
    requestAnimationFrame(() => {
      bar.style.width = `${level}%`;
    });
  });
}

// Modal project data
const projectData = {
  1: {
    title: "Immersive Product Launch Microsite",
    subtitle:
      "A cinematic microsite that guides users through a launch narrative with layered motion.",
    details: [
      "Scroll‑driven chapters with parallax and timed reveals.",
      "Micro‑interactions tied to product hotspots and CTAs.",
      "Built as a responsive, performance‑tuned web experience."
    ],
    loopVariant: "loop-1"
  },
  2: {
    title: "Data‑Rich Dashboard Interface",
    subtitle:
      "An analytics space where motion highlights trends without overwhelming the layout.",
    details: [
      "Animated state changes that keep orientation on live data.",
      "Hover states that preview deeper insights before drilling in.",
      "System of easing curves tuned for clarity and responsiveness."
    ],
    loopVariant: "loop-2"
  },
  3: {
    title: "Creative Portfolio Experience",
    subtitle:
      "A portfolio built around depth, tilt interactions, and scene‑to‑scene transitions.",
    details: [
      "Interactive cards with tilt, parallax, and layered content.",
      "Section transitions that feel like moving through chapters.",
      "Designed to highlight motion, narrative, and craft."
    ],
    loopVariant: "loop-3"
  },
  4: {
    title: "Mobile Interaction Prototype",
    subtitle:
      "A library of touch‑first micro‑interactions for validating concepts quickly.",
    details: [
      "High‑fidelity prototypes with haptic‑aware motion.",
      "Gesture‑led navigation, pull‑to‑refresh, and card stacks.",
      "Optimized to feel native while remaining highly adjustable."
    ],
    loopVariant: "loop-4"
  }
};

// Modal logic
const modal = document.getElementById("projectModal");
const modalLoop = document.getElementById("modalLoop");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const modalDetails = document.getElementById("modalDetails");

function openProjectModal(id) {
  const data = projectData[id];
  if (!data) return;

  modalTitle.textContent = data.title;
  modalSubtitle.textContent = data.subtitle;

  modalDetails.innerHTML = "";
  data.details.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    modalDetails.appendChild(li);
  });

  modalLoop.innerHTML = "";
  const snippet = document.querySelector(`.project-card[data-project-id="${id}"] .motion-loop`);
  if (snippet) {
    const clone = snippet.cloneNode(true);
    // Slight variation for modal
    clone.style.transform = "scale(1.04)";
    modalLoop.appendChild(clone);
  } else {
    modalLoop.style.background = "#181717";
  }

  modal.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeProjectModal() {
  modal.classList.remove("is-open");
  document.body.style.overflow = "";
}

cards.forEach((card) => {
  card.addEventListener("click", () => {
    const id = card.getAttribute("data-project-id");
    openProjectModal(id);
  });
});

modal.querySelectorAll("[data-close-modal]").forEach((el) => {
  el.addEventListener("click", closeProjectModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) {
    closeProjectModal();
  }
});

// Contact form demo interaction
document.getElementById("fakeSubmit")?.addEventListener("click", (e) => {
  e.preventDefault();
  const button = e.currentTarget;
  button.disabled = true;
  const original = button.querySelector("span")?.textContent || "Send intro";
  const labelSpan = button.querySelector("span");
  if (labelSpan) labelSpan.textContent = "Sent (demo)";
  button.style.opacity = "0.9";
  setTimeout(() => {
    button.disabled = false;
    if (labelSpan) labelSpan.textContent = original;
    button.style.opacity = "1";
  }, 1400);
});

