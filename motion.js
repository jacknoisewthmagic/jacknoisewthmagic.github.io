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
