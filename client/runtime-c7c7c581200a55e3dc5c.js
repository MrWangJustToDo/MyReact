(()=>{"use strict";var e,t,r,o,n,a={},i={};function l(e){var t=i[e];if(void 0!==t)return t.exports;var r=i[e]={id:e,loaded:!1,exports:{}};return a[e].call(r.exports,r,r.exports,l),r.loaded=!0,r.exports}l.m=a,e=[],l.O=(t,r,o,n)=>{if(!r){var a=1/0;for(c=0;c<e.length;c++){for(var[r,o,n]=e[c],i=!0,d=0;d<r.length;d++)(!1&n||a>=n)&&Object.keys(l.O).every((e=>l.O[e](r[d])))?r.splice(d--,1):(i=!1,n<a&&(a=n));if(i){e.splice(c--,1);var f=o();void 0!==f&&(t=f)}}return t}n=n||0;for(var c=e.length;c>0&&e[c-1][2]>n;c--)e[c]=e[c-1];e[c]=[r,o,n]},l.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return l.d(t,{a:t}),t},r=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,l.t=function(e,o){if(1&o&&(e=this(e)),8&o)return e;if("object"==typeof e&&e){if(4&o&&e.__esModule)return e;if(16&o&&"function"==typeof e.then)return e}var n=Object.create(null);l.r(n);var a={};t=t||[null,r({}),r([]),r(r)];for(var i=2&o&&e;"object"==typeof i&&!~t.indexOf(i);i=r(i))Object.getOwnPropertyNames(i).forEach((t=>a[t]=()=>e[t]));return a.default=()=>e,l.d(n,a),n},l.d=(e,t)=>{for(var r in t)l.o(t,r)&&!l.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},l.f={},l.e=e=>Promise.all(Object.keys(l.f).reduce(((t,r)=>(l.f[r](e,t),t)),[])),l.u=e=>({270:"pages-Animate",497:"common-Layout",562:"pages-Antd",563:"pages-Foo",617:"pages-",683:"pages-Bar",751:"pages-404",906:"vendor-antd"}[e]+"-"+{270:"10035179d3c563b9d73f",497:"d7697885257fb17322e3",562:"dcf8b85b540982a25aad",563:"427cdf6cfd186f55a275",617:"213245ca35b44ce97847",683:"66c32e9d90400a0424f3",751:"300e71394fb865491714",906:"219251f29e47be999151"}[e]+".js"),l.miniCssF=e=>{},l.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),l.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o={},n="@my-react/ssr-example:",l.l=(e,t,r,a)=>{if(o[e])o[e].push(t);else{var i,d;if(void 0!==r)for(var f=document.getElementsByTagName("script"),c=0;c<f.length;c++){var u=f[c];if(u.getAttribute("src")==e||u.getAttribute("data-webpack")==n+r){i=u;break}}i||(d=!0,(i=document.createElement("script")).charset="utf-8",i.timeout=120,l.nc&&i.setAttribute("nonce",l.nc),i.setAttribute("data-webpack",n+r),i.src=e),o[e]=[t];var s=(t,r)=>{i.onerror=i.onload=null,clearTimeout(p);var n=o[e];if(delete o[e],i.parentNode&&i.parentNode.removeChild(i),n&&n.forEach((e=>e(r))),t)return t(r)},p=setTimeout(s.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=s.bind(null,i.onerror),i.onload=s.bind(null,i.onload),d&&document.head.appendChild(i)}},l.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),l.p="client/",(()=>{var e={666:0};l.f.j=(t,r)=>{var o=l.o(e,t)?e[t]:void 0;if(0!==o)if(o)r.push(o[2]);else if(666!=t){var n=new Promise(((r,n)=>o=e[t]=[r,n]));r.push(o[2]=n);var a=l.p+l.u(t),i=new Error;l.l(a,(r=>{if(l.o(e,t)&&(0!==(o=e[t])&&(e[t]=void 0),o)){var n=r&&("load"===r.type?"missing":r.type),a=r&&r.target&&r.target.src;i.message="Loading chunk "+t+" failed.\n("+n+": "+a+")",i.name="ChunkLoadError",i.type=n,i.request=a,o[1](i)}}),"chunk-"+t,t)}else e[t]=0},l.O.j=t=>0===e[t];var t=(t,r)=>{var o,n,[a,i,d]=r,f=0;if(a.some((t=>0!==e[t]))){for(o in i)l.o(i,o)&&(l.m[o]=i[o]);if(d)var c=d(l)}for(t&&t(r);f<a.length;f++)n=a[f],l.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return l.O(c)},r=self.__LOADABLE_LOADED_CHUNKS__=self.__LOADABLE_LOADED_CHUNKS__||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})(),l.nc=void 0})();