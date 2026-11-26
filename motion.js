(() => {
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  /* Small anchor-point pop where the pen clicks (desktop only). */
  if (finePointer.matches && !reduced.matches) {
    document.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      const dot = document.createElement('span');
      dot.className = 'jn-anchor-pop';
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      document.body.append(dot);
      dot.addEventListener('animationend', () => dot.remove(), { once: true });
    });
  }

  /* Floating tool icons respond to the mouse: tilt, slight turn, grow; glide back. */
  const icons = [...document.querySelectorAll('.jn-tool > svg, .jn-glass-icon > span')];
  if (finePointer.matches && !reduced.matches && icons.length) {
    const RANGE = 160;
    const items = icons.map(el => ({
      el, host: el.closest('.jn-tool, .jn-glass-icon'),
      x: 0, y: 0, rot: 0, scale: 1, tx: 0, ty: 0, trot: 0, tscale: 1
    }));
    document.addEventListener('pointermove', e => {
      for (const it of items) {
        const r = it.host.getBoundingClientRect();
        if (r.bottom < -RANGE || r.top > innerHeight + RANGE) continue;
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = e.clientX - cx, dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const reach = RANGE + r.width / 2;
        if (dist < reach && dist > 0.01) {
          const p = 1 - dist / reach;
          const ease = p * p * (3 - 2 * p);
          it.tx = -(dy / dist) * 12 * ease;
          it.ty = (dx / dist) * 14 * ease;
          it.trot = (dx / dist) * 8 * ease;
          it.tscale = 1 + 0.16 * ease;
        } else { it.tx = it.ty = it.trot = 0; it.tscale = 1; }
      }
    }, { passive: true });
    const tick = () => {
      for (const it of items) {
        it.x += (it.tx - it.x) * 0.14;
        it.y += (it.ty - it.y) * 0.14;
        it.rot += (it.trot - it.rot) * 0.14;
        it.scale += (it.tscale - it.scale) * 0.14;
        it.el.style.transform =
          `perspective(500px) rotateX(${it.x.toFixed(2)}deg) rotateY(${it.y.toFixed(2)}deg) rotateZ(${it.rot.toFixed(2)}deg) scale(${it.scale.toFixed(3)})`;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
})();

/* v8: scroll animation (skipped when the visitor prefers reduced motion). */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const home = document.querySelector('.fb-home');
  if (!home) return;
  const sel = '.fb-hero-copy>*,.fb-summary,.fb-section-head,.fb-tabs,.fb-cat-title,.fb-project,.fb-statement .fb-kicker,.fb-statement h2,.fb-statement>p:last-child,.fb-services .fb-kicker,.fb-services article,.fb-about>div,.fb-about-facts li,.fb-contact .fb-kicker,.fb-form-intro>*,.fb-form-card,.fb-contact h2,.fb-contact .fb-email,.fb-socials,.jn-tool,.jn-glass-icon';
  const els = [...document.querySelectorAll(sel)];
  /* Replay: reveal when an element enters view, reset once it is fully out of view, in both scroll directions. */
  const ioIn = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('jn-in'); }),
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  const ioOut = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) e.target.classList.remove('jn-in'); }),
    { threshold: 0 });
  els.forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => c.matches(sel));
    el.style.setProperty('--d', (Math.min(sibs.indexOf(el), 3) * 0.12) + 's');
    el.classList.add('jn-rv');
    ioIn.observe(el); ioOut.observe(el);
  });
  document.documentElement.classList.add('jn-anim');
  /* Failsafe: never leave content hidden. */
  setTimeout(() => els.forEach(el => { if (!el.classList.contains('jn-in') && el.getBoundingClientRect().top < innerHeight) el.classList.add('jn-in'); }), 1500);

  /* Progress line + soft image parallax while scrolling. */
  const bar = document.createElement('div'); bar.className = 'jn-scroll-bar'; document.body.append(bar);
  const wells = [...document.querySelectorAll('.fb-project .fb-image-well')];
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : 0);
    for (const w of wells) {
      const r = w.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      w.firstElementChild.style.setProperty('--py', (k * -22).toFixed(1) + 'px');
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();
