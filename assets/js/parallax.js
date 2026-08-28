(function(){
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var els = document.querySelectorAll('.hero img.bg, .band.centre > img.bg');
  if (!els.length) return;
  var ticking = false;
  function update(){
    ticking = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = 0; i < els.length; i++){
      var el = els[i];
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      var center = (r.top + r.height / 2) - vh / 2;
      var offset = center * -0.12;
      if (offset > 60) offset = 60;
      if (offset < -60) offset = -60;
      el.style.setProperty('--py', offset.toFixed(1) + 'px');
    }
  }
  function onScroll(){
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
