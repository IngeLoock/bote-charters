// Auto-advancing rails on touch/phone screens. Pauses while the visitor is touching,
// resumes a few seconds after they let go, only runs while the rail is on screen.
(function(){
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  var touch=matchMedia('(hover:none) and (pointer:coarse)').matches||matchMedia('(max-width:900px)').matches;
  if(!touch)return;
  var INTERVAL=4200,RESUME=7000;
  function setup(track,nextSel,firstSel){
    var root=track.closest('.oc-rail, .swipe')||track.parentElement;
    var next=nextSel?root.querySelector(nextSel):null;
    var timer=null,hold=null,visible=false,held=false;
    function atEnd(){return track.scrollLeft+track.clientWidth>=track.scrollWidth-6;}
    function step(){var c=track.children[0];if(!c)return 300;var g=parseFloat(getComputedStyle(track).columnGap||getComputedStyle(track).gap)||20;return c.getBoundingClientRect().width+g;}
    function tick(){
      if(document.hidden||!visible||held)return;
      if(atEnd()){
        var first=firstSel?root.querySelector(firstSel):null;
        if(first){first.click();}else{track.scrollTo({left:0,behavior:'smooth'});}
      }else if(next&&!next.disabled){next.click();}
      else{track.scrollBy({left:step(),behavior:'smooth'});}
    }
    function start(){stop();timer=setInterval(tick,INTERVAL);}
    function stop(){if(timer){clearInterval(timer);timer=null;}}
    function pause(){held=true;stop();clearTimeout(hold);}
    function resume(){clearTimeout(hold);hold=setTimeout(function(){held=false;if(visible)start();},RESUME);}
    ['pointerdown','touchstart'].forEach(function(e){root.addEventListener(e,pause,{passive:true});});
    ['pointerup','pointercancel','touchend','touchcancel'].forEach(function(e){root.addEventListener(e,resume,{passive:true});});
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){visible=es[0].isIntersecting;if(visible&&!held)start();else if(!visible)stop();},{threshold:.35}).observe(track);
    }else{visible=true;start();}
    document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else if(visible&&!held)start();});
  }
  document.querySelectorAll('.oc-track').forEach(function(t){setup(t,'.oc-next',null);});
  document.querySelectorAll('.swipe-track').forEach(function(t){setup(t,'.swipe-next','.swipe-dots button');});
  document.querySelectorAll('.m-rail').forEach(function(t){setup(t,null,null);});
})();
