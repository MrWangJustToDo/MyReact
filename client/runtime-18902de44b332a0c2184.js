(()=>{"use strict";var e,t,r,o,a,n={},i={};function l(e){var t=i[e];if(void 0!==t)return t.exports;var r=i[e]={id:e,loaded:!1,exports:{}};return n[e].call(r.exports,r,r.exports,l),r.loaded=!0,r.exports}l.m=n,e=[],l.O=(t,r,o,a)=>{if(!r){var n=1/0;for(u=0;u<e.length;u++){for(var[r,o,a]=e[u],i=!0,c=0;c<r.length;c++)(!1&a||n>=a)&&Object.keys(l.O).every((e=>l.O[e](r[c])))?r.splice(c--,1):(i=!1,a<n&&(n=a));if(i){e.splice(u--,1);var d=o();void 0!==d&&(t=d)}}return t}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[r,o,a]},l.F={},l.E=e=>{Object.keys(l.F).map((t=>{l.F[t](e)}))},l.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return l.d(t,{a:t}),t},r=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,l.t=function(e,o){if(1&o&&(e=this(e)),8&o)return e;if("object"==typeof e&&e){if(4&o&&e.__esModule)return e;if(16&o&&"function"==typeof e.then)return e}var a=Object.create(null);l.r(a);var n={};t=t||[null,r({}),r([]),r(r)];for(var i=2&o&&e;"object"==typeof i&&!~t.indexOf(i);i=r(i))Object.getOwnPropertyNames(i).forEach((t=>n[t]=()=>e[t]));return n.default=()=>e,l.d(a,n),a},l.d=(e,t)=>{for(var r in t)l.o(t,r)&&!l.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},l.f={},l.e=e=>Promise.all(Object.keys(l.f).reduce(((t,r)=>(l.f[r](e,t),t)),[])),l.u=e=>(({189:"page-About",392:"page-",660:"page-Tldraw",725:"page-404",792:"page-Blog"}[e]||e)+"-"+{189:"2b737cbb81fa851103bb",392:"43c1201b68e67026dc91",660:"cbd54026eac637271e14",725:"bf657922209b25b31968",792:"93fb3aacd1b3692ea316",882:"1555492ba394a75ad1c4"}[e]+".js"),l.miniCssF=e=>{},l.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),l.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o={},a="@my-react/ssr-example:",l.l=(e,t,r,n)=>{if(o[e])o[e].push(t);else{var i,c;if(void 0!==r)for(var d=document.getElementsByTagName("script"),u=0;u<d.length;u++){var f=d[u];if(f.getAttribute("src")==e||f.getAttribute("data-webpack")==a+r){i=f;break}}i||(c=!0,(i=document.createElement("script")).charset="utf-8",i.timeout=120,l.nc&&i.setAttribute("nonce",l.nc),i.setAttribute("data-webpack",a+r),i.src=e),o[e]=[t];var s=(t,r)=>{i.onerror=i.onload=null,clearTimeout(p);var a=o[e];if(delete o[e],i.parentNode&&i.parentNode.removeChild(i),a&&a.forEach((e=>e(r))),t)return t(r)},p=setTimeout(s.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=s.bind(null,i.onerror),i.onload=s.bind(null,i.onload),c&&document.head.appendChild(i)}},l.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),l.p="client/",(()=>{var e={666:0};l.f.j=(t,r)=>{var o=l.o(e,t)?e[t]:void 0;if(0!==o)if(o)r.push(o[2]);else if(666!=t){var a=new Promise(((r,a)=>o=e[t]=[r,a]));r.push(o[2]=a);var n=l.p+l.u(t),i=new Error;l.l(n,(r=>{if(l.o(e,t)&&(0!==(o=e[t])&&(e[t]=void 0),o)){var a=r&&("load"===r.type?"missing":r.type),n=r&&r.target&&r.target.src;i.message="Loading chunk "+t+" failed.\n("+a+": "+n+")",i.name="ChunkLoadError",i.type=a,i.request=n,o[1](i)}}),"chunk-"+t,t)}else e[t]=0},l.F.j=t=>{if((!l.o(e,t)||void 0===e[t])&&666!=t){e[t]=null;var r=document.createElement("link");l.nc&&r.setAttribute("nonce",l.nc),r.rel="prefetch",r.as="script",r.href=l.p+l.u(t),document.head.appendChild(r)}},l.O.j=t=>0===e[t];var t=(t,r)=>{var o,a,[n,i,c]=r,d=0;if(n.some((t=>0!==e[t]))){for(o in i)l.o(i,o)&&(l.m[o]=i[o]);if(c)var u=c(l)}for(t&&t(r);d<n.length;d++)a=n[d],l.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return l.O(u)},r=self.webpackChunk_my_react_ssr_example=self.webpackChunk_my_react_ssr_example||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})(),l.nc=void 0})();