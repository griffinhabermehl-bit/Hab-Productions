(() => {
  const items = [...document.querySelectorAll('.gallery-item')];
  const filters = [...document.querySelectorAll('[data-gallery-filter]')];
  const count = document.getElementById('gallery-count');
  const videos = [...document.querySelectorAll('video')];
  filters.forEach(button => button.addEventListener('click', () => {
    const kind = button.dataset.galleryFilter;
    filters.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    items.forEach(item => {
      item.hidden = kind !== 'all' && item.dataset.kind !== kind;
      if (item.hidden) item.querySelector('video')?.pause();
    });
    count.textContent = kind === 'all' ? '18 works · 13 photographs · 5 short films' :
      kind === 'photo' ? '13 photographs · Select a photo to enlarge' : '5 short films · Select play to watch';
  }));
  document.querySelectorAll('.gallery-item video').forEach(video => {
    video.addEventListener('play', () => videos.forEach(other => { if (other !== video) other.pause(); }));
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) document.querySelectorAll('.gallery-item video').forEach(video => video.pause());
  });
  const dialog = document.getElementById('gallery-dialog');
  const links = [...document.querySelectorAll('[data-gallery-photo]')];
  const full = document.getElementById('gallery-full-image');
  let current = 0;
  let opener;
  function show(index) {
    current = (index + links.length) % links.length;
    const link = links[current];
    full.src = link.href;
    full.alt = link.querySelector('img').alt;
    document.getElementById('gallery-caption').textContent = link.closest('figure').querySelector('strong').textContent;
    document.getElementById('gallery-position').textContent = `Photograph ${current + 1} of ${links.length}`;
  }
  links.forEach((link, index) => link.addEventListener('click', event => {
    if (!dialog.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    videos.forEach(video => video.pause());
    show(index);
    dialog.showModal();
  }));
  document.getElementById('gallery-close').addEventListener('click', () => dialog.close());
  document.getElementById('gallery-previous').addEventListener('click', () => show(current - 1));
  document.getElementById('gallery-next').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { full.removeAttribute('src'); opener?.focus(); });
})();
