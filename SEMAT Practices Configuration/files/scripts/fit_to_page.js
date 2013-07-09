function fit_to_page() {
	if (typeof myMax!=="number") { max=0.1; } else { max=myMax;}
	if (typeof myRedraw!=="string") myRedraw="width";
	
	b=document.getElementsByTagName('body')[0];	

	zW=(b.clientWidth-5)/b.scrollWidth;
	
	if (myRedraw==="both") {
		zH=(b.clientHeight)/b.scrollHeight;
		if (zH<zW && zH < 1) { z=zH } else { z=zW };
	}
	else {
		z=zW;
	}
	
	if (z>1+max) { z=1+max; } else if (z<1-max) { z=1-max; }

	s="zoom:"+z+"; -moz-transform: scale("+z+"); -moz-transform-origin: 0 0;";

	if (typeof b.setAttribute === "function") b.setAttribute('style', s);
	else if (typeof b.style.setAttribute === "object") b.style.setAttribute('cssText', s);
}
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}

function addResizeEvent(func) {
  var oldonresize = window.onresize;
  if (typeof window.onresize != 'function') {
    window.onresize = func;
  } else {
    window.onresize = function() {
      if (oldonresize) {
        oldonresize();
      }
      func();
    }
  }
}

myMax=0.8;
myRedraw="width";

addLoadEvent(fit_to_page);
addResizeEvent(fit_to_page);
