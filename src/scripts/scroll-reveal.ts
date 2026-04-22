// Triggers .visible on .reveal elements when they enter the viewport.
// Supports data-delay="100" (ms) for cascade effects in grids.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;
      setTimeout(() => el.classList.add('visible'), delay);
      observer.unobserve(el);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => observer.observe(el));
