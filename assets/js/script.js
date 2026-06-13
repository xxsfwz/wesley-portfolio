const transitionLayer = document.querySelector(".grain-transition");
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function playTransition() {
  if (!transitionLayer || motionQuery.matches) return;
  transitionLayer.classList.remove("is-active");
  window.requestAnimationFrame(() => {
    transitionLayer.classList.add("is-active");
  });
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function scrollToTarget(target) {
  if (!target || motionQuery.matches) {
    target?.scrollIntoView();
    return;
  }

  const headerOffset = document.querySelector(".site-header")?.offsetHeight || 0;
  const startY = window.scrollY;
  const targetY = target.getBoundingClientRect().top + window.scrollY - headerOffset - 16;
  const distance = targetY - startY;
  const duration = Math.min(900, Math.max(520, Math.abs(distance) * 0.42));
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) window.requestAnimationFrame(step);
  }

  window.requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    playTransition();
    scrollToTarget(target);
    history.pushState(null, "", id);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document
  .querySelectorAll(
    ".section-heading, .studio-tile, .video-case-layout, .story-strip a, .project-feature-card, .ai-shot, .practice-motion .motion-card, .compact-photo-strip .photo-card, .poster-lab, .flat-poster-lab, .poster-card, .resume-block"
  )
  .forEach((item) => {
    item.classList.add("reveal-item");
    revealObserver.observe(item);
  });

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxTitle = lightbox?.querySelector("strong");
const lightboxNote = lightbox?.querySelector("figcaption span");
const lightboxClose = lightbox?.querySelector(".lightbox-close");

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("has-lightbox");
}

document.querySelectorAll(".js-lightbox").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxNote) return;
    event.preventDefault();
    lightboxImage.src = link.href;
    lightboxImage.alt = link.querySelector("img")?.alt || "";
    lightboxTitle.textContent = link.dataset.title || "";
    lightboxNote.textContent = link.dataset.note || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("has-lightbox");
  });
});

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});
