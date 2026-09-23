(() => {
  let initialHash;
  try { initialHash = decodeURIComponent(location.hash.slice(1)); } catch { initialHash = ''; }
  const oldRoute = window.legacyRoutes?.[initialHash];
  if (oldRoute) {
    location.replace(oldRoute);
    return;
  }

  function revealLinkedPublication() {
    let hash;
    try { hash = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(hash);
    if (!target) return;
    const more = target.closest('.publication-more');
    if (more && !more.open) {
      more.open = true;
      requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    }
  }
  addEventListener('hashchange', revealLinkedPublication);
  revealLinkedPublication();

  const dialog = document.getElementById('lightbox');
  if (!dialog) return;
  let opener;
  document.querySelectorAll('[data-lightbox]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      const img = dialog.querySelector('img');
      img.src = button.dataset.lightbox;
      img.alt = button.dataset.caption || '';
      dialog.querySelector('#lightbox-caption').textContent = button.dataset.caption || '';
      dialog.querySelector('.lightbox-source').textContent = button.dataset.source ? `Source: ${button.dataset.source}` : '';
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    });
  });
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    opener?.focus();
  });
})();
