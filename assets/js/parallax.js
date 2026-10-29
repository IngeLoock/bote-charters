(function(){
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var els = document.querySelectorAll('.hero img.bg, .band.centre > img.bg');
  if (!els.length) return;
  var ticking = false;
  function update(){
    ticking = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var isMobile = window.innerWidth <= 640;
    var strength = isMobile ? 0.2 : 0.12;
    var maxOffset = isMobile ? 100 : 60;
    for (var i = 0; i < els.length; i++){
      var el = els[i];
      var box = el.parentElement.getBoundingClientRect();
      if (box.bottom < -200 || box.top > vh + 200) continue;
      var center = (box.top + box.height / 2) - vh / 2;
      var offset = center * -strength;
      // never shift further than the image's own overscan (scale 1.08 = 4% each side), so no gap can open
      var avail = Math.max(0, box.height * 0.04 - 1);
      var lim = Math.min(maxOffset, avail);
      if (offset > lim) offset = lim;
      if (offset < -lim) offset = -lim;
      el.style.setProperty('--py', offset.toFixed(1) + 'px');
    }
  }
  function onScroll(){
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('orientationchange', onScroll);
  update();
})();
