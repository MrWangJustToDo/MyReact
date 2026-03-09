"use strict";exports.id=659,exports.ids=[659],exports.modules={3863(e,t,o){o.r(t),o.d(t,{default:()=>N});var s=o(2015),l=o(1990),n=o(8687),r=o(4967),a=o(3234),i=o(1354),c=o(8732);const d=()=>{const{open:e,toggle:t}=(0,a.D)();return(0,s.useEffect)((()=>{(async()=>{window.__MY_REACT_DEVTOOL_RUNTIME__&&"function"==typeof window.__MY_REACT_DEVTOOL_RUNTIME__||await(0,i.k0)(`${i.Gh}/bundle/hook.js`)})()}),[]),(0,c.jsx)(r.Portal,{children:(0,c.jsx)(r.ButtonGroup,{variant:"solid",position:"fixed",bottom:"16",left:"4",zIndex:"1000000",children:(0,c.jsxs)(r.Button,{colorScheme:"red",textTransform:"capitalize",onClick:t,children:[e?"close":"open"," DevTool"]})})})};var h=o(6293),u=o.n(h),m=o(5322),x=o(8698),p=o(4340),g=o(6952);const j=(0,g.createStoreWithComponent)({setup:()=>{const e=(0,g.ref)(u()().format("YYYY-MM-DD  HH:mm:ss")),t=(0,g.ref)(!1);let o=null;return(0,g.onMounted)((()=>{o=setInterval((()=>{e.value=u()().format("YYYY-MM-DD  HH:mm:ss")}),1e3)})),(0,g.onMounted)((()=>{t.value=!0})),(0,g.onUnmounted)((()=>{clearInterval(o)})),{time:e,isMount:t}}}),y={initial:{opacity:.2,translateY:-14},in:{opacity:1,translateY:0},out:{opacity:.2,translateY:14}},b=()=>(0,p.wt)((e=>e.state))?(0,c.jsxs)(r.Box,{textAlign:"center",children:[(0,c.jsx)(r.Flex,{marginTop:"6",justifyContent:"center",alignItems:"center",children:(0,c.jsxs)(r.Text,{fontSize:{base:"medium",md:"xl"},fontWeight:"semibold",noOfLines:1,display:"flex",alignItems:"center",children:[(0,c.jsx)(r.Link,{href:"https://github.com/MrWangJustToDo",target:"_blank",color:"blue.500",children:"Github"}),(0,c.jsx)(r.Icon,{as:x.HeartIcon,color:"red.600",mx:"0.2em",fill:"currentcolor"}),(0,c.jsx)(r.Link,{href:"https://github.com/MrWangJustToDo/MyReact",target:"_blank",color:"blue.500",children:"@my-react"})]})}),(0,c.jsx)(r.Text,{fontSize:"sm",marginTop:"2.5",as:"div",marginBottom:"9",color:"lightTextColor",children:(0,c.jsx)(j,{children:({time:e,isMount:t})=>{if(!t)return"";const o=u()(e),s=o.year(),l=o.month()+1+"",n=o.date()+"",a=o.hour()+"",i=o.minute()+"",d=o.second()+"";return(0,c.jsxs)(r.Flex,{justifyContent:"center",sx:{"& > div":{minWidth:"1.2em"}},children:[(0,c.jsx)(m.AnimatePresence,{mode:"wait",children:(0,c.jsx)(m.motion.div,{initial:"initial",animate:"in",exit:"out",variants:y,transition:{type:"tween",duration:.12},children:s},s)}),"-",(0,c.jsx)(m.AnimatePresence,{mode:"wait",children:(0,c.jsx)(m.motion.div,{initial:"initial",animate:"in",exit:"out",variants:y,transition:{type:"tween",duration:.12},children:l.length>1?l:`0${l}`},l)}),"-",(0,c.jsx)(m.AnimatePresence,{mode:"wait",children:(0,c.jsx)(m.motion.div,{initial:"initial",animate:"in",exit:"out",variants:y,transition:{type:"tween",duration:.12},children:n.length>1?n:`0${n}`},n)}),(0,c.jsx)("div",{children:" "}),(0,c.jsx)(m.AnimatePresence,{mode:"wait",children:(0,c.jsx)(m.motion.div,{initial:"initial",animate:"in",exit:"out",variants:y,transition:{type:"tween",duration:.12},children:a.length>1?a:`0${a}`},a)}),":",(0,c.jsx)(m.AnimatePresence,{mode:"wait",children:(0,c.jsx)(m.motion.div,{initial:"initial",animate:"in",exit:"out",variants:y,transition:{type:"tween",duration:.12},children:i.length>1?i:`0${i}`},i)}),":",(0,c.jsx)(m.AnimatePresence,{mode:"wait",children:(0,c.jsx)(m.motion.div,{initial:"initial",animate:"in",exit:"out",variants:y,transition:{type:"tween",duration:.12},children:d.length>1?d:`0${d}`},d)})]})}})})]}):null,f=(0,s.memo)(b);var v=o(143),k=o(4217),w=o(1429),C=o.n(w),M=o(2069),B=o(5273),T=o(9245),_=o(9534);const S=()=>{const{colorMode:e,toggleColorMode:t}=(0,r.useColorMode)();return(0,c.jsx)(r.Button,{onClick:t,variant:"ghost",size:"sm",children:(0,c.jsx)(r.Icon,{as:"dark"===e?x.MoonIcon:x.SunIcon})})};var I=o(6537);const R=()=>{const e=(0,r.useColorModeValue)(I.css`
      pre code.hljs {
        display: block;
        overflow-x: auto;
        padding: 1em;
      }
      code.hljs {
        padding: 3px 5px;
      }
      /*!
      Theme: GitHub
      Description: Light theme as seen on github.com
      Author: github.com
      Maintainer: @Hirse
      Updated: 2021-05-15
    
      Outdated base version: https://github.com/primer/github-syntax-light
      Current colors taken from GitHub's CSS
    */
      .hljs {
        --hljs-color: #84898e;
        color: #24292e;
        background: #ffffff;
      }
      .hljs-doctag,
      .hljs-keyword,
      .hljs-meta .hljs-keyword,
      .hljs-template-tag,
      .hljs-template-variable,
      .hljs-type,
      .hljs-variable.language_ {
        /* prettylights-syntax-keyword */
        color: #d73a49;
      }
      .hljs-title,
      .hljs-title.class_,
      .hljs-title.class_.inherited__,
      .hljs-title.function_ {
        /* prettylights-syntax-entity */
        color: #6f42c1;
      }
      .hljs-attr,
      .hljs-attribute,
      .hljs-literal,
      .hljs-meta,
      .hljs-number,
      .hljs-operator,
      .hljs-variable,
      .hljs-selector-attr,
      .hljs-selector-class,
      .hljs-selector-id {
        /* prettylights-syntax-constant */
        color: #005cc5;
      }
      .hljs-regexp,
      .hljs-string,
      .hljs-meta .hljs-string {
        /* prettylights-syntax-string */
        color: #032f62;
      }
      .hljs-built_in,
      .hljs-symbol {
        /* prettylights-syntax-variable */
        color: #e36209;
      }
      .hljs-comment,
      .hljs-code,
      .hljs-formula {
        /* prettylights-syntax-comment */
        color: #6a737d;
      }
      .hljs-name,
      .hljs-quote,
      .hljs-selector-tag,
      .hljs-selector-pseudo {
        /* prettylights-syntax-entity-tag */
        color: #22863a;
      }
      .hljs-subst {
        /* prettylights-syntax-storage-modifier-import */
        color: #24292e;
      }
      .hljs-section {
        /* prettylights-syntax-markup-heading */
        color: #005cc5;
        font-weight: bold;
      }
      .hljs-bullet {
        /* prettylights-syntax-markup-list */
        color: #735c0f;
      }
      .hljs-emphasis {
        /* prettylights-syntax-markup-italic */
        color: #24292e;
        font-style: italic;
      }
      .hljs-strong {
        /* prettylights-syntax-markup-bold */
        color: #24292e;
        font-weight: bold;
      }
      .hljs-addition {
        /* prettylights-syntax-markup-inserted */
        color: #22863a;
        background-color: #f0fff4;
      }
      .hljs-deletion {
        /* prettylights-syntax-markup-deleted */
        color: #b31d28;
        background-color: #ffeef0;
      }
      .hljs-char.escape_,
      .hljs-link,
      .hljs-params,
      .hljs-property,
      .hljs-punctuation,
      .hljs-tag {
        /* purposely ignored */
      }
    `,I.css`
      pre code.hljs {
        display: block;
        overflow-x: auto;
        padding: 1em;
      }
      code.hljs {
        padding: 3px 5px;
      }
      /*!
      Theme: GitHub Dark
      Description: Dark theme as seen on github.com
      Author: github.com
      Maintainer: @Hirse
      Updated: 2021-05-15
    
      Outdated base version: https://github.com/primer/github-syntax-dark
      Current colors taken from GitHub's CSS
    */
      .hljs {
        --hljs-color: #c9d1d9;
        color: #c9d1d9;
        background: #282936;
      }
      .hljs-doctag,
      .hljs-keyword,
      .hljs-meta .hljs-keyword,
      .hljs-template-tag,
      .hljs-template-variable,
      .hljs-type,
      .hljs-variable.language_ {
        /* prettylights-syntax-keyword */
        color: #ff7b72;
      }
      .hljs-title,
      .hljs-title.class_,
      .hljs-title.class_.inherited__,
      .hljs-title.function_ {
        /* prettylights-syntax-entity */
        color: #d2a8ff;
      }
      .hljs-attr,
      .hljs-attribute,
      .hljs-literal,
      .hljs-meta,
      .hljs-number,
      .hljs-operator,
      .hljs-variable,
      .hljs-selector-attr,
      .hljs-selector-class,
      .hljs-selector-id {
        /* prettylights-syntax-constant */
        color: #79c0ff;
      }
      .hljs-regexp,
      .hljs-string,
      .hljs-meta .hljs-string {
        /* prettylights-syntax-string */
        color: #a5d6ff;
      }
      .hljs-built_in,
      .hljs-symbol {
        /* prettylights-syntax-variable */
        color: #ffa657;
      }
      .hljs-comment,
      .hljs-code,
      .hljs-formula {
        /* prettylights-syntax-comment */
        color: #8b949e;
      }
      .hljs-name,
      .hljs-quote,
      .hljs-selector-tag,
      .hljs-selector-pseudo {
        /* prettylights-syntax-entity-tag */
        color: #7ee787;
      }
      .hljs-subst {
        /* prettylights-syntax-storage-modifier-import */
        color: #c9d1d9;
      }
      .hljs-section {
        /* prettylights-syntax-markup-heading */
        color: #1f6feb;
        font-weight: bold;
      }
      .hljs-bullet {
        /* prettylights-syntax-markup-list */
        color: #f2cc60;
      }
      .hljs-emphasis {
        /* prettylights-syntax-markup-italic */
        color: #c9d1d9;
        font-style: italic;
      }
      .hljs-strong {
        /* prettylights-syntax-markup-bold */
        color: #c9d1d9;
        font-weight: bold;
      }
      .hljs-addition {
        /* prettylights-syntax-markup-inserted */
        color: #aff5b4;
        background-color: #033a16;
      }
      .hljs-deletion {
        /* prettylights-syntax-markup-deleted */
        color: #ffdcd7;
        background-color: #67060c;
      }
      .hljs-char.escape_,
      .hljs-link,
      .hljs-params,
      .hljs-property,
      .hljs-punctuation,
      .hljs-tag {
        /* purposely ignored */
      }
    `);return(0,c.jsx)(I.Global,{styles:e})};R.displayName="GlobalStyle";const D={"/":"@my-react","/blog":"blog","/about":"config","/excalidraw":"excalidraw"},z=()=>{const e=(0,n.useLocation)(),t=(0,n.useNavigate)(),o=(0,s.useRef)(null),[l,a]=(0,s.useState)("up"),{formatMessage:i}=(0,M.useIntl)(),{scrollY:d}=(0,m.useScroll)(),h=(0,T.o)((e=>e.state));(0,s.useEffect)((()=>{const e=C()((()=>{const e=d.get();null!==o.current&&(e>o.current?a("down"):a("up")),o.current=e}),16);return d.onChange(e),()=>d.clearListeners()}),[d]);const u=(0,m.useTransform)(d,[0,.2,.4],[0,.4,1]),p=D[e.pathname.toLowerCase()]||"@my-react",{data:g,loading:j}=(0,v.useQuery)(k.GetStarCountDocument,{variables:{name:"MyReact",owner:"MrWangJustToDo"}});return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(R,{}),h?(0,c.jsxs)(r.Box,{id:"page-header",position:"sticky",top:"0",backgroundColor:"bannerBackgroundColor",zIndex:"banner",children:[(0,c.jsxs)(r.Container,{maxWidth:B.d,paddingX:{base:"3",lg:"6"},className:"site-header",children:[(0,c.jsxs)(r.Flex,{id:"desktop-header",paddingY:"2",justifyContent:"space-between",alignItems:"center",display:{base:"none",md:"flex"},children:[(0,c.jsx)(r.Text,{as:"h1",fontSize:{base:"xl",md:"2xl"},fontWeight:{base:"semibold",md:"bold"},noOfLines:1,children:i({id:p})}),(0,c.jsxs)(r.HStack,{gap:{base:"4px",lg:"8px"},children:[(0,c.jsx)(r.Button,{variant:"ghost",size:"sm",onClick:()=>t(_.pr?"/":"/MyReact/"),children:"Home"}),(0,c.jsx)(r.Button,{variant:"ghost",size:"sm",onClick:()=>t(_.pr?"/Blog":"/MyReact/Blog"),children:"Example"}),(0,c.jsx)(r.Button,{variant:"ghost",size:"sm",onClick:()=>t(_.pr?"/Excalidraw":"/MyReact/Excalidraw"),children:"Excalidraw"}),!1,(0,c.jsx)(S,{}),(0,c.jsxs)(r.Button,{variant:"outline",size:"sm",as:"a",href:"https://github.com/MrWangJustToDo/MyReact",target:"_blank",children:[(0,c.jsx)(r.Icon,{as:x.GithubIcon}),j?null:(0,c.jsxs)(r.Tag,{variant:"subtle",colorScheme:"orange",marginLeft:"3",children:[(0,c.jsx)(r.TagLeftIcon,{as:x.StarIcon,color:"orange.300",fill:"currentcolor"}),(0,c.jsx)(r.TagLabel,{children:g?.repository?.stargazerCount})]})]})]})]}),(0,c.jsxs)(r.Box,{id:"mobile-header",display:{base:"block",md:"none"},height:12,overflow:"hidden",children:[(0,c.jsxs)(r.Flex,{justifyContent:"space-between",alignItems:"center",height:"up"===l?"full":"0%",width:"full",transition:"height 0.3s",overflow:"hidden",children:[(0,c.jsx)(r.Text,{as:"h1",fontSize:{base:"xl",md:"2xl"},fontWeight:{base:"semibold",md:"bold"},noOfLines:1,children:i({id:p})}),(0,c.jsxs)(r.HStack,{gap:{base:"4px",lg:"8px"},children:[(0,c.jsx)(S,{}),(0,c.jsxs)(r.Button,{variant:"outline",size:"sm",as:"a",href:"https://github.com/MrWangJustToDo/MyReact",target:"_blank",children:[(0,c.jsx)(r.Icon,{as:x.GithubIcon}),j?null:(0,c.jsxs)(r.Tag,{variant:"subtle",colorScheme:"orange",marginLeft:"3",children:[(0,c.jsx)(r.TagLeftIcon,{as:x.StarIcon,color:"orange.300",fill:"orange.300"}),(0,c.jsx)(r.TagLabel,{children:g?.repository?.stargazerCount})]})]})]})]}),(0,c.jsxs)(r.Flex,{justifyContent:"space-between",alignItems:"center",height:"full",width:"full",children:[(0,c.jsx)(r.Button,{variant:"ghost",size:"sm",onClick:()=>t(_.pr?"/":"/MyReact/"),children:"Home"}),(0,c.jsx)(r.Button,{variant:"ghost",size:"sm",onClick:()=>t(_.pr?"/Blog":"/MyReact/Blog"),children:"Example"}),(0,c.jsx)(r.Button,{variant:"ghost",size:"sm",onClick:()=>t(_.pr?"/Excalidraw":"/MyReact/Excalidraw"),children:"Excalidraw"}),!1]})]})]}),(0,c.jsx)(m.motion.div,{className:"mx-[-2em]",style:{opacity:u,borderBottom:"1px solid rgba(100, 100, 100, .2)"}})]}):(0,c.jsx)(r.Button,{position:"fixed",zIndex:"banner",top:"50%",translateY:"-50%",right:"2",variant:"outline",size:"sm",onClick:()=>t(_.pr?"/":"/MyReact/"),children:"Home"})]})},H=(0,s.memo)(z);var E=o(1124);const L=()=>{const e=(0,p.Qc)();return(0,c.jsx)(E.RemoveScroll,{enabled:e>0,className:"placeholder",as:"span",children:(0,c.jsx)(c.Fragment,{})})},Y=e=>{const{id:t,head:o,body:l,foot:n,height:a,className:i,closeComplete:d,closeHandler:h,applyOverlay:u,isFirst:x}=e,g=(0,s.useRef)(!1),j=(0,s.useRef)(null),y=(0,s.useRef)(null),b=(0,s.useRef)(!1),{height:f}=(0,p.lW)(),v=(0,m.useMotionValue)(0),k=(0,m.useTransform)(v,(e=>`translateX(2px) rotate(${e}deg)`)),w=(0,m.useTransform)(v,(e=>`translateX(-2px) rotate(${-1*e}deg)`)),C=(0,m.useMotionValue)(0),M=(0,s.useCallback)((e=>{e.target&&e.target.contains(y.current)?b.current=!0:b.current=!1}),[]),B=(0,s.useCallback)(((e,{delta:t})=>{if(!b.current)return;const o=C.getVelocity();o>0&&v.set(10),o<0&&v.set(-10),C.set(Math.max(C.get()+t.y,0))}),[]),T=(0,s.useCallback)(((e,{velocity:t})=>{if(t.y>500)h&&h();else{const e=j.current,t=e?.getBoundingClientRect()?.height;C.get()/t>.6?h&&h():(0,m.animate)(C,0,{type:"spring",stiffness:300,damping:30,mass:.2}),v.set(0)}}),[v]),_=(0,r.useCallbackRef)((()=>{g.current?g.current&&d&&(d(),u(t,!1)):g.current=!0}));return(0,p.Su)((()=>(u(t,!0),()=>{u(t,!1)}))),(0,c.jsx)(r.Portal,{children:(0,c.jsx)(r.Box,{position:"fixed",left:"0",right:"0",top:"0",bottom:"0",overflow:"hidden",zIndex:"overlay",id:t,children:(0,c.jsxs)(m.motion.div,{drag:"y",dragElastic:0,onDrag:B,dragMomentum:!1,onDragEnd:T,onDragStart:M,dragConstraints:{bottom:0,top:0},style:{height:"100%",width:"100%",position:"absolute"},children:[(0,c.jsx)(r.Box,{position:"absolute",width:"100%",height:"100%",left:"0",right:"0",onClick:h}),(0,c.jsxs)(m.motion.div,{ref:j,style:{y:C,bottom:"0",width:"100%",display:"flex",overflow:"hidden",height:`${a}%`,position:"absolute",flexDirection:"column",borderRadius:"8px 8px 0 0",filter:"drop-shadow(0 0 0.75rem rgba(100, 100, 100, 0.35))",border:"1px solid var(--chakra-colors-cardBorderColor)"},initial:{y:f},animate:{y:0,transition:{type:"tween"}},exit:{y:f,transition:{type:"tween"}},className:i,onAnimationComplete:_,children:[(0,c.jsxs)(r.Box,{ref:y,height:"25px",display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"mobileModalColor",children:[(0,c.jsx)(m.motion.span,{style:{width:"18px",height:"4px",borderRadius:"99px",transform:k,backgroundColor:"var(--chakra-colors-gray-300)"}}),(0,c.jsx)(r.Box,{width:"0.5"}),(0,c.jsx)(m.motion.span,{style:{width:"18px",height:"4px",borderRadius:"99px",transform:w,backgroundColor:"var(--chakra-colors-gray-300)"}})]}),(0,c.jsx)(r.Divider,{}),(0,c.jsx)(r.Box,{backgroundColor:"mobileModalColor",paddingX:"3.5",paddingY:"1.5",children:o}),(0,c.jsx)(r.Box,{flex:"1",enabled:!0,id:"modal-scroll-box",paddingX:"3.5",allowPinchZoom:!0,removeScrollBar:x,marginTop:"-1px",overflow:"auto",position:"relative",backgroundColor:"mobileModalColor",as:E.RemoveScroll,children:l}),(0,c.jsx)(r.Box,{backgroundColor:"mobileModalColor",padding:"3.5",paddingY:"1.5",children:n})]})]})})})},P=e=>{const{head:t,body:o,foot:s,showState:l,className:n,closeComplete:a,closeHandler:i}=e,d=(0,r.useBreakpointValue)({base:"full",lg:"3xl"},{ssr:!0});return(0,c.jsxs)(r.Modal,{size:d,isOpen:l,scrollBehavior:"inside",onClose:i,onCloseComplete:a,children:[(0,c.jsx)(r.ModalOverlay,{backdropFilter:"blur(4px)"}),(0,c.jsxs)(r.ModalContent,{className:n,children:[t&&(0,c.jsx)(r.ModalHeader,{children:t}),(0,c.jsx)(r.ModalCloseButton,{}),(0,c.jsx)(r.ModalBody,{id:"modal-scroll-box",paddingTop:"0",children:o}),s&&(0,c.jsx)(r.ModalFooter,{children:s})]})]})},A=()=>{const{desktop:e}=(0,p.TP)()||{};return(0,c.jsx)(c.Fragment,{children:e?.map((e=>(0,c.jsx)(P,{...e},e.key)))})},F=()=>{const{mobile:e}=(0,p.TP)()||{};return(0,c.jsx)(c.Fragment,{children:(0,c.jsx)(m.AnimatePresence,{children:e?.map((e=>e.showState?(0,c.jsx)(Y,{...e},e.key):null))})})},W=({children:e})=>{const{overlays:t,open:o,close:l}=(0,p.pI)(),n=(0,r.useBreakpointValue)((0,s.useMemo)((()=>({base:{mobile:t,desktop:[]},md:{mobile:[],desktop:t}})),[t]),{ssr:!0});return(0,c.jsx)(p.RX.Provider,{value:n,children:(0,c.jsx)(p.Gi.Provider,{value:l,children:(0,c.jsxs)(p.yx.Provider,{value:o,children:[e,(0,c.jsxs)(r.Portal,{children:[(0,c.jsx)(F,{}),(0,c.jsx)(A,{})]})]})})})};var G;let N=(0,o(47).xT)((({relativePathname:e})=>({props:{title:e}})))(G=class extends s.Component{constructor(e){super(e),this.state={isMounted:!1},console.warn("create",this)}componentDidMount(){console.warn("mounted",this),this.setState({isMounted:!0})}componentWillUnmount(){console.warn("unmount",this)}UNSAFE_componentWillMount(){console.warn("willMount",this)}render(){console.warn("render",this);const{title:e}=this.props;return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(l.Helmet,{title:(e?.slice(1)?.toLowerCase()||"@my-react")+" | @my-react"}),(0,c.jsx)(L,{}),(0,c.jsx)(d,{}),(0,c.jsxs)(W,{children:[(0,c.jsx)(H,{}),(0,c.jsx)("div",{id:"page-content",children:(0,c.jsx)(n.Outlet,{})}),(0,c.jsx)("div",{id:"page-footer",children:(0,c.jsx)(f,{})})]})]})}})||G},5273(e,t,o){o.d(t,{d:()=>s});const s=1580},9245(e,t,o){o.d(t,{o:()=>s});const s=(0,o(6952).createState)((()=>({state:!0})),{withActions:e=>({enable:()=>e.state=!0,disable:()=>e.state=!1}),withNamespace:"useHead"})}};