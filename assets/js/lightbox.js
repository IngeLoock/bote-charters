// Gallery lightbox: tap a photo to open it full screen, swipe or arrow through, x to close.
(function(){
  var gal=document.getElementById('galGrid'); if(!gal) return;
  var links=[].slice.call(gal.querySelectorAll('a'));
  var lb=document.createElement('div'); lb.className='lb'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true'); lb.setAttribute('aria-label','Photo viewer'); lb.hidden=true;
  lb.innerHTML='<button type="button" class="lb-x" aria-label="Close">&times;</button>'+
    '<button type="button" class="lb-ar lb-prev" aria-label="Previous photo">&larr;</button>'+
    '<div class="lb-stage"><img class="lb-img" alt=""></div>'+
    '<button type="button" class="lb-ar lb-next" aria-label="Next photo">&rarr;</button>'+
    '<div class="lb-count" aria-hidden="true"></div>';
  document.body.appendChild(lb);
  var img=lb.querySelector('.lb-img'),count=lb.querySelector('.lb-count'),i=0,open=false;
  function show(n,dir){
    i=(n+links.length)%links.length;
    var a=links[i],t=a.querySelector('img');
    img.classList.remove('in-l','in-r'); void img.offsetWidth;
    img.src=a.href; img.alt=t?t.alt:'';
    if(dir) img.classList.add(dir>0?'in-r':'in-l');
    count.textContent=(i+1)+' / '+links.length;
    var nx=links[(i+1)%links.length],pv=links[(i-1+links.length)%links.length];
    [nx,pv].forEach(function(l){var p=new Image();p.src=l.href;});
  }
  function openAt(n){show(n,0);lb.hidden=false;requestAnimationFrame(function(){lb.classList.add('on');});document.body.style.overflow='hidden';open=true;}
  function close(){lb.classList.remove('on');document.body.style.overflow='';open=false;setTimeout(function(){if(!open)lb.hidden=true;},250);}
  links.forEach(function(a,n){a.addEventListener('click',function(e){e.preventDefault();openAt(n);});});
  lb.querySelector('.lb-x').addEventListener('click',close);
  lb.querySelector('.lb-prev').addEventListener('click',function(){show(i-1,-1);});
  lb.querySelector('.lb-next').addEventListener('click',function(){show(i+1,1);});
  lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('lb-stage'))close();});
  document.addEventListener('keydown',function(e){if(!open)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(i-1,-1);if(e.key==='ArrowRight')show(i+1,1);});
  var sx=0,sy=0,st=0;
  lb.addEventListener('touchstart',function(e){if(e.touches.length!==1)return;sx=e.touches[0].clientX;sy=e.touches[0].clientY;st=Date.now();},{passive:true});
  lb.addEventListener('touchend',function(e){
    var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;
    if(Date.now()-st>700)return;
    if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.4){dx<0?show(i+1,1):show(i-1,-1);}
    else if(dy>72&&Math.abs(dy)>Math.abs(dx)*1.4){close();}
  },{passive:true});
})();
