(()=>{"use strict";var e,t,r,o,n,a={},i={};function d(e){var t=i[e];if(void 0!==t)return t.exports;var r=i[e]={id:e,loaded:!1,exports:{}};return a[e].call(r.exports,r,r.exports,d),r.loaded=!0,r.exports}d.m=a,e=[],d.O=(t,r,o,n)=>{if(!r){var a=1/0;for(f=0;f<e.length;f++){for(var[r,o,n]=e[f],i=!0,l=0;l<r.length;l++)(!1&n||a>=n)&&Object.keys(d.O).every((e=>d.O[e](r[l])))?r.splice(l--,1):(i=!1,n<a&&(a=n));if(i){e.splice(f--,1);var c=o();void 0!==c&&(t=c)}}return t}n=n||0;for(var f=e.length;f>0&&e[f-1][2]>n;f--)e[f]=e[f-1];e[f]=[r,o,n]},d.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return d.d(t,{a:t}),t},r=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,d.t=function(e,o){if(1&o&&(e=this(e)),8&o)return e;if("object"==typeof e&&e){if(4&o&&e.__esModule)return e;if(16&o&&"function"==typeof e.then)return e}var n=Object.create(null);d.r(n);var a={};t=t||[null,r({}),r([]),r(r)];for(var i=2&o&&e;"object"==typeof i&&!~t.indexOf(i);i=r(i))Object.getOwnPropertyNames(i).forEach((t=>a[t]=()=>e[t]));return a.default=()=>e,d.d(n,a),n},d.d=(e,t)=>{for(var r in t)d.o(t,r)&&!d.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},d.f={},d.e=e=>Promise.all(Object.keys(d.f).reduce(((t,r)=>(d.f[r](e,t),t)),[])),d.u=e=>({270:"pages-Animate",497:"common-Layout",562:"pages-Antd",563:"pages-Foo",617:"pages-",683:"pages-Bar",751:"pages-404",906:"vendor-antd"}[e]+"-"+{270:"10035179d3c563b9d73f",497:"0d95a83a3984e97f6fe7",562:"13d2244f7fd019a248af",563:"427cdf6cfd186f55a275",617:"c1c0f70e27bc6a343774",683:"66c32e9d90400a0424f3",751:"7aac2a67f297eee64fa2",906:"15e212145887a9016ad1"}[e]+".js"),d.miniCssF=e=>{},d.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),d.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o={},n="@my-react/ssr-example:",d.l=(e,t,r,a)=>{if(o[e])o[e].push(t);else{var i,l;if(void 0!==r)for(var c=document.getElementsByTagName("script"),f=0;f<c.length;f++){var u=c[f];if(u.getAttribute("src")==e||u.getAttribute("data-webpack")==n+r){i=u;break}}i||(l=!0,(i=document.createElement("script")).charset="utf-8",i.timeout=120,d.nc&&i.setAttribute("nonce",d.nc),i.setAttribute("data-webpack",n+r),i.src=e),o[e]=[t];var s=(t,r)=>{i.onerror=i.onload=null,clearTimeout(p);var n=o[e];if(delete o[e],i.parentNode&&i.parentNode.removeChild(i),n&&n.forEach((e=>e(r))),t)return t(r)},p=setTimeout(s.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=s.bind(null,i.onerror),i.onload=s.bind(null,i.onload),l&&document.head.appendChild(i)}},d.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},d.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),d.p="client/",(()=>{var e={666:0};d.f.j=(t,r)=>{var o=d.o(e,t)?e[t]:void 0;if(0!==o)if(o)r.push(o[2]);else if(666!=t){var n=new Promise(((r,n)=>o=e[t]=[r,n]));r.push(o[2]=n);var a=d.p+d.u(t),i=new Error;d.l(a,(r=>{if(d.o(e,t)&&(0!==(o=e[t])&&(e[t]=void 0),o)){var n=r&&("load"===r.type?"missing":r.type),a=r&&r.target&&r.target.src;i.message="Loading chunk "+t+" failed.\n("+n+": "+a+")",i.name="ChunkLoadError",i.type=n,i.request=a,o[1](i)}}),"chunk-"+t,t)}else e[t]=0},d.O.j=t=>0===e[t];var t=(t,r)=>{var o,n,[a,i,l]=r,c=0;if(a.some((t=>0!==e[t]))){for(o in i)d.o(i,o)&&(d.m[o]=i[o]);if(l)var f=l(d)}for(t&&t(r);c<a.length;c++)n=a[c],d.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return d.O(f)},r=self.__LOADABLE_LOADED_CHUNKS__=self.__LOADABLE_LOADED_CHUNKS__||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})(),d.nc=void 0})();