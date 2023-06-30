(()=>{var e,t={4946:(e,t,r)=>{"use strict";r.d(t,{k:()=>o});var n=r(6689),s=r(9377),a=r(3920);const o=(e,t="/")=>{const r=(0,n.memo)(e);return()=>{const e=(0,s.dT)(t);return(0,a.jsx)(r,{...e})}}},9377:(e,t,r)=>{"use strict";r.d(t,{XY:()=>C,Nq:()=>P,hZ:()=>q,hV:()=>m,qR:()=>$,dT:()=>U,X0:()=>V,dD:()=>L,tm:()=>O,r$:()=>c,Kx:()=>I,UE:()=>B,tl:()=>k,rC:()=>b,Jv:()=>A,Zb:()=>R,Xw:()=>y,iP:()=>N});var n=r(8930),s=r(7692),a=r(4484),o=r(57);const i=require("reactivity-store"),c=(0,i.createState)((0,i.withActions)((()=>({loading:!1})),{generateActions:e=>({setLoading:t=>{e.loading=t}})}));var l=r(6689);const u=require("lodash/debounce");var d=r.n(u);const p=(e,t=200)=>{const[r,n]=(0,l.useState)(e);return[r,(0,l.useMemo)((()=>d()(n,t)),[t])]},h={width:0,height:0,left:0,right:0,top:0,bottom:0,x:0,y:0};function m({ref:e,cssSelector:t}){const[r,n]=p(h,100);return(0,l.useEffect)((()=>{const r=e?e.current:t?document.querySelector(t):null;if(r){if(window.ResizeObserver){const e=new ResizeObserver((()=>{n(r.getBoundingClientRect())}));return e.observe(r),()=>e.disconnect()}{const e=()=>n(r.getBoundingClientRect());return e(),window.addEventListener("resize",e,{passive:!0}),()=>window.removeEventListener("resize",e)}}}),[e,t,n]),r}var g=r(6022),f=r(3308),v=r(4661);const y=({routes:e,preLoad:t})=>{const r=(0,l.useRef)(),n=(0,g.useStore)(),i=(0,f.useLocation)(),u=(0,f.useNavigate)(),[d]=(0,v.useSearchParams)(),p=c((e=>e.setLoading)),h=(0,l.useRef)(!!(0,s.uf)()),m=(0,l.useRef)(""),y=(0,l.useRef)(""),S=(0,l.useRef)(null),w=(0,l.useRef)(null),x=(0,l.useRef)(n),[_,E]=(0,l.useState)((0,s.uf)()?void 0:{location:i,query:d});return y.current=`${i.pathname}?${d.toString()}`,m.current=_?`${_.location.pathname}?${_.query.toString()}`:"",x.current=n,(0,l.useEffect)((()=>{if(h.current)h.current=!1;else{const n=r.current&&r.current===`${i.pathname}?${d.toString()}`;if(n||p(!1),m.current!==`${i.pathname}?${d.toString()}`){n||(S.current&&clearTimeout(S.current),S.current=null,w.current&&clearTimeout(w.current),w.current=null,S.current=setTimeout((()=>{p(!0)}),200));const s=(n,s)=>{t(e,n.pathname,s,x.current).then((e=>{const t=`${n.pathname}?${s.toString()}`;if(t===y.current){const{redirect:i,error:c,props:l}=e||{};r.current=i?`${i.location.pathName}?${i.location.query?.toString()}`:"",c?(console.error(c),p(!1)):i?u(r.current):w.current=setTimeout((()=>{S.current&&clearTimeout(S.current),S.current=null,y.current===t&&(l&&x.current.dispatch((0,o.DG)({name:a.j.clientProps,data:l})),p(!1),E({location:n,query:s}))}),50)}}))};s(i,d)}}}),[i,t,e,u,d,p]),{loaded:_}},S=require("lodash/findLast");var w=r.n(S),x=r(748);const _=e=>{const t=document.getElementById(e);t&&(t.style.removeProperty("transform"),t.style.removeProperty("filter"),t.addEventListener("transitionend",(function(){t.style.removeProperty("overflow"),t.style.removeProperty("will-change"),t.style.removeProperty("transition")}),{once:!0}))},E=e=>{e.forEach(_)},T="__content__";let j=0;const q=(0,l.createContext)((()=>{})),P=(0,l.createContext)((()=>{})),C=(0,l.createContext)({desktop:[],mobile:[]}),R=()=>{const[e,t]=(0,l.useState)([]),r=(0,l.useRef)(e),n=(()=>{const[,e]=(0,l.useReducer)((e=>e+1),0);return e})();r.current=e;const s=(0,l.useCallback)(((e,t)=>{(0,x.gw)(0,(()=>{const n=r.current.filter((r=>t?r.showState||r.id===e:r.showState&&r.id!==e));if(n.length){const e=n.map((e=>e.id)),t=e.slice(0,-1),r=e[e.length-1];[T,...t].reverse().forEach(((e,t)=>((e,t)=>{const r=document.querySelector(`#${e}`);if(r){const e=window.innerHeight,n=(e-t)/e;r.style.overflow="hidden",r.style.willChange="transform",r.style.transition="transform 200ms linear",r.style.transform=`translateY(calc(env(safe-area-inset-top) + ${t/2}px)) scale(${n})`,r.style.filter="blur(0.8px)"}})(e,18+2*t))),E([r])}else E([T])}),"__overlay_back")}),[]);return{overlays:e,open:(0,l.useCallback)((e=>{const a=e,o=r.current,i=w()(o,(e=>e.showState));a.key="__overlay_"+j++,a.id="__overlay_"+j++,a.height=i?i.height-6:92,a.isFirst=!i,a.showState=!0;const c=a.closeHandler,l=a.closeComplete;a.closeHandler=()=>{a.showState=!1,c&&c(),n()},a.closeComplete=()=>{l&&l(),t((e=>{const t=e.filter((e=>e!==a));return t.length&&t.reduce(((e,t)=>e.showState?(t.isFirst=!1,t):t.showState?(t.isFirst=!0,t):void 0)),t}))},a.applyOverlay=s,t((e=>[...e.filter((e=>e.showState)),a]))}),[n,s]),close:(0,l.useCallback)((e=>{const t=r.current,{modalId:n,closeAll:s}=e||{};if(void 0!==n){const e=t.find((e=>e.id===n));e?.closeHandler()}else if(s)t.filter((e=>e.showState)).forEach((e=>e?.closeHandler()));else{const e=w()(t,(e=>e.showState));e?.closeHandler()}}),[])}},A=()=>(0,l.useContext)(q),b=()=>(0,l.useContext)(P),k=()=>(0,l.useContext)(C),L=()=>(0,n.useBreakpointValue)({base:!0,lg:!1}),O=()=>{const[e,t]=(0,l.useState)(!1);return(0,l.useEffect)((()=>{t(!0)}),[]),e},I=(e={})=>{const{height:t=2.5,present:r=0,loading:n}=e,s=(0,l.useRef)(null),a=(0,l.useRef)({present:r,height:t});return(0,l.useEffect)((()=>{n||(a.current.height=t,a.current.present=r)}),[n,t,r]),(0,l.useEffect)((()=>{if(s.current){const e=s.current;if(n){let t,r=2;const n=()=>{r>.33&&(r-=.04);let s=(a.current.present||0)+r;s=s<99.5?s:99.5,e.style.cssText=`height: ${a.current.height}px;transform: scale(${s/100}, 1);filter: drop-shadow(2px 2px 2px rgba(200, 200, 200, .4))`,a.current.present=s,t=requestAnimationFrame(n)};return t=requestAnimationFrame(n),()=>cancelAnimationFrame(t)}return(0,x.gw)(40,(()=>e.style.transform="scale(1)"),"loadingBar").then((()=>(0,x.gw)(80,(()=>e.style.height="0px"),"loadingBar"))),()=>(0,x.al)("loadingBar")}}),[n]),{ref:s}},$=e=>{(0,l.useEffect)((()=>{e()}),[])};var D=r(9034);const N=()=>{const[e,t]=p({height:D.isBrowser?window.innerHeight:0,width:D.isBrowser?window.innerHeight:0});return(0,l.useEffect)((()=>{const e=()=>t({height:window.innerHeight,width:window.innerWidth});return e(),window.addEventListener("resize",e,{passive:!0}),window.removeEventListener("reset",e)}),[t]),e},M=(0,i.createStore)((()=>{const e=(0,i.ref)(0);return{count:e,lock:()=>e.value++,unlock:()=>{e.value--}}})),B=()=>M((e=>e.count)),U=e=>(0,s.CG)((e=>e.client.clientProps.data))[(0,x.zw)(e)],H=e=>(t,r,n)=>{const s=10+Math.floor(n/60),a=s>60?60:s;return{i:r+t,x:Math.floor(t%e),y:Math.floor(t/e),w:1,maxW:e,h:a,minH:10}},F=H(1),G=H(2),J=H(3),V=e=>(0,l.useMemo)((()=>{const t=e.map((({id:e,bodyText:t},r)=>F(r,e,t.length))),r=e.map((({id:e,bodyText:t},r)=>G(r,e,t.length))),n=e.map((({id:e,bodyText:t},r)=>J(r,e,t.length)));return{lg:n,md:n,sm:r,xs:t,xxs:t}}),[e])},7577:(e,t,r)=>{"use strict";r.d(t,{R:()=>n});const n=[{path:"/Blog",componentPath:"Blog"},{path:"/",componentPath:"index"},{path:"/*",componentPath:"404"}]},2778:(e,t,r)=>{"use strict";r.d(t,{J:()=>p});var n=r(5771),s=r.n(n),a=r(6689),o=r(7692),i=r(4946),c=r(7577);const l=s()({resolved:{},chunkName:()=>"common-Layout",isReady(e){var t=this.resolve(e);return!0===this.resolved[t]&&!!r.m[t]},importAsync:()=>r.e(497).then(r.bind(r,9379)),requireAsync(e){var t=this,r=this.resolve(e);return this.resolved[r]=!1,this.importAsync(e).then((function(e){return t.resolved[r]=!0,e}))},requireSync(e){var t=this.resolve(e);return r(t)},resolve:()=>9379},{resolveComponent:e=>(0,i.k)(e.default)}),u={component:l,element:(0,a.createElement)(l)},d=c.R.map((({path:e,componentPath:t})=>o.tE?{path:e,componentPath:t}:e.startsWith("/")?{path:`/MyReact/${e.slice(1)}`,componentPath:t}:{path:`/MyReact/${e}`,componentPath:t})).map((e=>({path:e.path,component:s()({resolved:{},chunkName:()=>`pages-${e.componentPath}`.replace(/[^a-zA-Z0-9_!§$()=\-^°]+/g,"-"),isReady(e){var t=this.resolve(e);return!0===this.resolved[t]&&!!r.m[t]},importAsync:()=>r(5685)(`./${e.componentPath}`),requireAsync(e){var t=this,r=this.resolve(e);return this.resolved[r]=!1,this.importAsync(e).then((function(e){return t.resolved[r]=!0,e}))},requireSync(e){var t=this.resolve(e);return r(t)},resolve:()=>r(4858).resolve(`./${e.componentPath}`)},{resolveComponent:t=>(0,i.k)(t.default,e.path)})}))).map((({path:e,component:t})=>({path:e,component:t,element:(0,a.createElement)(t)})));u.children=d;const p=[u];"undefined"!=typeof window&&(window.__router__=p)},748:(e,t,r)=>{"use strict";r.d(t,{al:()=>i,gw:()=>c,G9:()=>g,Mk:()=>p,zw:()=>h});const n={},s={},a={};let o=0;const i=e=>{if(n[e]){const t=n[e].length;n[e]=n[e].map((e=>e&&clearTimeout(e))).slice(t),s[e]=s[e].map((e=>e&&e())).slice(t)}if(o>200){const t=Object.keys(a).sort(((e,t)=>a[e]>a[t]?1:-1));for(const r of t)r===e||s[r].length||(delete a[r],delete n[r],delete s[r],o--)}},c=(e,t,r)=>void 0===r?new Promise((t=>{setTimeout((()=>{t()}),e)})).then((()=>{if(t)return t()})):(r in a?a[r]++:(a[r]=1,n[r]=[],s[r]=[],o++),i(r),new Promise(((t,a)=>{s[r].push(a),n[r].push(setTimeout((()=>{t()}),e))})).then((()=>{if(t)return t()})).catch((()=>{}))),l=require("lodash/merge");var u=r.n(l),d=r(3308);function p(e,t,r,n){const s=(0,d.matchRoutes)(e,t)||[],a=t,o=[];return s.forEach((({route:e,params:t,pathname:s})=>{const i={params:t,pathname:s};o.push(m({route:e,store:n,match:i,query:r,relativePathname:a}))})),Promise.all(o).then((e=>e.length?e.filter(Boolean).reduce(((e,t)=>t?(e.props=u()(e.props,t.props),e.page=(e.page||[]).concat(t.page||[]),e.error=[e.error,t.error].filter(Boolean).join(" || "),e.redirect=t.redirect?t.redirect:e.redirect,e):e),{}):{redirect:{code:301,location:{pathName:"/404"}}}))}const h=e=>`__preload-[${e}]-props__`,m=async({route:e,store:t,match:r,query:n,relativePathname:s})=>{const a=await(async({route:e})=>{const t=[];if(e.getInitialState&&t.push(e.getInitialState),e.component){const r=e.component;if(r.load&&"function"==typeof r.load){const e=r,n=await e.load();if(n.getInitialState&&"function"==typeof n.getInitialState&&t.push(n.getInitialState),void 0!==n.default){const e=n.default;e.getInitialState&&"function"==typeof e.getInitialState&&t.push(e.getInitialState)}}else{const e=r;e.getInitialState&&"function"==typeof e.getInitialState&&t.push(e.getInitialState)}}return t.length?async({store:e,pathName:r,params:n,relativePathname:s,query:a})=>{const o=h(r),i=(await Promise.all(t.map((t=>Promise.resolve().then((()=>t({store:e,pathName:r,params:n,relativePathname:s,query:a}))).catch((e=>(console.error(`[server] getInitialState error ${e.toString()}`),null))))))).filter(Boolean).reduce(((e,t)=>t?(e.error=[e.error,t.error].filter(Boolean).join(" || "),e.props=u()(e.props,t.props),e.redirect=t.redirect?t.redirect:e.redirect,e):e),{});return{...i,props:{[o]:i.props||{}}}}:null})({route:e});if(a){const o=await a({store:t,pathName:r.pathname,params:r.params,relativePathname:s,query:n});return e.path?{...o,page:[e.path]}:o}if(e.path)return{page:[e.path]}};function g(e){return function(t){t.getInitialState=e}}},4960:(e,t,r)=>{"use strict";r.r(t);const n=require("dotenv");var s=r.n(n);const a=require("express");var o=r.n(a),i=r(7692);const c=require("fs");var l=r.n(c);const u=require("fs/promises");var d=r.n(u);const p=require("path");var h=r.n(p);class m extends Error{constructor(e,t){super(e),this.code=t}}const g=require("pino"),f=require("pino-pretty");var v=r.n(f);const y=(e,t)=>(0,g.pino)(v()())[t](`[server] ${e}`),S=((...e)=>function(t,r){let n=0,s=-1;return function a(o){if(o<=s)throw new m("compose index error, every middleware only allow call once",500);if(n++,n>e.length+5)throw new m("call middleWare many times, look like a infinite loop and will stop call next",500);s=o;const i=e[o]||r;if(!i)return y("all middleware done, do not call next","warn"),Promise.resolve();try{return Promise.resolve(i(t,(()=>a(o+1))))}catch(e){return y(`compose catch error: ${e.message}`,"error"),Promise.resolve()}}(0)})((async(e,t)=>{const{req:r,res:n,errorHandler:s}=e;try{await t()}catch(t){y(`url: ${r.originalUrl}, method: ${r.method} error, ${t.message}`,"error"),s&&"function"==typeof s?t instanceof m?await s({ctx:e,req:r,res:n,e:t,code:t.code}):t instanceof Error&&await s({ctx:e,req:r,res:n,e:t,code:404}):n.status(t instanceof m?t.code:500).json({data:t.toString()})}}),(async e=>{const{requestHandler:t,req:r,res:n}=e;await t({req:r,res:n})})),w=function(e,t=S){return async(r,n,s)=>{const a={...e,req:r,res:n,next:s};try{await t(a,a.requestHandler)}catch(e){n.status(500).json({data:e.toString()})}}},x={lang:w({requestHandler:async function({req:e,res:t}){const{lang:r}=e.query;if(!r)throw new Error("invalid request");const n=h().resolve(process.cwd(),"lang",`${r}.json`);var s;if(!await(s=n,new Promise((e=>{l().promises.access(s,l().constants.F_OK).then((()=>e(!0))).catch((()=>e(!1)))}))))throw new m("unSupport lang",404);{const e=await(0,u.readFile)(n,{encoding:"utf-8"});t.status(200).json({data:JSON.parse(e)})}}})},_=async(e,t,r)=>{const n=x[e.path.slice(1)];n?await n(e,t,r):t.status(404).json({data:"not found"})},E=(...e)=>t=>e.reduce(((e,t)=>r=>e(t(r))))(t),T=({isSSR:e,isSTATIC:t,isSTREAM:r,isPURE_CSR:n,isMIDDLEWARE:s,isDEVELOPMENT:a,isANIMATE_ROUTER:o,PUBLIC_API_HOST:i})=>c=>async l=>{l.env={isSSR:e||l.req.query.isSSR||!1,isSTREAM:r,isSTATIC:t,isPURE_CSR:n,isDEVELOPMENT:a,isMIDDLEWARE:s,isANIMATE_ROUTER:o,PUBLIC_API_HOST:i,FRAMEWORK:process.env.REACT},await c(l)},j=e=>async t=>{const{env:r}=t;if(!r)throw new m("env 没有初始化",5e3);const{req:n,res:s}=t,a=n.cookies?.site_lang,o=a||i.Fp;s.cookie("site_lang",o),t.lang=o,r.LANG=o,await e(t)},q=e=>async t=>{const r=(0,i.Zj)();t.store=r,await e(t)};var P=r(2778),C=r(748),R=r(4484),A=r(57);const b=e=>async t=>{const{req:r,res:n,lang:s,store:a}=t;if(!s||!a)throw new m(`server 初始化失败 lang: ${s}, store: ${a}`,500);const{error:o,redirect:i,page:c,props:l}=await(0,C.Mk)(P.J,r.path,new URLSearchParams(r.url.split("?")[1]),a)||{};if(t.page=c,o)throw new m(o,403);if(i){const e=i.location.query.toString(),t=e.length?i.location.pathName+"?"+e:i.location.pathName;n.writeHead(i.code||302,{location:t}),n.end()}else l&&a.dispatch((0,A.DG)({name:R.j.clientProps,data:l})),await e(t)},k=e=>async t=>{const{store:r,lang:n}=t;if(!r||!n)throw new m("store or lang 初始化失败",500);if(!i.Jy[n])throw new m("不支持的语言",404);await(0,i.i2)(r.dispatch,n),await e(t)},L=require("lodash"),O=e=>h().resolve(process.cwd(),"dist",e),I=e=>h().resolve(O(e),"manifest-static.json"),$=(0,L.memoize)((async(e,t=(e=>e))=>t(await d().readFile(e,{encoding:"utf-8"}).then((e=>JSON.parse(e))))),((e,t)=>`${e}/${(t||"empty").toString()}`)),D=require("@loadable/server"),N=require("react-dom/server");let M=function(e){return e.manifest_loadable="manifest-loadable.json",e.manifest_deps="manifest-deps.json",e.manifest_dev="manifest-dev.json",e.manifest_prod="manifest-prod.json",e.manifest_static="manifest-static.json",e}({});const B=e=>h().resolve((e=>h().resolve(process.cwd(),"dist",e))(e),M.manifest_loadable);var U=r(3920),H=r(8930),F=r(2805),G=r(8638),J=r(6022);const V=require("react-router-dom/server");var W=r(6689),z=r(9377);const Z=require("react-dom"),K="ITbAOd";let X;const Q=(0,W.forwardRef)((function(e,t){return(0,z.qR)((()=>{X||(X=document.createElement("div")),X.id="__loading_bar__";const e=document.body.querySelector("#__content__");document.body.insertBefore(X,e)})),(0,z.tm)()?(0,Z.createPortal)((0,U.jsx)("div",{ref:t,className:K,style:{height:"0px",transform:"scale(0, 1)"}}),X):null})),Y=(0,W.memo)(Q),ee=()=>{const e=(0,z.r$)((e=>e.loading)),{ref:t}=(0,z.Kx)({loading:e});return(0,W.useEffect)((()=>{window.dd=z.r$}),[]),(0,U.jsx)(Y,{ref:t})};var te=r(9034),re=r(3308);const ne=(0,W.createContext)(null),se=({children:e,routes:t,LoadingBar:r})=>{const{loaded:n}=(0,z.Xw)({routes:t,preLoad:C.Mk});return n?(0,U.jsxs)(ne.Provider,{value:n,children:[(0,U.jsx)(r,{}),e]}):null},ae=()=>{const e=(0,W.useContext)(ne),t=(0,re.useRoutes)(P.J,e?.location);return(0,U.jsx)(U.Fragment,{children:(0,i.AL)()?(0,U.jsx)(te.AnimatePresence,{exitBeforeEnter:!0,children:(0,U.jsx)(W.Fragment,{children:(0,U.jsx)(te.motion.div,{initial:"initial",animate:"in",exit:"out",variants:{initial:{opacity:0},in:{opacity:1},out:{opacity:0}},transition:{type:"spring",damping:10,stiffness:50},children:t})},e?.location.pathname)}):t})};var oe=r(9114),ie=r(6544);const ce=({children:e})=>{const t=(0,i.CG)((e=>e.client.clientProps.data)),{pathname:r}=(0,re.useLocation)(),n=t[(0,C.zw)(r)],s=n?.$$__apollo__$$,a=(0,ie.useApollo)(s,!0);return(0,U.jsx)(oe.ApolloProvider,{client:a,children:e})};class le extends W.Component{constructor(...e){super(...e),this.state={stack:"",error:"",hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(e,t){this.setState({error:e.message,stack:t.componentStack})}render(){return this.state.hasError?(0,U.jsxs)("pre",{children:[(0,U.jsx)("p",{style:{color:"red",whiteSpace:"pre-wrap"},children:this.state.error}),this.state.stack]}):this.props.children}}var ue=r(3126);const de=({children:e})=>{const t=(0,W.useRef)(null),r=(0,i.CG)((e=>e.server.serverLang.data)),n=(0,i.CG)((e=>e.client.clientLang.data));return(0,W.useEffect)((()=>{t.current||(t.current=document.querySelector("html")),t.current&&(t.current.lang=n)}),[n]),(0,U.jsx)(ue.IntlProvider,{locale:n,messages:r[n]||{},defaultLocale:i.Fp,children:e})},pe=()=>(0,U.jsx)(ce,{children:(0,U.jsx)(de,{children:(0,U.jsx)(se,{routes:P.J,LoadingBar:ee,children:(0,U.jsx)(le,{children:(0,U.jsx)(ae,{})})})})}),he=({mode:e})=>async t=>"SSR"===e?await(async({req:e,res:t,store:r,lang:n,env:s})=>{const a={},o=(0,i.S9)(),c=(0,H.cookieStorageManagerSSR)(e.headers.cookie||""),l=(0,U.jsx)(F.CacheProvider,{value:o,children:(0,U.jsx)(H.ChakraProvider,{theme:i.rS,colorModeManager:c,children:(0,U.jsx)(J.Provider,{store:r,children:(0,U.jsx)(V.StaticRouter,{location:e.url,children:(0,U.jsx)(G.HelmetProvider,{context:a,children:(0,U.jsx)(pe,{})})})})})}),u=new D.ChunkExtractor({statsFile:B("client")}),d=u.collectChunks(l),p=(0,N.renderToString)(d),h=u.getLinkElements(),m=u.getStyleElements(),g=u.getScriptElements();t.status(200).send("<!doctype html>"+(0,N.renderToString)((0,U.jsx)(i.k9,{lang:n,env:JSON.stringify(s),script:g,helmetContext:a,link:h.concat(m),preloadedState:JSON.stringify(r.getState()),children:p})))})(t):"CSR"===e?await(async({res:e,store:t,lang:r,env:n})=>{if(!t||!r||!n)throw new m("server 初始化失败",500);const s=new D.ChunkExtractor({statsFile:B("client")}),a=s.getLinkElements(),o=s.getStyleElements(),c=s.getScriptElements();e.send("<!doctype html>"+(0,N.renderToString)((0,U.jsx)(i.k9,{lang:r,env:JSON.stringify(n),link:a.concat(o),preloadedState:JSON.stringify(t.getState()),script:c})))})(t):"P_CSR"===e?await(async({res:e,env:t,lang:r})=>{if(!t||!r)throw new m("server 初始化失败",500);const n=new D.ChunkExtractor({statsFile:B("client")}),s=n.getLinkElements(),a=n.getStyleElements(),o=n.getScriptElements();e.send("<!doctype html>"+(0,N.renderToString)((0,U.jsx)(i.k9,{env:JSON.stringify(t),lang:r,link:s.concat(a),script:o})))})(t):"StreamSSR"===e?await(async({req:e,res:t,store:r,lang:n,env:s})=>{const a={},o=(0,i.S9)(),c=(0,H.cookieStorageManagerSSR)(e.headers.cookie||""),l=(0,U.jsx)(F.CacheProvider,{value:o,children:(0,U.jsx)(H.ChakraProvider,{theme:i.rS,colorModeManager:c,children:(0,U.jsx)(J.Provider,{store:r,children:(0,U.jsx)(V.StaticRouter,{location:e.url,children:(0,U.jsx)(G.HelmetProvider,{context:a,children:(0,U.jsx)(pe,{})})})})})}),u=new D.ChunkExtractor({statsFile:B("client")}),d=u.collectChunks(l),p=(0,N.renderToString)(d),h=u.getLinkElements(),m=u.getStyleElements(),g=u.getScriptElements(),f=(0,U.jsx)(i.k9,{lang:n,env:JSON.stringify(s),script:g,helmetContext:a,link:h.concat(m),preloadedState:JSON.stringify(r.getState()),children:p});(0,N.renderToNodeStream)(f).pipe(t)})(t):void 0,me=E(T({isSSR:!0,isSTATIC:(0,i.f2)(),isPURE_CSR:!1,isMIDDLEWARE:(0,i.To)(),isDEVELOPMENT:!1,isANIMATE_ROUTER:(0,i.AL)(),PUBLIC_API_HOST:process.env.PUBLIC_PROD_API_HOST}),j,q,b,k)((async e=>{const t=he({mode:"SSR"});await t(e)})),ge=E(T({isSSR:!1,isSTATIC:!1,isPURE_CSR:!1,isDEVELOPMENT:!1,isMIDDLEWARE:(0,i.To)(),isANIMATE_ROUTER:(0,i.AL)(),PUBLIC_API_HOST:process.env.PUBLIC_PROD_API_HOST}),j,q,b,k)((async e=>{const t=he({mode:"CSR"});await t(e)})),fe=(E(T({isSSR:!1,isSTATIC:!1,isPURE_CSR:!0,isMIDDLEWARE:(0,i.To)(),isDEVELOPMENT:!1,isANIMATE_ROUTER:(0,i.AL)(),PUBLIC_API_HOST:process.env.PUBLIC_PROD_API_HOST}),j)((async e=>{const t=he({mode:"P_CSR"});await t(e)})),E(T({isSSR:!0,isSTREAM:!0,isSTATIC:(0,i.f2)(),isPURE_CSR:!1,isMIDDLEWARE:(0,i.To)(),isDEVELOPMENT:!1,isANIMATE_ROUTER:(0,i.AL)(),PUBLIC_API_HOST:process.env.PUBLIC_PROD_API_HOST}),j,q,b,k)((async e=>{const t=he({mode:"StreamSSR"});await t(e)}))),ve=async({req:e,res:t})=>{const{isSSR:r}=e.query;r||(0,i.Kv)()?(0,i.Xv)()?await fe({req:e,res:t}):await me({req:e,res:t}):await ge({req:e,res:t})},ye=require("http");var Se=r.n(ye);const we=require("stream/promises"),xe=e=>h().resolve(process.cwd(),"dist",e),_e=e=>{const t=e.p.slice(1),r="/"===t?"index.html":`${t.slice(1)}.html`;return{...e,fileName:r}},Ee=async(e,t)=>{if((await d().stat(e)).isDirectory()){const r=await d().readdir(e,{withFileTypes:!0});for(let n=0;n<r.length;n++){const s=r[n];s.isFile()&&await qe(h().resolve(e,s.name),h().resolve(t,s.name)),s.isDirectory()&&await Ee(h().resolve(e,s.name),h().resolve(t,s.name))}}else await qe(h().resolve(e),h().resolve(t,h().basename(e)))},Te=e=>d().mkdir(h().dirname(e),{recursive:!0}).catch(),je=(e,t)=>d().writeFile(e,t),qe=async(e,t)=>{await Te(t),await(0,we.pipeline)((0,c.createReadStream)(e),(0,c.createWriteStream)(t))},Pe=async()=>{const e=(r=await $(h().resolve(O("client"),"manifest-deps.json"),(e=>Object.keys(e).map((t=>({[t]:e[t].static}))).reduce(((e,t)=>({...e,...t})),{}))),Object.keys(r).filter((e=>r[e])).map((e=>({url:`http://${process.env.PROD_HOST}:${process.env.PROD_PORT}/MyReact${e.slice(1)}`,p:e})))),t=(await Promise.all(e.map((e=>(e=>new Promise((t=>{Se().get(e.url,(r=>{const{statusCode:n}=r;if(200===n){r.setEncoding("utf-8");let n="";r.on("data",(e=>n+=e)),r.on("end",(()=>t({rawData:n,pathConfig:e}))),r.on("error",(r=>t({error:r,pathConfig:e})))}else t({pathConfig:e,error:new Error("500 error")})})).on("error",(r=>t({pathConfig:e,error:r})))})))(e))))).filter((e=>e.rawData)).map((e=>({...e,pathConfig:{...e.pathConfig,..._e(e.pathConfig)}}))).map((e=>{return{...e,pathConfig:{...e.pathConfig,filePath:(t=e.pathConfig.fileName,h().resolve(process.cwd(),"dist","pages",t)),ghPagePath:xe(e.pathConfig.fileName)}};var t}));var r;await Ee((0,p.resolve)(process.cwd(),"public"),(0,p.resolve)(process.cwd(),"dist"));const n=await Promise.all(t.map((e=>Te(e.pathConfig.filePath).then((()=>je(e.pathConfig.ghPagePath,e.rawData).catch((e=>console.log(e))))).then((()=>je(e.pathConfig.filePath,e.rawData).then((()=>({config:e,state:!0}))).catch((()=>({config:e,state:!1}))))))));await je(I("client"),JSON.stringify(n.filter((e=>e.state)).map((e=>({[e.config.pathConfig.p]:e.config.pathConfig.filePath}))).reduce(((e,t)=>({...e,...t})),{})))};let Ce=()=>w({requestHandler:ve,errorHandler:({req:e,res:t,code:r,e:n})=>(({res:e,code:t,e:r})=>{let n=r.stack||r.message;return n=n.replace(/`/g,"\\`"),e.send("<!doctype html>"+(0,N.renderToString)((0,U.jsx)(i.k9,{children:`<h1>server render error!</h1>\n            <hr />\n            <div style='padding-left: 10px; font-size: 20px;'>\n              error code:\n              <b>${t}</b>\n              <br />\n              <br />\n              <pre style='font-size: 18px; color: red;'>${r.message}</pre>\n            </div>\n          <script>console.error(\`${n}\`)<\/script>`})))})({req:e,res:t,e:n,code:r})});s().config(),(async()=>{const e=o()();e.use(o().static(`${process.cwd()}/public`)),e.use(o().static(`${process.cwd()}/dist`)),(e=>{e.use((async(e,t,r)=>{const n=await $(I("client")).catch((()=>null)),s=n?.[`.${e.path}`];if(s){const e=l().createReadStream(s);t.setHeader("content-type","text/html"),e.pipe(t)}else r()}))})(e),(e=>{e.use("/api",_)})(e),await(async e=>{await new Promise((e=>{e()}))})(),e.use((async(e,t,r)=>{const n=await Ce();await n(e,t,r)}));const t=process.env.PROD_PORT;e.listen(t,(()=>{(0,i.f2)()?(y("start static page generate, base on current router","info"),Pe().then((()=>{process.exit(0)}))):y(`app is running, open http://localhost:${t}`,"info")}))})()},7692:(e,t,r)=>{"use strict";r.d(t,{k9:()=>$,S9:()=>M,Zj:()=>R,Fp:()=>v,AL:()=>c,To:()=>a,uf:()=>l,Kv:()=>o,f2:()=>u,Xv:()=>i,g_:()=>d,i2:()=>f,tE:()=>p,Jy:()=>g,rS:()=>k,CG:()=>A});const n=require("lodash/memoize");var s=r.n(n);const a=s()((()=>JSON.parse(process.env.MIDDLEWARE||"false"))),o=s()((()=>JSON.parse(process.env.SSR||"false"))),i=s()((()=>JSON.parse(process.env.STREAM||"false"))),c=s()((()=>JSON.parse(process.env.ANIMATE_ROUTER||"false"))),l=s()((()=>!1)),u=s()((()=>JSON.parse(process.env.STATIC_GENERATE||"false")&&!0)),d=s()((()=>process.env.PUBLIC_PROD_API_HOST)),p=!1;var h=r(4484),m=r(57);const g={en:"English",zh:"中文"},f=async(e,t)=>{await e((0,m.pW)({name:h.V.serverLang,lang:t}))},v="en";var y=r(6022),S=r(6695);const w=require("redux-saga");var x=r.n(w);const _=require("redux-thunk");var E=r.n(_);const T=require("redux-saga/effects"),j=require("project-tool/request");function*q(){yield(0,T.all)([(0,T.takeLatest)(m.JO.GET_DATA_ACTION(h.V.serverLang),(({done:e,lang:t})=>function*({done:e,lang:t}){try{if(!(yield(0,T.select)((e=>e.server.serverLang.data)))[t]){yield(0,T.put)((0,m.N7)({name:h.V.serverLang}));const e=(0,j.createRequest)({baseURL:d()}),{data:{data:r}}=yield(0,T.call)((r=>e.get(r,{params:{lang:t}})),"/api/lang");yield(0,T.put)((0,m.VZ)({name:h.V.serverLang,data:{[t]:r}}))}yield(0,T.put)((0,m.DG)({name:h.j.clientLang,data:t}))}catch(e){yield(0,T.put)((0,m.n$)({name:h.V.serverLang,error:e.toString()}))}finally{e()}}({done:e,lang:t})))])}const P={startSagas:(e,t)=>t.run(e),cancelSagas(e){e.dispatch({type:"@CANCEL_SAGAS_HMR"})}},C=S.compose,R=(e={})=>{const{preloadedState:t,middleware:r=[]}=e,n=x()(),s=[E(),n,...r],a=(0,S.legacy_createStore)(m.QW,t,C((0,S.applyMiddleware)(...s)));return a.sagaTask=P.startSagas(q,n),a},A=y.useSelector;var b=r(8930);const k=(0,b.extendTheme)({styles:{global:{body:{fontFamily:"ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,\n      Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"}}},semanticTokens:{colors:{mobileCardBackgroundColor:{default:"white",_dark:"gray.700"},cardBackgroundColor:{default:"whiteAlpha.500",_dark:"blackAlpha.600"},mobileModalColor:{default:"rgb(220, 220, 220)",_dark:"gray.700"},cardBorderColor:{default:"gray.300",_dark:"gray.600"},lightTextColor:{default:"gray.600",_dark:"gray.400"},siteBackgroundColor:{default:"rgba(250, 250, 250, 0.8)",_dark:"rgba(24, 24, 24, 0.2)"},bannerBackgroundColor:{default:"rgb(255, 255, 255)",_dark:"#1A202C"}}}});var L=r(3920);const O=({children:e,script:t=[]})=>(0,L.jsxs)("body",{children:[(0,L.jsx)(b.ColorModeScript,{}),"string"==typeof e?(0,L.jsx)("div",{id:"__content__",dangerouslySetInnerHTML:{__html:e||""}}):(0,L.jsx)("div",{id:"__content__",children:e}),t.filter(Boolean).map((e=>e))]}),I=({env:e="{}",link:t=[],preLoad:r=[],preloadedState:n="{}",helmetContext:{helmet:s}={},emotionChunks:a})=>(0,L.jsxs)("head",{children:[(0,L.jsx)("meta",{charSet:"utf-8"}),(0,L.jsx)("meta",{name:"build-time",content:"6/30/2023, 10:55:59 AM"}),(0,L.jsx)("meta",{name:"power-by",content:"@my-react ꒰ঌ( ⌯' '⌯)໒꒱"}),(0,L.jsx)("meta",{name:"author",content:"MrWangJustToDo"}),(0,L.jsx)("meta",{name:"description",content:"@my-react is a React like package, it can be used to build a modern website just like this, feel free to use and fire a issue if you have! link: https://github.com/MrWangJustToDo/MyReact"}),(0,L.jsx)("meta",{name:"keywords",content:"react, react-dom, ssr, csr, ssg"}),(0,L.jsx)("base",{href:p?"/":"/MyReact/"}),(0,L.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"}),(0,L.jsx)("link",{rel:"shortcut icon",href:"./favicon.ico",type:"image/x-icon"}),(0,L.jsxs)(L.Fragment,{children:[s?.base.toComponent(),s?.title.toComponent(),s?.meta.toComponent(),s?.link.toComponent(),s?.noscript.toComponent(),s?.style.toComponent(),s?.script.toComponent()]}),r.filter(Boolean).map((e=>e)),t.filter(Boolean).map((e=>e)),a?.styles.map(((e,t)=>(0,L.jsx)("style",{"data-server":!0,"data-emotion":`${e.key} ${e.ids.join(" ")}`,dangerouslySetInnerHTML:{__html:e.css}},e.key+"_"+t))),(0,L.jsx)("script",{id:"__preload_env__",type:"application/json",dangerouslySetInnerHTML:{__html:`${e}`}}),(0,L.jsx)("script",{id:"__preload_state__",type:"application/json",dangerouslySetInnerHTML:{__html:`${n}`}})]}),$=e=>(0,L.jsxs)("html",{lang:e.lang||"",children:[(0,L.jsx)(I,{...e}),(0,L.jsx)(O,{...e})]}),D=require("@emotion/cache");var N=r.n(D);const M=()=>N()({key:"css"})},4484:(e,t,r)=>{"use strict";r.d(t,{V:()=>s,j:()=>n});let n=function(e){return e.clientLang="clientLang",e.clientProps="clientProps",e}({}),s=function(e){return e.serverLang="serverLang",e}({})},57:(e,t,r)=>{"use strict";r.d(t,{pW:()=>f,n$:()=>S,N7:()=>v,VZ:()=>y,QW:()=>E,JO:()=>g,DG:()=>l});var n=r(6695),s=r(4484);const a=require("immer"),o=e=>`@client_action_${e}_loading`,i=e=>`@client_action_${e}_success`,c=e=>`@client_action_${e}_fail`,l=({name:e,data:t})=>({type:i(e),data:t,loadingState:!1}),u={data:"",error:null,loaded:!1,loading:!1},d={[o(s.j.clientLang)]:(e,t)=>(0,a.produce)(e,(e=>{e.data="",e.error=null,e.loading=t.loadingState||!0,e.loaded=!1})),[i(s.j.clientLang)]:(e,t)=>(0,a.produce)(e,(e=>{e.data=t.data||"",e.error=null,e.loading=!1,e.loaded=!0})),[c(s.j.clientLang)]:(e,t)=>(0,a.produce)(e,(e=>{e.data="",e.error=t.error,e.loading=!1,e.loaded=!0}))},p={data:{},error:null,loaded:!1,loading:!1},h={[o(s.j.clientProps)]:(e,t)=>(0,a.produce)(e,(e=>{e.error=null,e.loading=t.loadingState||!0,e.loaded=!1})),[i(s.j.clientProps)]:(e,t)=>(0,a.produce)(e,(e=>{e.data=t.data,e.error=null,e.loading=!1,e.loaded=!0})),[c(s.j.clientProps)]:(e,t)=>(0,a.produce)(e,(e=>{e.data={},e.error=t.error,e.loading=!1,e.loaded=!0}))},m=(0,n.combineReducers)({[s.j.clientLang]:(e=u,t)=>{const r=d[t.type];return r?r(e,t):e},[s.j.clientProps]:(e=p,t)=>{const r=h[t.type];return r?r(e,t):e}}),g={GET_DATA_ACTION:e=>`@server_action_${e}_startWithSaga`,GET_DATA_LOADING:e=>`@server_action_${e}_loading`,GET_DATA_SUCCESS:e=>`@server_action_${e}_success`,GET_DATA_FAIL:e=>`@server_action_${e}_fail`},f=({name:e,...t})=>r=>{let n=null;const s=new Promise((e=>{n=e}));return r({type:g.GET_DATA_ACTION(e),done:n,...t}),s},v=({name:e})=>({type:g.GET_DATA_LOADING(e),loadingState:!0}),y=({name:e,data:t})=>({type:g.GET_DATA_SUCCESS(e),data:t,loadingState:!1}),S=({name:e,error:t})=>({type:g.GET_DATA_FAIL(e),error:t,loadingState:!1}),w={data:{},error:null,loaded:!1,loading:!1},x={[g.GET_DATA_LOADING(s.V.serverLang)]:(e,t)=>(0,a.produce)(e,(e=>{e.error=null,e.loading=t.loadingState||!0,e.loaded=!1})),[g.GET_DATA_SUCCESS(s.V.serverLang)]:(e,t)=>(0,a.produce)(e,(e=>{e.data={...e.data,...t.data},e.error=null,e.loading=!1,e.loaded=!0})),[g.GET_DATA_FAIL(s.V.serverLang)]:(e,t)=>(0,a.produce)(e,(e=>{e.error=t.error,e.loading=!1,e.loaded=!0}))},_=(0,n.combineReducers)({[s.V.serverLang]:(e=w,t)=>{const r=x[t.type];return r?r(e,t):e}}),E=(0,n.combineReducers)({client:m,server:_})},5685:(e,t,r)=>{var n={"./":[4867,378,617],"./404":[3524,751],"./404.tsx":[3524,751],"./Blog":[8860,378,587],"./Blog.tsx":[8860,378,587],"./index":[4867,378,617],"./index.tsx":[4867,378,617]};function s(e){if(!r.o(n,e))return Promise.resolve().then((()=>{var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}));var t=n[e],s=t[0];return Promise.all(t.slice(1).map(r.e)).then((()=>r(s)))}s.keys=()=>Object.keys(n),s.id=5685,e.exports=s},4858:(e,t,r)=>{var n={"./":4867,"./404":3524,"./404.tsx":3524,"./Blog":8860,"./Blog.tsx":8860,"./index":4867,"./index.tsx":4867};function s(e){var t=a(e);if(!r.m[t]){var n=new Error("Module '"+e+"' ('"+t+"') is not available (weak dependency)");throw n.code="MODULE_NOT_FOUND",n}return r(t)}function a(e){if(!r.o(n,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return n[e]}s.keys=function(){return Object.keys(n)},s.resolve=a,s.id=4858,e.exports=s},9114:e=>{"use strict";e.exports=require("@apollo/client")},8930:e=>{"use strict";e.exports=require("@chakra-ui/react")},2805:e=>{"use strict";e.exports=require("@emotion/react")},5771:e=>{"use strict";e.exports=require("@loadable/component")},7496:e=>{"use strict";e.exports=require("@my-react/react")},4554:e=>{"use strict";e.exports=require("@my-react/react-dom")},3920:e=>{"use strict";e.exports=require("@my-react/react-jsx/jsx-runtime")},322:e=>{"use strict";e.exports=require("@my-react/react-reactive")},6544:e=>{"use strict";e.exports=require("@site/graphql")},1635:e=>{"use strict";e.exports=require("dayjs")},5468:e=>{"use strict";e.exports=require("dayjs/locale/zh-cn")},8073:e=>{"use strict";e.exports=require("dayjs/plugin/calendar")},4195:e=>{"use strict";e.exports=require("dayjs/plugin/relativeTime")},9034:e=>{"use strict";e.exports=require("framer-motion")},2145:e=>{"use strict";e.exports=require("highlight.js/lib/core")},9169:e=>{"use strict";e.exports=require("highlight.js/lib/languages/css")},2767:e=>{"use strict";e.exports=require("highlight.js/lib/languages/java")},7985:e=>{"use strict";e.exports=require("highlight.js/lib/languages/javascript")},5356:e=>{"use strict";e.exports=require("highlight.js/lib/languages/json")},2067:e=>{"use strict";e.exports=require("highlight.js/lib/languages/less")},2441:e=>{"use strict";e.exports=require("highlight.js/lib/languages/scss")},1927:e=>{"use strict";e.exports=require("highlight.js/lib/languages/shell")},5519:e=>{"use strict";e.exports=require("highlight.js/lib/languages/sql")},373:e=>{"use strict";e.exports=require("highlight.js/lib/languages/typescript")},9372:e=>{"use strict";e.exports=require("highlight.js/lib/languages/xml")},2631:e=>{"use strict";e.exports=require("lodash/once")},1381:e=>{"use strict";e.exports=require("lodash/throttle")},9653:e=>{"use strict";e.exports=require("markdown-it")},6689:e=>{"use strict";e.exports=require("react")},1050:e=>{"use strict";e.exports=require("react-grid-layout")},8638:e=>{"use strict";e.exports=require("react-helmet-async")},9847:e=>{"use strict";e.exports=require("react-icons/ai")},6290:e=>{"use strict";e.exports=require("react-icons/fa")},4041:e=>{"use strict";e.exports=require("react-icons/md")},764:e=>{"use strict";e.exports=require("react-icons/si")},382:e=>{"use strict";e.exports=require("react-icons/vsc")},3126:e=>{"use strict";e.exports=require("react-intl")},6022:e=>{"use strict";e.exports=require("react-redux")},1520:e=>{"use strict";e.exports=require("react-remove-scroll")},3308:e=>{"use strict";e.exports=require("react-router")},4661:e=>{"use strict";e.exports=require("react-router-dom")},6695:e=>{"use strict";e.exports=require("redux")},7739:e=>{"use strict";e.exports=require("use-pinch-ref")}},r={};function n(e){var s=r[e];if(void 0!==s)return s.exports;var a=r[e]={id:e,loaded:!1,exports:{}};return t[e].call(a.exports,a,a.exports,n),a.loaded=!0,a.exports}n.m=t,n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.f={},n.e=e=>Promise.all(Object.keys(n.f).reduce(((t,r)=>(n.f[r](e,t),t)),[])),n.u=e=>(({497:"common-Layout",587:"pages-Blog",617:"pages-",751:"pages-404"}[e]||e)+"-"+{378:"6d71cfd70f09e95f4f2c",497:"ac7bbb242614a6f9615b",587:"856a8c098a9e51ee3db2",617:"f85e27ca308293aa4614",751:"111436a529ec8560f5a4"}[e]+".js"),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),e={179:1},n.f.require=(t,r)=>{e[t]||(t=>{var r=t.modules,s=t.ids,a=t.runtime;for(var o in r)n.o(r,o)&&(n.m[o]=r[o]);a&&a(n);for(var i=0;i<s.length;i++)e[s[i]]=1})(require("./"+n.u(t)))};var s=n(4960);module.exports=s})();