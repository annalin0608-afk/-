
// ===== Sidebar & Menu =====
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const sidebar = document.getElementById('sidebar');
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  const popups = document.querySelectorAll('.sidebar-popup');
  const mapPointsHost = document.getElementById('map-points');

  // Hamburger toggle
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Sidebar item -> open matching popup
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const section = item.getAttribute('data-section');
      popups.forEach(p => p.classList.remove('active'));
      const target = document.querySelector(`.sidebar-popup[data-section="${section}"]`);
      if (target) {
        target.classList.add('active');
      }
    });
  });

  // Close popup buttons
  document.querySelectorAll('.close-popup').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.sidebar-popup')?.classList.remove('active');
    });
  });

  
  // Back button inside sidebar -> collapse sidebar and close popups
  const sidebarBack = document.getElementById('sidebar-back');
  if (sidebarBack) {
    sidebarBack.addEventListener('click', () => {
      popups.forEach(p => p.classList.remove('active'));
      sidebar.classList.remove('open');
    });
  }

  // ===== Points from JSON =====
  async function loadPoints() {
    try {
      const res = await fetch('points.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('[chinatown] 載入 points.json 失敗，改用內建備用資料：', err);
      return (window.POINTS_FALLBACK || []);
    }
  }

  function renderPoints(points) {
    if (!mapPointsHost) return;
    mapPointsHost.innerHTML = ''; // clear existing
    points.forEach(pt => {
      const a = document.createElement('a');
      a.className = 'map-point';
      a.href = pt.href || '#';
      a.style.left = (pt.left || 0) + '%';
      a.style.top = (pt.top || 0) + '%';
      a.setAttribute('data-tippy-content', pt.tooltip || pt.title || '');
      a.setAttribute('aria-label', pt.title || '地標');

      const img = document.createElement('img');
      img.src = 'marker-icon.png';
      img.alt = pt.title || '地標圖示';
      img.className = 'marker-icon';
      a.appendChild(img);

      mapPointsHost.appendChild(a);
    });

    // Attach tooltips (theme defined in CSS)
    tippy('.map-point', {
      allowHTML: true,
      theme: 'chinatown',
      placement: 'top',
      maxWidth: 340,
      interactive: true
    });
  }

  loadPoints().then(renderPoints);
});
