(() => {
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const stackMediaQuery = window.matchMedia("(max-width: 980px)");
  const transitionLayer = document.querySelector(".grain-transition");

  function playTransition() {
    if (!transitionLayer || motionQuery.matches) return;
    transitionLayer.classList.remove("is-active");
    window.requestAnimationFrame(() => transitionLayer.classList.add("is-active"));
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
    const duration = Math.min(900, Math.max(480, Math.abs(distance) * 0.42));
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

  function setupFallbackReveal() {
    const revealSelector = stackMediaQuery.matches
      ? ".section-heading, .case-teaser, .case-layout, .motion-card, .photo-journal, .poster-lab, .flat-poster-lab, .skills-grid article, .resume-panel, .contact-panel"
      : ".section-heading, .case-teaser, .case-layout, .story-strip a, .ai-shot, .motion-card, .photo-journal, .poster-lab, .flat-poster-lab, .poster-card, .skills-grid article, .resume-panel, .contact-panel";
    const revealItems = document.querySelectorAll(revealSelector);

    if (!("IntersectionObserver" in window) || motionQuery.matches) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item) => {
      item.classList.add("reveal-item");
      revealObserver.observe(item);
    });
  }

  function setupGsapAnimations() {
    const gsap = window.gsap;
    if (!gsap || motionQuery.matches) {
      setupFallbackReveal();
      return;
    }

    const scrollTrigger = window.ScrollTrigger;
    if (scrollTrigger) gsap.registerPlugin(scrollTrigger);

    gsap.from(".hero .eyebrow, .hero h1, .hero-copy, .quick-facts, .hero-actions .button", {
      y: 18,
      opacity: 0,
      duration: 0.72,
      ease: "power3.out",
      stagger: 0.08,
      clearProps: "transform,opacity"
    });

    gsap.from(".hero-preview", {
      scale: 0.96,
      y: 18,
      opacity: 0,
      duration: 0.8,
      delay: 0.18,
      ease: "power3.out",
      stagger: 0.1,
      clearProps: "transform,opacity"
    });

    if (!scrollTrigger) {
      setupFallbackReveal();
      return;
    }

    gsap.utils
      .toArray(".section-heading, .case-layout, .poster-lab, .flat-poster-lab, .resume-panel, .contact-panel")
      .forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 82%",
            once: true
          },
          y: 24,
          opacity: 0,
          duration: 0.68,
          ease: "power3.out",
          clearProps: "transform,opacity"
        });
      });

    const staggerSelectors = [".case-teaser", ".motion-card", ".photo-card", ".skills-grid article"];
    if (!stackMediaQuery.matches) {
      staggerSelectors.push(".story-strip a", ".ai-shot", ".poster-card");
    }

    staggerSelectors.forEach((selector) => {
        const items = gsap.utils.toArray(selector);
        if (!items.length) return;
        gsap.from(items, {
          scrollTrigger: {
            trigger: items[0].closest("section") || items[0],
            start: "top 78%",
            once: true
          },
          y: 18,
          opacity: 0,
          duration: 0.55,
          stagger: 0.045,
          ease: "power3.out",
          clearProps: "transform,opacity"
        });
      });

    gsap.utils.toArray(".video-frame").forEach((frame) => {
      gsap.fromTo(
        frame,
        { scale: 0.985 },
        {
          scale: 1,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: {
            trigger: frame,
            start: "top 82%",
            once: true
          },
          clearProps: "transform"
        }
      );
    });
  }

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
      const active = stackMediaQuery.matches;
      container.classList.toggle("is-card-stack", active);
      controls.hidden = !active;

      cards.forEach((card, index) => {
        card.classList.remove("is-active", "is-near", "is-far");
        card.removeAttribute("aria-hidden");
        card.style.transform = "";
        card.style.zIndex = "";
        card.style.opacity = "";

        if (!active) return;

        const offset = shortestOffset(index);
        const abs = Math.abs(offset);
        const clamped = Math.max(-2, Math.min(2, offset));
        const x = clamped * 34 - 50;
        const y = abs * 12;
        const rotate = clamped * -5;
        const scale = 1 - abs * 0.06;

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
      if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY)) return;
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

  function setupStacks() {
    document.querySelectorAll(".story-strip").forEach((container) => setupCardStack(container));
    document
      .querySelectorAll(".ai-gallery")
      .forEach((container) => setupCardStack(container, { cardSelector: ".ai-shot" }));
    document
      .querySelectorAll(".poster-lab .poster-grid")
      .forEach((container) => setupCardStack(container, { cardSelector: ".poster-card" }));
  }

  function setupLightbox() {
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
  }

  function warmUpHeroVideo() {
    const previewVideo = document.querySelector(".hero-preview-motion video");
    if (!previewVideo || motionQuery.matches) return;

    previewVideo.addEventListener(
      "loadedmetadata",
      () => {
        previewVideo.currentTime = Math.min(1.2, previewVideo.duration || 1.2);
      },
      { once: true }
    );
  }

  try {
    setupStacks();
    setupLightbox();
    warmUpHeroVideo();
    setupGsapAnimations();
  } catch (error) {
    console.error("Portfolio script failed safely:", error);
    setupFallbackReveal();
  }
})();
