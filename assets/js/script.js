const transitionLayer = document.querySelector(".grain-transition");
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function playTransition() {
  if (!transitionLayer || motionQuery.matches) return;
  transitionLayer.classList.remove("is-active");
  window.requestAnimationFrame(() => {
    transitionLayer.classList.add("is-active");
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    playTransition();
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
  .querySelectorAll(".section-heading, .work-row, .case-layout, .method-grid > div, .resume-block")
  .forEach((item) => {
    item.classList.add("reveal-item");
    revealObserver.observe(item);
  });
