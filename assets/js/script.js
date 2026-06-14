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
    ".section-heading, .studio-tile, .video-case-layout, .ae-case-layout, .ae-process-board, .story-strip a, .project-feature-card, .ai-shot, .practice-motion .motion-card, .compact-photo-strip .photo-card, .poster-lab, .flat-poster-lab, .poster-card, .resume-block"
  )
  .forEach((item) => {
    item.classList.add("reveal-item");
    revealObserver.observe(item);
  });

const stackMediaQuery = window.matchMedia("(max-width: 980px)");

function setupCardStack(container, options = {}) {
  const cards = Array.from(container.querySelectorAll(options.cardSelector || "a"));
  if (cards.length < 2) return;

  let activeIndex = 0;
  let startX = 0;
  let startY = 0;
  const controls = document.createElement("div");
  const previousButton = document.createElement("button");
  const nextButton = document.createElement("button");
  const counter = document.createElement("span");

  controls.className = "card-stack-controls";
  previousButton.type = "button";
  nextButton.type = "button";
  previousButton.setAttribute("aria-label", "上一张");
  nextButton.setAttribute("aria-label", "下一张");
  previousButton.textContent = "‹";
  nextButton.textContent = "›";
  controls.append(previousButton, counter, nextButton);
  container.after(controls);

  function wrap(index) {
    return (index + cards.length) % cards.length;
  }

  function shortestOffset(index) {
    let offset = index - activeIndex;
    if (offset > cards.length / 2) offset -= cards.length;
    if (offset < -cards.length / 2) offset += cards.length;
    return offset;
  }

  function render() {
    container.classList.toggle("is-card-stack", stackMediaQuery.matches);
    controls.hidden = !stackMediaQuery.matches;

    cards.forEach((card, index) => {
      card.classList.remove("is-active", "is-near", "is-far");
      card.removeAttribute("aria-hidden");
      card.style.transform = "";
      card.style.zIndex = "";
      card.style.opacity = "";

      if (!stackMediaQuery.matches) return;

      const offset = shortestOffset(index);
      const abs = Math.abs(offset);
      const clamped = Math.max(-2, Math.min(2, offset));
      const x = clamped * 34 - 50;
      const y = abs * 11;
      const rotate = clamped * -5;
      const scale = 1 - abs * 0.055;

      card.style.transform = `translateX(${x}%) translateY(${y}px) rotate(${rotate}deg) scale(${scale})`;
      card.style.zIndex = String(10 - abs);

      if (offset === 0) {
        card.classList.add("is-active");
      } else if (abs === 1) {
        card.classList.add("is-near");
      } else if (abs === 2) {
        card.classList.add("is-far");
      } else {
        card.setAttribute("aria-hidden", "true");
        card.style.opacity = "0";
      }
    });

    counter.textContent = `${activeIndex + 1} / ${cards.length}`;
  }

  function go(delta) {
    activeIndex = wrap(activeIndex + delta);
    render();
  }

  previousButton.addEventListener("click", () => go(-1));
  nextButton.addEventListener("click", () => go(1));

  container.addEventListener("pointerdown", (event) => {
    if (!stackMediaQuery.matches) return;
    startX = event.clientX;
    startY = event.clientY;
  });

  container.addEventListener("pointerup", (event) => {
    if (!stackMediaQuery.matches) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (Math.abs(deltaX) < 44 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    go(deltaX < 0 ? 1 : -1);
  });

  cards.forEach((card, index) => {
    card.addEventListener("click", (event) => {
      if (!stackMediaQuery.matches) return;
      const offset = shortestOffset(index);
      if (offset === 0) return;
      event.preventDefault();
      go(offset > 0 ? 1 : -1);
    });
  });

  stackMediaQuery.addEventListener("change", render);
  render();
}

document.querySelectorAll(".story-strip").forEach((container) => setupCardStack(container));
document
  .querySelectorAll(".ai-gallery")
  .forEach((container) => setupCardStack(container, { cardSelector: ".ai-shot" }));
document
  .querySelectorAll(".poster-lab .poster-grid")
  .forEach((container) => setupCardStack(container, { cardSelector: ".poster-card" }));

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
