// No single-word last lines: glue the final two words of every heading and paragraph with a non-breaking space.
(function(){
  var SEL='h1,h2,h3,h4,p,li,summary,figcaption,.g-s,.oc-line,.fd-sub,.rs,.dl__line,.cr-txt,.hf-l,.eyebrow,.g-v';
  function glue(el){
    if(el.dataset.typeset) return; el.dataset.typeset='1';
    var walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null),nodes=[],n;
    while((n=walker.nextNode())) if(n.nodeValue.trim()) nodes.push(n);
    if(!nodes.length) return;
    var words=el.textContent.trim().split(/\s+/); if(words.length<3) return;
    for(var i=nodes.length-1;i>=0;i--){
      var t=nodes[i].nodeValue, trimmed=t.replace(/\s+$/,'');
      var idx=trimmed.lastIndexOf(' ');
      if(idx>-1){ nodes[i].nodeValue=trimmed.slice(0,idx)+' '+trimmed.slice(idx+1)+t.slice(trimmed.length); return; }
      if(i>0 && /\s$/.test(nodes[i-1].nodeValue)){ var p=nodes[i-1].nodeValue; nodes[i-1].nodeValue=p.replace(/\s+$/,' '); return; }
    }
  }
  function run(){ document.querySelectorAll(SEL).forEach(glue); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
})();
