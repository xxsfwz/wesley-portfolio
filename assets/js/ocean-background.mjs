import { World, AsciiRenderer } from '../vendor/ascii-sharks/index.mjs';

const canvas = document.querySelector('#ocean-background');
const toggle = document.querySelector('#ocean-toggle');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const compact = matchMedia('(max-width: 600px)').matches;
let renderer;
try { renderer = new AsciiRenderer(canvas); } catch { canvas.remove(); }

if (renderer) {
  renderer.setFontFamily("Consolas, 'Courier New', monospace");
  const world = new World([
    { kind: 'hammerhead', size: compact ? .72 : .92 },
    { kind: 'classic', size: compact ? .55 : .68 },
  ], compact ? 24 : 60);
  let manualPause = motion.matches;
  try { const stored = localStorage.getItem('portfolio-ocean-paused'); if (stored !== null) manualPause = stored === '1'; } catch {}
  let raf = 0;
  let previous = 0;
  let drawn = 0;
  let disposed = false;
  const blocked = () => disposed || manualPause || document.hidden || !!document.querySelector('dialog[open]');

  function resize() {
    const rect = canvas.getBoundingClientRect();
    renderer.resize(rect.width, rect.height, Math.min(devicePixelRatio || 1, 1.5));
    world.resize(rect.width, rect.height, renderer.cellWidth, renderer.cellHeight);
    renderer.render(world, 1 / 60);
  }
  function frame(now) {
    if (blocked()) { raf = 0; return; }
    // A background needs less work than a full-screen demo: draw at 30 fps.
    if (now - drawn >= 1000 / 30) {
      let dt = Math.min((now - previous) / 1000, .08) * .95;
      while (dt > 0) { const step = Math.min(dt, 1 / 60); world.step(step); dt -= step; }
      renderer.render(world, Math.min((now - previous) / 1000, .08));
      previous = now;
      drawn = now;
    }
    raf = requestAnimationFrame(frame);
  }
  function sync() {
    cancelAnimationFrame(raf);
    raf = 0;
    world.pointer.active = false;
    toggle.setAttribute('aria-pressed', String(manualPause));
    toggle.setAttribute('aria-label', manualPause ? '播放背景动效' : '暂停背景动效');
    toggle.innerHTML = `<span aria-hidden="true">${manualPause ? '▶' : 'Ⅱ'}</span> ${manualPause ? '播放背景' : '暂停背景'}`;
    toggle.hidden = false;
    if (!blocked()) { previous = drawn = performance.now(); raf = requestAnimationFrame(frame); }
  }
  function pointer(e) {
    if (blocked() || e.pointerType === 'touch') return;
    world.pointer.x = e.clientX;
    world.pointer.y = e.clientY;
    world.pointer.active = true;
  }
  toggle.addEventListener('click', () => {
    manualPause = !manualPause;
    try { localStorage.setItem('portfolio-ocean-paused', manualPause ? '1' : '0'); } catch {}
    sync();
  });
  window.addEventListener('pointermove', pointer, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { world.pointer.active = false; });
  window.addEventListener('blur', () => { world.pointer.active = false; });
  window.addEventListener('pointerdown', e => {
    if (!blocked() && !e.target.closest('a,button,input,summary,dialog,video')) world.splash(e.clientX, e.clientY);
  }, { passive: true });
  const resizer = new ResizeObserver(resize);
  const dialogs = new MutationObserver(sync);
  resizer.observe(canvas);
  document.querySelectorAll('dialog').forEach(el => dialogs.observe(el, { attributes: true, attributeFilter: ['open'] }));
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', () => { manualPause = motion.matches; sync(); });
  resize();
  // Warm up the simulation so the first frame already has recognisable fish.
  for (let i = 0; i < 90; i++) world.step(1 / 60);
  renderer.render(world, 1 / 60);
  sync();
  window.addEventListener('pagehide', () => { disposed = true; cancelAnimationFrame(raf); resizer.disconnect(); dialogs.disconnect(); });
  window.addEventListener('pageshow', e => {
    if (e.persisted) {
      disposed = false;
      resizer.observe(canvas);
      document.querySelectorAll('dialog').forEach(el => dialogs.observe(el, { attributes: true, attributeFilter: ['open'] }));
      resize();
      sync();
    }
  });
}
