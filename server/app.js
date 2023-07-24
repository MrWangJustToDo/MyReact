(()=>{var e,t={9899:(e,t,r)=>{"use strict";r.d(t,{k:()=>o});var s=r(6689),n=r(9987),a=r(3920);const o=(e,t="/")=>{const r=(0,s.memo)(e);return()=>{const e=(0,n.dT)(t);return(0,a.jsx)(r,{...e})}}},9987:(e,t,r)=>{"use strict";r.d(t,{XY:()=>C,Nq:()=>T,hZ:()=>q,hV:()=>m,qR:()=>$,dT:()=>U,X0:()=>J,dD:()=>L,tm:()=>O,r$:()=>c,Kx:()=>I,UE:()=>B,tl:()=>b,rC:()=>k,Jv:()=>A,Zb:()=>R,Xw:()=>y,iP:()=>N});var s=r(8930),n=r(187),a=r(7586),o=r(2412);const i=require("reactivity-store"),c=(0,i.createState)((0,i.withActions)((()=>({loading:!1})),{generateActions:e=>({setLoading:t=>{e.loading=t}})}));var l=r(6689);const d=require("lodash/debounce");var u=r.n(d);const p=(e,t=200)=>{const[r,s]=(0,l.useState)(e);return[r,(0,l.useMemo)((()=>u()(s,t)),[t])]},h={width:0,height:0,left:0,right:0,top:0,bottom:0,x:0,y:0};function m({ref:e,cssSelector:t}){const[r,s]=p(h,100);return(0,l.useEffect)((()=>{const r=e?e.current:t?document.querySelector(t):null;if(r){if(window.ResizeObserver){const e=new ResizeObserver((()=>{s(r.getBoundingClientRect())}));return e.observe(r),()=>e.disconnect()}{const e=()=>s(r.getBoundingClientRect());return e(),window.addEventListener("resize",e,{passive:!0}),()=>window.removeEventListener("resize",e)}}}),[e,t,s]),r}var g=r(6022),f=r(3308),v=r(4661);const y=({routes:e,preLoad:t})=>{const r=(0,l.useRef)(),s=(0,g.useStore)(),i=(0,f.useLocation)(),d=(0,f.useNavigate)(),[u]=(0,v.useSearchParams)(),p=c((e=>e.setLoading)),h=(0,l.useRef)(!!(0,n.uf)()),m=(0,l.useRef)(""),y=(0,l.useRef)(""),S=(0,l.useRef)(null),w=(0,l.useRef)(null),_=(0,l.useRef)(s),[x,E]=(0,l.useState)((0,n.uf)()?void 0:{location:i,query:u});return y.current=`${i.pathname}?${u.toString()}`,m.current=x?`${x.location.pathname}?${x.query.toString()}`:"",_.current=s,(0,l.useEffect)((()=>{if(h.current)h.current=!1;else{const s=r.current&&r.current===`${i.pathname}?${u.toString()}`;if(s||p(!1),m.current!==`${i.pathname}?${u.toString()}`){s||(S.current&&clearTimeout(S.current),S.current=null,w.current&&clearTimeout(w.current),w.current=null,S.current=setTimeout((()=>{p(!0)}),200));const n=(s,n)=>{t(e,s.pathname,n,_.current).then((e=>{const t=`${s.pathname}?${n.toString()}`;if(t===y.current){const{redirect:i,error:c,props:l}=e||{};r.current=i?`${i.location.pathName}?${i.location.query?.toString()}`:"",c?(console.error(c),p(!1)):i?d(r.current):w.current=setTimeout((()=>{S.current&&clearTimeout(S.current),S.current=null,y.current===t&&(l&&_.current.dispatch((0,o.DG)({name:a.j.clientProps,data:l})),p(!1),E({location:s,query:n}))}),50)}}))};n(i,u)}}}),[i,t,e,d,u,p]),{loaded:x}},S=require("lodash/findLast");var w=r.n(S),_=r(6721);const x=e=>{const t=document.getElementById(e);t&&(t.style.removeProperty("transform"),t.style.removeProperty("filter"),t.addEventListener("transitionend",(function(){t.style.removeProperty("overflow"),t.style.removeProperty("will-change"),t.style.removeProperty("transition")}),{once:!0}))},E=e=>{e.forEach(x)},P="__content__";let j=0;const q=(0,l.createContext)((()=>{})),T=(0,l.createContext)((()=>{})),C=(0,l.createContext)({desktop:[],mobile:[]}),R=()=>{const[e,t]=(0,l.useState)([]),r=(0,l.useRef)(e),s=(()=>{const[,e]=(0,l.useReducer)((e=>e+1),0);return e})();r.current=e;const n=(0,l.useCallback)(((e,t)=>{(0,_.gw)(0,(()=>{const s=r.current.filter((r=>t?r.showState||r.id===e:r.showState&&r.id!==e));if(s.length){const e=s.map((e=>e.id)),t=e.slice(0,-1),r=e[e.length-1];[P,...t].reverse().forEach(((e,t)=>((e,t)=>{const r=document.querySelector(`#${e}`);if(r){const e=window.innerHeight,s=(e-t)/e;r.style.overflow="hidden",r.style.willChange="transform",r.style.transition="transform 200ms linear",r.style.transform=`translateY(calc(env(safe-area-inset-top) + ${t/2}px)) scale(${s})`,r.style.filter="blur(0.8px)"}})(e,18+2*t))),E([r])}else E([P])}),"__overlay_back")}),[]);return{overlays:e,open:(0,l.useCallback)((e=>{const a=e,o=r.current,i=w()(o,(e=>e.showState));a.key="__overlay_"+j++,a.id="__overlay_"+j++,a.height=i?i.height-6:92,a.isFirst=!i,a.showState=!0;const c=a.closeHandler,l=a.closeComplete;a.closeHandler=()=>{a.showState=!1,c&&c(),s()},a.closeComplete=()=>{l&&l(),t((e=>{const t=e.filter((e=>e!==a));return t.length&&t.reduce(((e,t)=>e.showState?(t.isFirst=!1,t):t.showState?(t.isFirst=!0,t):void 0)),t}))},a.applyOverlay=n,t((e=>[...e.filter((e=>e.showState)),a]))}),[s,n]),close:(0,l.useCallback)((e=>{const t=r.current,{modalId:s,closeAll:n}=e||{};if(void 0!==s){const e=t.find((e=>e.id===s));e?.closeHandler()}else if(n)t.filter((e=>e.showState)).forEach((e=>e?.closeHandler()));else{const e=w()(t,(e=>e.showState));e?.closeHandler()}}),[])}},A=()=>(0,l.useContext)(q),k=()=>(0,l.useContext)(T),b=()=>(0,l.useContext)(C),L=()=>(0,s.useBreakpointValue)({base:!0,lg:!1}),O=()=>{const[e,t]=(0,l.useState)(!1);return(0,l.useEffect)((()=>{t(!0)}),[]),e},I=(e={})=>{const{height:t=2.5,present:r=0,loading:s}=e,n=(0,l.useRef)(null),a=(0,l.useRef)({present:r,height:t});return(0,l.useEffect)((()=>{s||(a.current.height=t,a.current.present=r)}),[s,t,r]),(0,l.useEffect)((()=>{if(n.current){const e=n.current;if(s){let t,r=2;const s=()=>{r>.33&&(r-=.04);let n=(a.current.present||0)+r;n=n<99.5?n:99.5,e.style.cssText=`height: ${a.current.height}px;transform: scale(${n/100}, 1);filter: drop-shadow(2px 2px 2px rgba(200, 200, 200, .4))`,a.current.present=n,t=requestAnimationFrame(s)};return t=requestAnimationFrame(s),()=>cancelAnimationFrame(t)}return(0,_.gw)(40,(()=>e.style.transform="scale(1)"),"loadingBar").then((()=>(0,_.gw)(80,(()=>e.style.height="0px"),"loadingBar"))),()=>(0,_.al)("loadingBar")}}),[s]),{ref:n}},$=e=>{(0,l.useEffect)((()=>{e()}),[])};var D=r(9034);const N=()=>{const[e,t]=p({height:D.isBrowser?window.innerHeight:0,width:D.isBrowser?window.innerHeight:0});return(0,l.useEffect)((()=>{const e=()=>t({height:window.innerHeight,width:window.innerWidth});return e(),window.addEventListener("resize",e,{passive:!0}),window.removeEventListener("reset",e)}),[t]),e},M=(0,i.createStore)((()=>{const e=(0,i.ref)(0);return{count:e,lock:()=>e.value++,unlock:()=>{e.value--}}})),B=()=>M((e=>e.count)),U=e=>(0,n.CG)((e=>e.client.clientProps.data))[(0,_.zw)(e)],H=e=>(t,r,s)=>{const n=10+Math.floor(s/60),a=n>60?60:n;return{i:r+t,x:Math.floor(t%e),y:Math.floor(t/e),w:1,maxW:e,h:a,minH:10}},F=H(1),W=H(2),G=H(3),J=e=>(0,l.useMemo)((()=>{const t=e.map((({id:e,bodyText:t},r)=>F(r,e,t.length))),r=e.map((({id:e,bodyText:t},r)=>W(r,e,t.length))),s=e.map((({id:e,bodyText:t},r)=>G(r,e,t.length)));return{lg:s,md:s,sm:r,xs:t,xxs:t}}),[e])},3028:(e,t,r)=>{"use strict";r.d(t,{R:()=>s});const s=[{path:"/Blog",componentPath:"Blog"},{path:"/",componentPath:"index"},{path:"/*",componentPath:"404"}]},4236:(e,t,r)=>{"use strict";r.d(t,{J:()=>p});var s=r(5771),n=r.n(s),a=r(6689),o=r(187),i=r(9899),c=r(3028);const l=n()({resolved:{},chunkName:()=>"common-Layout",isReady(e){const t=this.resolve(e);return!0===this.resolved[t]&&!!r.m[t]},importAsync:()=>r.e(497).then(r.bind(r,8645)),requireAsync(e){const t=this.resolve(e);return this.resolved[t]=!1,this.importAsync(e).then((e=>(this.resolved[t]=!0,e)))},requireSync(e){const t=this.resolve(e);return r(t)},resolve:()=>8645},{resolveComponent:e=>(0,i.k)(e.default)}),d={component:l,element:(0,a.createElement)(l)},u=c.R.map((({path:e,componentPath:t})=>o.tE?{path:e,componentPath:t}:e.startsWith("/")?{path:`/MyReact/${e.slice(1)}`,componentPath:t}:{path:`/MyReact/${e}`,componentPath:t})).map((e=>({path:e.path,component:n()({resolved:{},chunkName:()=>`pages-${e.componentPath}`.replace(/[^a-zA-Z0-9_!§$()=\-^°]+/g,"-"),isReady(e){const t=this.resolve(e);return!0===this.resolved[t]&&!!r.m[t]},importAsync:()=>r(5685)(`./${e.componentPath}`),requireAsync(e){const t=this.resolve(e);return this.resolved[t]=!1,this.importAsync(e).then((e=>(this.resolved[t]=!0,e)))},requireSync(e){const t=this.resolve(e);return r(t)},resolve:()=>r(4858).resolve(`./${e.componentPath}`)},{resolveComponent:t=>(0,i.k)(t.default,e.path)})}))).map((({path:e,component:t})=>({path:e,component:t,element:(0,a.createElement)(t)})));d.children=u;const p=[d];"undefined"!=typeof window&&(window.__router__=p)},6721:(e,t,r)=>{"use strict";r.d(t,{al:()=>i,gw:()=>c,G9:()=>g,Mk:()=>p,zw:()=>h});const s={},n={},a={};let o=0;const i=e=>{if(s[e]){const t=s[e].length;s[e]=s[e].map((e=>e&&clearTimeout(e))).slice(t),n[e]=n[e].map((e=>e&&e())).slice(t)}if(o>200){const t=Object.keys(a).sort(((e,t)=>a[e]>a[t]?1:-1));for(const r of t)r===e||n[r].length||(delete a[r],delete s[r],delete n[r],o--)}},c=(e,t,r)=>void 0===r?new Promise((t=>{setTimeout((()=>{t()}),e)})).then((()=>{if(t)return t()})):(r in a?a[r]++:(a[r]=1,s[r]=[],n[r]=[],o++),i(r),new Promise(((t,a)=>{n[r].push(a),s[r].push(setTimeout((()=>{t()}),e))})).then((()=>{if(t)return t()})).catch((()=>{}))),l=require("lodash/merge");var d=r.n(l),u=r(3308);function p(e,t,r,s){const n=(0,u.matchRoutes)(e,t)||[],a=t,o=[];return n.forEach((({route:e,params:t,pathname:n})=>{const i={params:t,pathname:n};o.push(m({route:e,store:s,match:i,query:r,relativePathname:a}))})),Promise.all(o).then((e=>e.length?e.filter(Boolean).reduce(((e,t)=>t?(e.props=d()(e.props,t.props),e.page=(e.page||[]).concat(t.page||[]),e.error=[e.error,t.error].filter(Boolean).join(" || "),e.redirect=t.redirect?t.redirect:e.redirect,e):e),{}):{redirect:{code:301,location:{pathName:"/404"}}}))}const h=e=>`__preload-[${e}]-props__`,m=async({route:e,store:t,match:r,query:s,relativePathname:n})=>{const a=await(async({route:e})=>{const t=[];if(e.getInitialState&&t.push(e.getInitialState),e.component){const r=e.component;if(r.load&&"function"==typeof r.load){const e=r,s=await e.load();if(s.getInitialState&&"function"==typeof s.getInitialState&&t.push(s.getInitialState),void 0!==s.default){const e=s.default;e.getInitialState&&"function"==typeof e.getInitialState&&t.push(e.getInitialState)}}else{const e=r;e.getInitialState&&"function"==typeof e.getInitialState&&t.push(e.getInitialState)}}return t.length?async({store:e,pathName:r,params:s,relativePathname:n,query:a})=>{const o=h(r),i=(await Promise.all(t.map((t=>Promise.resolve().then((()=>t({store:e,pathName:r,params:s,relativePathname:n,query:a}))).catch((e=>(console.error(`[server] getInitialState error ${e.toString()}`),null))))))).filter(Boolean).reduce(((e,t)=>t?(e.error=[e.error,t.error].filter(Boolean).join(" || "),e.props=d()(e.props,t.props),e.redirect=t.redirect?t.redirect:e.redirect,e):e),{});return{...i,props:{[o]:i.props||{}}}}:null})({route:e});if(a){const o=await a({store:t,pathName:r.pathname,params:r.params,relativePathname:n,query:s});return e.path?{...o,page:[e.path]}:o}if(e.path)return{page:[e.path]}};function g(e){return function(t){t.getInitialState=e}}},7802:(e,t,r)=>{"use strict";r.r(t);const s=require("dotenv");var n=r.n(s);const a=require("express");var o=r.n(a),i=r(187);const c=require("fs");var l=r.n(c);const d=require("fs/promises");var u=r.n(d);const p=require("path");var h=r.n(p);class m extends Error{constructor(e,t){super(e),this.code=t}}const g=require("pino"),f=require("pino-pretty");var v=r.n(f);const y=(e,t)=>(0,g.pino)(v()())[t](`[server] ${e}`),S=((...e)=>function(t,r){let s=0,n=-1;return function a(o){if(o<=n)throw new m("compose index error, every middleware only allow call once",500);if(s++,s>e.length+5)throw new m("call middleWare many times, look like a infinite loop and will stop call next",500);n=o;const i=e[o]||r;if(!i)return y("all middleware done, do not call next","warn"),Promise.resolve();try{return Promise.resolve(i(t,(()=>a(o+1))))}catch(e){return y(`compose catch error: ${e.message}`,"error"),Promise.resolve()}}(0)})((async(e,t)=>{const{req:r,res:s,errorHandler:n}=e;try{await t()}catch(t){y(`url: ${r.originalUrl}, method: ${r.method} error, ${t.message}`,"error"),n&&"function"==typeof n?t instanceof m?await n({ctx:e,req:r,res:s,e:t,code:t.code}):t instanceof Error&&await n({ctx:e,req:r,res:s,e:t,code:404}):s.status(t instanceof m?t.code:500).json({data:t.toString()})}}),(async e=>{const{requestHandler:t,req:r,res:s}=e;await t({req:r,res:s})})),w=function(e,t=S){return async(r,s,n)=>{const a={...e,req:r,res:s,next:n};try{await t(a,a.requestHandler)}catch(e){s.status(500).json({data:e.toString()})}}},_={lang:w({requestHandler:async function({req:e,res:t}){const{lang:r}=e.query;if(!r)throw new Error("invalid request");const s=h().resolve(process.cwd(),"lang",`${r}.json`);var n;if(!await(n=s,new Promise((e=>{l().promises.access(n,l().constants.F_OK).then((()=>e(!0))).catch((()=>e(!1)))}))))throw new m("unSupport lang",404);{const e=await(0,d.readFile)(s,{encoding:"utf-8"});t.status(200).json({data:JSON.parse(e)})}}})},x=async(e,t,r)=>{const s=_[e.path.slice(1)];s?await s(e,t,r):t.status(404).json({data:"not found"})},E=(...e)=>t=>e.reduce(((e,t)=>r=>e(t(r))))(t),P=({isSSR:e,isSTATIC:t,isSTREAM:r,isPURE_CSR:s,isMIDDLEWARE:n,isDEVELOPMENT:a,isANIMATE_ROUTER:o,PUBLIC_API_HOST:i})=>c=>async l=>{l.env={isSSR:e||l.req.query.isSSR||!1,isSTREAM:r,isSTATIC:t,isPURE_CSR:s,isDEVELOPMENT:a,isMIDDLEWARE:n,isANIMATE_ROUTER:o,PUBLIC_API_HOST:i,FRAMEWORK:process.env.REACT},await c(l)},j=e=>async t=>{const{env:r}=t;if(!r)throw new m("env 没有初始化",5e3);const{req:s,res:n}=t,a=s.cookies?.site_lang,o=a||i.Fp;n.cookie("site_lang",o),t.lang=o,r.LANG=o,await e(t)},q=e=>async t=>{const r=(0,i.Zj)();t.store=r,await e(t)};var T=r(4236),C=r(6721),R=r(7586),A=r(2412);const k=e=>async t=>{const{req:r,res:s,lang:n,store:a}=t;if(!n||!a)throw new m(`server 初始化失败 lang: ${n}, store: ${a}`,500);const{error:o,redirect:i,page:c,props:l}=await(0,C.Mk)(T.J,r.path,new URLSearchParams(r.url.split("?")[1]),a)||{};if(t.page=c,o)throw new m(o,403);if(i){const e=i.location.query.toString(),t=e.length?i.location.pathName+"?"+e:i.location.pathName;s.writeHead(i.code||302,{location:t}),s.end()}else l&&a.dispatch((0,A.DG)({name:R.j.clientProps,data:l})),await e(t)},b=e=>async t=>{const{store:r,lang:s}=t;if(!r||!s)throw new m("store or lang 初始化失败",500);if(!i.Jy[s])throw new m("不支持的语言",404);await(0,i.i2)(r.dispatch,s),await e(t)},L=require("lodash"),O=e=>h().resolve(process.cwd(),"dist",e),I=e=>h().resolve(O(e),"manifest-deps.json"),$=e=>h().resolve(O(e),"manifest-static.json"),D=(0,L.memoize)((async(e,t=(e=>e))=>t(await u().readFile(e,{encoding:"utf-8"}).then((e=>JSON.parse(e))))),((e,t)=>`${e}/${(t||"empty").toString()}`)),N=(e,t)=>Object.keys(e).filter((t=>e[t].endsWith(".css"))).filter(t).map((t=>e[t])),M=(e,t,r=(()=>0))=>Object.keys(e).filter((t=>e[t].endsWith(".js"))).filter(t).sort(r).map((t=>e[t])),B=e=>async t=>{const{req:r}=t,s=(0,i.Kv)()||r.query.isSSR,n={stylesPath:[],scriptsPath:[],refreshPath:[],preloadScriptsPath:[]},a=await D(("client",h().resolve(O("client"),"manifest-prod.json")));const o=N(a,(e=>e.startsWith("main")||e.startsWith("vendor"))),c=M(a,(e=>e.startsWith("__refresh__"))).map((e=>({path:e,"data-refresh":"@my-react/react-refresh"}))),l=(e=>M(e,(e=>e.startsWith("runtime"))))(a),d=(e=>M(e,(e=>e.startsWith("main")||e.startsWith("vendor")),(e=>e.startsWith("main")?0:-1)))(a);n.stylesPath=o;const u=l.concat(d);if(n.preloadScriptsPath=u,n.scriptsPath=u,n.refreshPath=c,s){const{page:e}=t;if(!e)throw new m("render page 没有初始化",500);const r=await D(I("client"),(e=>Object.keys(e).map((t=>({[t]:e[t].path}))).reduce(((e,t)=>({...e,...t})),{}))),s=((e,t)=>Object.keys(e).filter((e=>t.some((t=>t===e||t===e.slice(1))))).map((t=>e[t])).reduce(((e,t)=>e.concat(t)),[]))(r,e),o=((e,t)=>N(e,(e=>t.includes(e))))(a,s),i=((e,t)=>M(e,(e=>t.includes(e))))(a,s);n.stylesPath=n.stylesPath.concat(o),n.scriptsPath=i.concat(n.scriptsPath),n.preloadScriptsPath=n.preloadScriptsPath.concat(i)}t.assets=n,await e(t)},U=require("@loadable/server"),H=require("react-dom/server");var F=r(6689);const W=e=>e.map(((e,t)=>"string"==typeof e?(0,F.createElement)("script",{key:t,src:e,defer:!0}):(0,F.createElement)("script",{key:t,...Object.keys(e).filter((e=>e.startsWith("data-"))).reduce(((t,r)=>(t[r]=e[r],t)),{}),src:e.path,...Object.keys(e).filter((e=>!e.startsWith("data-")&&"path"!==e)).reduce(((t,r)=>(t[r]=e[r],t)),{})})));let G=function(e){return e.manifest_loadable="manifest-loadable.json",e.manifest_deps="manifest-deps.json",e.manifest_dev="manifest-dev.json",e.manifest_prod="manifest-prod.json",e.manifest_static="manifest-static.json",e}({});const J=e=>h().resolve((e=>h().resolve(process.cwd(),"dist",e))(e),G.manifest_loadable);var V=r(3920),z=r(8930),K=r(2805),Z=r(8638),X=r(6022);const Q=require("react-router-dom/server");var Y=r(9987);const ee=require("react-dom"),te="ITbAOd";let re;const se=(0,F.forwardRef)((function(e,t){return(0,Y.qR)((()=>{re||(re=document.createElement("div")),re.id="__loading_bar__";const e=document.body.querySelector("#__content__");document.body.insertBefore(re,e)})),(0,Y.tm)()?(0,ee.createPortal)((0,V.jsx)("div",{ref:t,className:te,style:{height:"0px",transform:"scale(0, 1)"}}),re):null})),ne=(0,F.memo)(se),ae=()=>{const e=(0,Y.r$)((e=>e.loading)),{ref:t}=(0,Y.Kx)({loading:e});return(0,F.useEffect)((()=>{window.dd=Y.r$}),[]),(0,V.jsx)(ne,{ref:t})};var oe=r(9034),ie=r(3308);const ce=(0,F.createContext)(null),le=({children:e,routes:t,LoadingBar:r})=>{const{loaded:s}=(0,Y.Xw)({routes:t,preLoad:C.Mk});return s?(0,V.jsxs)(ce.Provider,{value:s,children:[(0,V.jsx)(r,{}),e]}):null},de=()=>{const e=(0,F.useContext)(ce),t=(0,ie.useRoutes)(T.J,e?.location);return(0,V.jsx)(V.Fragment,{children:(0,i.AL)()?(0,V.jsx)(oe.AnimatePresence,{exitBeforeEnter:!0,children:(0,V.jsx)(F.Fragment,{children:(0,V.jsx)(oe.motion.div,{initial:"initial",animate:"in",exit:"out",variants:{initial:{opacity:0},in:{opacity:1},out:{opacity:0}},transition:{type:"spring",damping:10,stiffness:50},children:t})},e?.location.pathname)}):t})};var ue=r(9114),pe=r(6544);const he=({children:e})=>{const t=(0,i.CG)((e=>e.client.clientProps.data)),{pathname:r}=(0,ie.useLocation)(),s=t[(0,C.zw)(r)],n=s?.$$__apollo__$$,a=(0,pe.useApollo)(n,!0);return(0,V.jsx)(ue.ApolloProvider,{client:a,children:e})};class me extends F.Component{constructor(...e){super(...e),this.state={stack:"",error:"",hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(e,t){this.setState({error:e.message,stack:t.componentStack})}render(){return this.state.hasError?(0,V.jsxs)("pre",{children:[(0,V.jsx)("p",{style:{color:"red",whiteSpace:"pre-wrap"},children:this.state.error}),this.state.stack]}):this.props.children}}var ge=r(3126);const fe=({children:e})=>{const t=(0,F.useRef)(null),r=(0,i.CG)((e=>e.server.serverLang.data)),s=(0,i.CG)((e=>e.client.clientLang.data));return(0,F.useEffect)((()=>{t.current||(t.current=document.querySelector("html")),t.current&&(t.current.lang=s)}),[s]),(0,V.jsx)(ge.IntlProvider,{locale:s,messages:r[s]||{},defaultLocale:i.Fp,children:e})},ve=()=>(0,V.jsx)(he,{children:(0,V.jsx)(fe,{children:(0,V.jsx)(le,{routes:T.J,LoadingBar:ae,children:(0,V.jsx)(me,{children:(0,V.jsx)(de,{})})})})}),ye=({mode:e})=>async t=>"SSR"===e?await(async({req:e,res:t,store:r,lang:s,env:n,assets:a})=>{const o={},c=(0,i.S9)(),l=(0,z.cookieStorageManagerSSR)(e.headers.cookie||""),d=(0,V.jsx)(K.CacheProvider,{value:c,children:(0,V.jsx)(z.ChakraProvider,{theme:i.rS,colorModeManager:l,children:(0,V.jsx)(X.Provider,{store:r,children:(0,V.jsx)(Q.StaticRouter,{location:e.url,children:(0,V.jsx)(Z.HelmetProvider,{context:o,children:(0,V.jsx)(ve,{})})})})})}),u=new U.ChunkExtractor({statsFile:J("client")}),p=u.collectChunks(d),h=(0,H.renderToString)(p),m=u.getLinkElements(),g=u.getStyleElements(),f=u.getScriptElements(),v=W(a.refreshPath);t.status(200).send("<!doctype html>"+(0,H.renderToString)((0,V.jsx)(i.k9,{lang:s,env:JSON.stringify(n),script:f,helmetContext:o,link:m.concat(g),preloadedState:JSON.stringify(r.getState()),refresh:v,children:h})))})(t):"CSR"===e?await(async({res:e,store:t,lang:r,env:s,assets:n})=>{if(!t||!r||!s)throw new m("server 初始化失败",500);const a=new U.ChunkExtractor({statsFile:J("client")}),o=a.getLinkElements(),c=a.getStyleElements(),l=a.getScriptElements(),d=W(n.refreshPath);e.send("<!doctype html>"+(0,H.renderToString)((0,V.jsx)(i.k9,{lang:r,env:JSON.stringify(s),link:o.concat(c),preloadedState:JSON.stringify(t.getState()),script:l,refresh:d})))})(t):"P_CSR"===e?await(async({res:e,env:t,lang:r,assets:s})=>{if(!t||!r)throw new m("server 初始化失败",500);const n=new U.ChunkExtractor({statsFile:J("client")}),a=n.getLinkElements(),o=n.getStyleElements(),c=n.getScriptElements(),l=W(s.refreshPath);e.send("<!doctype html>"+(0,H.renderToString)((0,V.jsx)(i.k9,{env:JSON.stringify(t),lang:r,link:a.concat(o),script:c,refresh:l})))})(t):"StreamSSR"===e?await(async({req:e,res:t,store:r,lang:s,env:n})=>{const a={},o=(0,i.S9)(),c=(0,z.cookieStorageManagerSSR)(e.headers.cookie||""),l=(0,V.jsx)(K.CacheProvider,{value:o,children:(0,V.jsx)(z.ChakraProvider,{theme:i.rS,colorModeManager:c,children:(0,V.jsx)(X.Provider,{store:r,children:(0,V.jsx)(Q.StaticRouter,{location:e.url,children:(0,V.jsx)(Z.HelmetProvider,{context:a,children:(0,V.jsx)(ve,{})})})})})}),d=new U.ChunkExtractor({statsFile:J("client")}),u=d.collectChunks(l),p=(0,H.renderToString)(u),h=d.getLinkElements(),m=d.getStyleElements(),g=d.getScriptElements(),f=(0,V.jsx)(i.k9,{lang:s,env:JSON.stringify(n),script:g,helmetContext:a,link:h.concat(m),preloadedState:JSON.stringify(r.getState()),children:p});(0,H.renderToNodeStream)(f).pipe(t)})(t):void 0,Se=E(P({isSSR:!0,isSTATIC:(0,i.f2)(),isPURE_CSR:!1,isMIDDLEWARE:(0,i.To)(),isDEVELOPMENT:!1,isANIMATE_ROUTER:(0,i.AL)(),PUBLIC_API_HOST:process.env.PUBLIC_PROD_API_HOST}),j,q,k,b,B)((async e=>{const t=ye({mode:"SSR"});await t(e)})),we=E(P({isSSR:!1,isSTATIC:!1,isPURE_CSR:!1,isDEVELOPMENT:!1,isMIDDLEWARE:(0,i.To)(),isANIMATE_ROUTER:(0,i.AL)(),PUBLIC_API_HOST:process.env.PUBLIC_PROD_API_HOST}),j,q,k,b,B)((async e=>{const t=ye({mode:"CSR"});await t(e)})),_e=(E(P({isSSR:!1,isSTATIC:!1,isPURE_CSR:!0,isMIDDLEWARE:(0,i.To)(),isDEVELOPMENT:!1,isANIMATE_ROUTER:(0,i.AL)(),PUBLIC_API_HOST:process.env.PUBLIC_PROD_API_HOST}),j,B)((async e=>{const t=ye({mode:"P_CSR"});await t(e)})),E(P({isSSR:!0,isSTREAM:!0,isSTATIC:(0,i.f2)(),isPURE_CSR:!1,isMIDDLEWARE:(0,i.To)(),isDEVELOPMENT:!1,isANIMATE_ROUTER:(0,i.AL)(),PUBLIC_API_HOST:process.env.PUBLIC_PROD_API_HOST}),j,q,k,b,B)((async e=>{const t=ye({mode:"StreamSSR"});await t(e)}))),xe=async({req:e,res:t})=>{const{isSSR:r}=e.query;r||(0,i.Kv)()?(0,i.Xv)()?await _e({req:e,res:t}):await Se({req:e,res:t}):await we({req:e,res:t})},Ee=require("http");var Pe=r.n(Ee);const je=require("stream/promises"),qe=e=>h().resolve(process.cwd(),"dist",e),Te=e=>{const t=e.p.slice(1),r="/"===t?"index.html":`${t.slice(1)}.html`;return{...e,fileName:r}},Ce=async(e,t)=>{if((await u().stat(e)).isDirectory()){const r=await u().readdir(e,{withFileTypes:!0});for(let s=0;s<r.length;s++){const n=r[s];n.isFile()&&await ke(h().resolve(e,n.name),h().resolve(t,n.name)),n.isDirectory()&&await Ce(h().resolve(e,n.name),h().resolve(t,n.name))}}else await ke(h().resolve(e),h().resolve(t,h().basename(e)))},Re=e=>u().mkdir(h().dirname(e),{recursive:!0}).catch(),Ae=(e,t)=>u().writeFile(e,t),ke=async(e,t)=>{await Re(t),await(0,je.pipeline)((0,c.createReadStream)(e),(0,c.createWriteStream)(t))};let be=()=>w({requestHandler:xe,errorHandler:({req:e,res:t,code:r,e:s})=>(({res:e,code:t,e:r})=>{let s=r.stack||r.message;return s=s.replace(/`/g,"\\`"),e.send("<!doctype html>"+(0,H.renderToString)((0,V.jsx)(i.k9,{children:`<h1>server render error!</h1>\n            <hr />\n            <div style='padding-left: 10px; font-size: 20px;'>\n              error code:\n              <b>${t}</b>\n              <br />\n              <br />\n              <pre style='font-size: 18px; color: red;'>${r.message}</pre>\n            </div>\n          <script>console.error(\`${s}\`)<\/script>`})))})({req:e,res:t,e:s,code:r})});n().config(),(async()=>{const e=o()();e.use(o().static(`${process.cwd()}/public`)),e.use(o().static(`${process.cwd()}/dist`)),(e=>{e.use((async(e,t,r)=>{const s=await D($("client")).catch((()=>null)),n=s?.[`.${e.path}`];if(n){const e=l().createReadStream(n);t.setHeader("content-type","text/html"),e.pipe(t)}else r()}))})(e),(e=>{e.use("/api",x)})(e),await(async e=>{await new Promise((e=>{e()}))})(),e.use((async(e,t,r)=>{const s=await be();await s(e,t,r)}));const t=process.env.PROD_PORT;e.listen(t,(()=>{(0,i.f2)()?(y("start static page generate, base on current router","info"),(async()=>{const e=(r=await D(I("client"),(e=>Object.keys(e).map((t=>({[t]:e[t].static}))).reduce(((e,t)=>({...e,...t})),{}))),Object.keys(r).filter((e=>r[e])).map((e=>({url:`http://${process.env.PROD_HOST}:${process.env.PROD_PORT}/MyReact${e.slice(1)}`,p:e})))),t=(await Promise.all(e.map((e=>(e=>new Promise((t=>{Pe().get(e.url,(r=>{const{statusCode:s}=r;if(200===s){r.setEncoding("utf-8");let s="";r.on("data",(e=>s+=e)),r.on("end",(()=>t({rawData:s,pathConfig:e}))),r.on("error",(r=>t({error:r,pathConfig:e})))}else t({pathConfig:e,error:new Error("500 error")})})).on("error",(r=>t({pathConfig:e,error:r})))})))(e))))).filter((e=>e.rawData)).map((e=>({...e,pathConfig:{...e.pathConfig,...Te(e.pathConfig)}}))).map((e=>{return{...e,pathConfig:{...e.pathConfig,filePath:(t=e.pathConfig.fileName,h().resolve(process.cwd(),"dist","pages",t)),ghPagePath:qe(e.pathConfig.fileName)}};var t}));var r;await Ce((0,p.resolve)(process.cwd(),"public"),(0,p.resolve)(process.cwd(),"dist"));const s=await Promise.all(t.map((e=>Re(e.pathConfig.filePath).then((()=>Ae(e.pathConfig.ghPagePath,e.rawData).catch((e=>console.log(e))))).then((()=>Ae(e.pathConfig.filePath,e.rawData).then((()=>({config:e,state:!0}))).catch((()=>({config:e,state:!1}))))))));await Ae($("client"),JSON.stringify(s.filter((e=>e.state)).map((e=>({[e.config.pathConfig.p]:e.config.pathConfig.filePath}))).reduce(((e,t)=>({...e,...t})),{})))})().then((()=>{process.exit(0)}))):y(`app is running, open http://localhost:${t}`,"info")}))})()},187:(e,t,r)=>{"use strict";r.d(t,{k9:()=>$,S9:()=>M,Zj:()=>R,Fp:()=>v,AL:()=>c,To:()=>a,uf:()=>l,Kv:()=>o,f2:()=>d,Xv:()=>i,g_:()=>u,i2:()=>f,tE:()=>p,Jy:()=>g,rS:()=>b,CG:()=>A});const s=require("lodash/memoize");var n=r.n(s);const a=n()((()=>JSON.parse(process.env.MIDDLEWARE||"false"))),o=n()((()=>JSON.parse(process.env.SSR||"false"))),i=n()((()=>JSON.parse(process.env.STREAM||"false"))),c=n()((()=>JSON.parse(process.env.ANIMATE_ROUTER||"false"))),l=n()((()=>!1)),d=n()((()=>JSON.parse(process.env.STATIC_GENERATE||"false")&&!0)),u=n()((()=>process.env.PUBLIC_PROD_API_HOST)),p=!1;var h=r(7586),m=r(2412);const g={en:"English",zh:"中文"},f=async(e,t)=>{await e((0,m.pW)({name:h.V.serverLang,lang:t}))},v="en";var y=r(6022),S=r(6695);const w=require("redux-saga");var _=r.n(w);const x=require("redux-thunk");var E=r.n(x);const P=require("redux-saga/effects"),j=require("project-tool/request");function*q(){yield(0,P.all)([(0,P.takeLatest)(m.JO.GET_DATA_ACTION(h.V.serverLang),(({done:e,lang:t})=>function*({done:e,lang:t}){try{if(!(yield(0,P.select)((e=>e.server.serverLang.data)))[t]){yield(0,P.put)((0,m.N7)({name:h.V.serverLang}));const e=(0,j.createRequest)({baseURL:u()}),{data:{data:r}}=yield(0,P.call)((r=>e.get(r,{params:{lang:t}})),"/api/lang");yield(0,P.put)((0,m.VZ)({name:h.V.serverLang,data:{[t]:r}}))}yield(0,P.put)((0,m.DG)({name:h.j.clientLang,data:t}))}catch(e){yield(0,P.put)((0,m.n$)({name:h.V.serverLang,error:e.toString()}))}finally{e()}}({done:e,lang:t})))])}const T={startSagas:(e,t)=>t.run(e),cancelSagas(e){e.dispatch({type:"@CANCEL_SAGAS_HMR"})}},C=S.compose,R=(e={})=>{const{preloadedState:t,middleware:r=[]}=e,s=_()(),n=[E(),s,...r],a=(0,S.legacy_createStore)(m.QW,t,C((0,S.applyMiddleware)(...n)));return a.sagaTask=T.startSagas(q,s),a},A=y.useSelector;var k=r(8930);const b=(0,k.extendTheme)({styles:{global:{body:{fontFamily:"ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,\n      Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"}}},semanticTokens:{colors:{mobileCardBackgroundColor:{default:"white",_dark:"gray.700"},cardBackgroundColor:{default:"whiteAlpha.500",_dark:"blackAlpha.600"},mobileModalColor:{default:"rgb(220, 220, 220)",_dark:"gray.700"},cardBorderColor:{default:"gray.300",_dark:"gray.600"},lightTextColor:{default:"gray.600",_dark:"gray.400"},siteBackgroundColor:{default:"rgba(250, 250, 250, 0.8)",_dark:"rgba(24, 24, 24, 0.2)"},bannerBackgroundColor:{default:"rgb(255, 255, 255)",_dark:"#1A202C"}}}});var L=r(3920);const O=({children:e,script:t=[],refresh:r=[]})=>(0,L.jsxs)("body",{children:[(0,L.jsx)(k.ColorModeScript,{type:"cookie"}),"string"==typeof e?(0,L.jsx)("div",{id:"__content__",dangerouslySetInnerHTML:{__html:e||""}}):(0,L.jsx)("div",{id:"__content__",children:e}),t.filter(Boolean).map((e=>e)),r.filter(Boolean).map((e=>e))]}),I=({env:e="{}",link:t=[],preLoad:r=[],preloadedState:s="{}",helmetContext:{helmet:n}={},emotionChunks:a})=>(0,L.jsxs)("head",{children:[(0,L.jsx)("meta",{charSet:"utf-8"}),(0,L.jsx)("meta",{name:"build-time",content:"7/24/2023, 11:32:19 AM"}),(0,L.jsx)("meta",{name:"power-by",content:"@my-react ꒰ঌ( ⌯' '⌯)໒꒱"}),(0,L.jsx)("meta",{name:"author",content:"MrWangJustToDo"}),(0,L.jsx)("meta",{name:"description",content:"@my-react is a React like package, it can be used to build a modern website just like this, feel free to use and fire a issue if you have! link: https://github.com/MrWangJustToDo/MyReact"}),(0,L.jsx)("meta",{name:"keywords",content:"react, react-dom, ssr, csr, ssg"}),(0,L.jsx)("base",{href:p?"/":"/MyReact/"}),(0,L.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"}),(0,L.jsx)("link",{rel:"shortcut icon",href:"./favicon.ico",type:"image/x-icon"}),(0,L.jsxs)(L.Fragment,{children:[n?.base.toComponent(),n?.title.toComponent(),n?.meta.toComponent(),n?.link.toComponent(),n?.noscript.toComponent(),n?.style.toComponent(),n?.script.toComponent()]}),r.filter(Boolean).map((e=>e)),t.filter(Boolean).map((e=>e)),a?.styles.map(((e,t)=>(0,L.jsx)("style",{"data-server":!0,"data-emotion":`${e.key} ${e.ids.join(" ")}`,dangerouslySetInnerHTML:{__html:e.css}},e.key+"_"+t))),(0,L.jsx)("script",{id:"__preload_env__",type:"application/json",dangerouslySetInnerHTML:{__html:`${e}`}}),(0,L.jsx)("script",{id:"__preload_state__",type:"application/json",dangerouslySetInnerHTML:{__html:`${s}`}})]}),$=e=>(0,L.jsxs)("html",{lang:e.lang||"",children:[(0,L.jsx)(I,{...e}),(0,L.jsx)(O,{...e})]}),D=require("@emotion/cache");var N=r.n(D);const M=()=>N()({key:"css"})},7586:(e,t,r)=>{"use strict";r.d(t,{V:()=>n,j:()=>s});let s=function(e){return e.clientLang="clientLang",e.clientProps="clientProps",e}({}),n=function(e){return e.serverLang="serverLang",e}({})},2412:(e,t,r)=>{"use strict";r.d(t,{pW:()=>f,n$:()=>S,N7:()=>v,VZ:()=>y,QW:()=>E,JO:()=>g,DG:()=>l});var s=r(6695),n=r(7586);const a=require("immer"),o=e=>`@client_action_${e}_loading`,i=e=>`@client_action_${e}_success`,c=e=>`@client_action_${e}_fail`,l=({name:e,data:t})=>({type:i(e),data:t,loadingState:!1}),d={data:"",error:null,loaded:!1,loading:!1},u={[o(n.j.clientLang)]:(e,t)=>(0,a.produce)(e,(e=>{e.data="",e.error=null,e.loading=t.loadingState||!0,e.loaded=!1})),[i(n.j.clientLang)]:(e,t)=>(0,a.produce)(e,(e=>{e.data=t.data||"",e.error=null,e.loading=!1,e.loaded=!0})),[c(n.j.clientLang)]:(e,t)=>(0,a.produce)(e,(e=>{e.data="",e.error=t.error,e.loading=!1,e.loaded=!0}))},p={data:{},error:null,loaded:!1,loading:!1},h={[o(n.j.clientProps)]:(e,t)=>(0,a.produce)(e,(e=>{e.error=null,e.loading=t.loadingState||!0,e.loaded=!1})),[i(n.j.clientProps)]:(e,t)=>(0,a.produce)(e,(e=>{e.data=t.data,e.error=null,e.loading=!1,e.loaded=!0})),[c(n.j.clientProps)]:(e,t)=>(0,a.produce)(e,(e=>{e.data={},e.error=t.error,e.loading=!1,e.loaded=!0}))},m=(0,s.combineReducers)({[n.j.clientLang]:(e=d,t)=>{const r=u[t.type];return r?r(e,t):e},[n.j.clientProps]:(e=p,t)=>{const r=h[t.type];return r?r(e,t):e}}),g={GET_DATA_ACTION:e=>`@server_action_${e}_startWithSaga`,GET_DATA_LOADING:e=>`@server_action_${e}_loading`,GET_DATA_SUCCESS:e=>`@server_action_${e}_success`,GET_DATA_FAIL:e=>`@server_action_${e}_fail`},f=({name:e,...t})=>r=>{let s=null;const n=new Promise((e=>{s=e}));return r({type:g.GET_DATA_ACTION(e),done:s,...t}),n},v=({name:e})=>({type:g.GET_DATA_LOADING(e),loadingState:!0}),y=({name:e,data:t})=>({type:g.GET_DATA_SUCCESS(e),data:t,loadingState:!1}),S=({name:e,error:t})=>({type:g.GET_DATA_FAIL(e),error:t,loadingState:!1}),w={data:{},error:null,loaded:!1,loading:!1},_={[g.GET_DATA_LOADING(n.V.serverLang)]:(e,t)=>(0,a.produce)(e,(e=>{e.error=null,e.loading=t.loadingState||!0,e.loaded=!1})),[g.GET_DATA_SUCCESS(n.V.serverLang)]:(e,t)=>(0,a.produce)(e,(e=>{e.data={...e.data,...t.data},e.error=null,e.loading=!1,e.loaded=!0})),[g.GET_DATA_FAIL(n.V.serverLang)]:(e,t)=>(0,a.produce)(e,(e=>{e.error=t.error,e.loading=!1,e.loaded=!0}))},x=(0,s.combineReducers)({[n.V.serverLang]:(e=w,t)=>{const r=_[t.type];return r?r(e,t):e}}),E=(0,s.combineReducers)({client:m,server:x})},5685:(e,t,r)=>{var s={"./":[9105,378,617],"./404":[1230,751],"./404.tsx":[1230,751],"./Blog":[8844,378,587],"./Blog.tsx":[8844,378,587],"./index":[9105,378,617],"./index.tsx":[9105,378,617]};function n(e){if(!r.o(s,e))return Promise.resolve().then((()=>{var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}));var t=s[e],n=t[0];return Promise.all(t.slice(1).map(r.e)).then((()=>r(n)))}n.keys=()=>Object.keys(s),n.id=5685,e.exports=n},4858:(e,t,r)=>{var s={"./":9105,"./404":1230,"./404.tsx":1230,"./Blog":8844,"./Blog.tsx":8844,"./index":9105,"./index.tsx":9105};function n(e){var t=a(e);if(!r.m[t]){var s=new Error("Module '"+e+"' ('"+t+"') is not available (weak dependency)");throw s.code="MODULE_NOT_FOUND",s}return r(t)}function a(e){if(!r.o(s,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return s[e]}n.keys=function(){return Object.keys(s)},n.resolve=a,n.id=4858,e.exports=n},9114:e=>{"use strict";e.exports=require("@apollo/client")},8930:e=>{"use strict";e.exports=require("@chakra-ui/react")},2805:e=>{"use strict";e.exports=require("@emotion/react")},5771:e=>{"use strict";e.exports=require("@loadable/component")},7496:e=>{"use strict";e.exports=require("@my-react/react")},4554:e=>{"use strict";e.exports=require("@my-react/react-dom")},3920:e=>{"use strict";e.exports=require("@my-react/react-jsx/jsx-runtime")},322:e=>{"use strict";e.exports=require("@my-react/react-reactive")},6544:e=>{"use strict";e.exports=require("@site/graphql")},1635:e=>{"use strict";e.exports=require("dayjs")},5468:e=>{"use strict";e.exports=require("dayjs/locale/zh-cn")},8073:e=>{"use strict";e.exports=require("dayjs/plugin/calendar")},4195:e=>{"use strict";e.exports=require("dayjs/plugin/relativeTime")},9034:e=>{"use strict";e.exports=require("framer-motion")},2145:e=>{"use strict";e.exports=require("highlight.js/lib/core")},6780:e=>{"use strict";e.exports=require("highlight.js/lib/languages/bash")},9169:e=>{"use strict";e.exports=require("highlight.js/lib/languages/css")},2767:e=>{"use strict";e.exports=require("highlight.js/lib/languages/java")},7985:e=>{"use strict";e.exports=require("highlight.js/lib/languages/javascript")},5356:e=>{"use strict";e.exports=require("highlight.js/lib/languages/json")},2067:e=>{"use strict";e.exports=require("highlight.js/lib/languages/less")},1570:e=>{"use strict";e.exports=require("highlight.js/lib/languages/markdown")},2441:e=>{"use strict";e.exports=require("highlight.js/lib/languages/scss")},1927:e=>{"use strict";e.exports=require("highlight.js/lib/languages/shell")},5519:e=>{"use strict";e.exports=require("highlight.js/lib/languages/sql")},373:e=>{"use strict";e.exports=require("highlight.js/lib/languages/typescript")},9372:e=>{"use strict";e.exports=require("highlight.js/lib/languages/xml")},2631:e=>{"use strict";e.exports=require("lodash/once")},1381:e=>{"use strict";e.exports=require("lodash/throttle")},9653:e=>{"use strict";e.exports=require("markdown-it")},6689:e=>{"use strict";e.exports=require("react")},1050:e=>{"use strict";e.exports=require("react-grid-layout")},8638:e=>{"use strict";e.exports=require("react-helmet-async")},9847:e=>{"use strict";e.exports=require("react-icons/ai")},6290:e=>{"use strict";e.exports=require("react-icons/fa")},4041:e=>{"use strict";e.exports=require("react-icons/md")},764:e=>{"use strict";e.exports=require("react-icons/si")},382:e=>{"use strict";e.exports=require("react-icons/vsc")},3126:e=>{"use strict";e.exports=require("react-intl")},6022:e=>{"use strict";e.exports=require("react-redux")},1520:e=>{"use strict";e.exports=require("react-remove-scroll")},3308:e=>{"use strict";e.exports=require("react-router")},4661:e=>{"use strict";e.exports=require("react-router-dom")},6695:e=>{"use strict";e.exports=require("redux")},7739:e=>{"use strict";e.exports=require("use-pinch-ref")}},r={};function s(e){var n=r[e];if(void 0!==n)return n.exports;var a=r[e]={id:e,loaded:!1,exports:{}};return t[e].call(a.exports,a,a.exports,s),a.loaded=!0,a.exports}s.m=t,s.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return s.d(t,{a:t}),t},s.d=(e,t)=>{for(var r in t)s.o(t,r)&&!s.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},s.f={},s.e=e=>Promise.all(Object.keys(s.f).reduce(((t,r)=>(s.f[r](e,t),t)),[])),s.u=e=>(({497:"common-Layout",587:"pages-Blog",617:"pages-",751:"pages-404"}[e]||e)+"-"+{378:"6d71cfd70f09e95f4f2c",497:"40e0505444a4fe49d126",587:"c0ce9de2d0a93396071f",617:"f8dde8f4025a6e4b8e91",751:"865fcdb867f55c39e435"}[e]+".js"),s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),s.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),e={179:1},s.f.require=(t,r)=>{e[t]||(t=>{var r=t.modules,n=t.ids,a=t.runtime;for(var o in r)s.o(r,o)&&(s.m[o]=r[o]);a&&a(s);for(var i=0;i<n.length;i++)e[n[i]]=1})(require("./"+s.u(t)))};var n=s(7802);module.exports=n})();