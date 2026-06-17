"use strict";exports.id=659,exports.ids=[659],exports.modules={5311(e,t,s){s.r(t),s.d(t,{default:()=>A});var o=s(2015),l=s(1990),n=s(8687),r=s(4967),a=s(6293),i=s.n(a),c=s(5322),d=s(8698),h=s(2370),u=s(6952);const m=(0,u.createStoreWithComponent)({setup:()=>{const e=(0,u.ref)(i()().format("YYYY-MM-DD  HH:mm:ss")),t=(0,u.ref)(!1);let s=null;return(0,u.onMounted)(()=>{s=setInterval(()=>{e.value=i()().format("YYYY-MM-DD  HH:mm:ss")},1e3)}),(0,u.onMounted)(()=>{t.value=!0}),(0,u.onUnmounted)(()=>{clearInterval(s)}),{time:e,isMount:t}}});var x=s(8732);const g={initial:{opacity:.2,translateY:-14},in:{opacity:1,translateY:0},out:{opacity:.2,translateY:14}},p=()=>(0,h.wt)(e=>e.state)?(0,x.jsxs)(r.Box,{textAlign:"center",children:[(0,x.jsx)(r.Flex,{marginTop:"6",justifyContent:"center",alignItems:"center",children:(0,x.jsxs)(r.Text,{fontSize:{base:"medium",md:"xl"},fontWeight:"semibold",noOfLines:1,display:"flex",alignItems:"center",children:[(0,x.jsx)(r.Link,{href:"https://github.com/MrWangJustToDo",target:"_blank",color:"blue.500",children:"Github"}),(0,x.jsx)(r.Icon,{as:d.HeartIcon,color:"red.600",mx:"0.2em",fill:"currentcolor"}),(0,x.jsx)(r.Link,{href:"https://github.com/MrWangJustToDo/MyReact",target:"_blank",color:"blue.500",children:"@my-react"})]})}),(0,x.jsx)(r.Text,{fontSize:"sm",marginTop:"2.5",as:"div",marginBottom:"9",color:"lightTextColor",children:(0,x.jsx)(m,{children:({time:e,isMount:t})=>{if(!t)return"";const s=i()(e),o=s.year(),l=s.month()+1+"",n=s.date()+"",a=s.hour()+"",d=s.minute()+"",h=s.second()+"";return(0,x.jsxs)(r.Flex,{justifyContent:"center",sx:{"& > div":{minWidth:"1.2em"}},children:[(0,x.jsx)(c.AnimatePresence,{mode:"wait",children:(0,x.jsx)(c.motion.div,{initial:"initial",animate:"in",exit:"out",variants:g,transition:{type:"tween",duration:.12},children:o},o)}),"-",(0,x.jsx)(c.AnimatePresence,{mode:"wait",children:(0,x.jsx)(c.motion.div,{initial:"initial",animate:"in",exit:"out",variants:g,transition:{type:"tween",duration:.12},children:l.length>1?l:`0${l}`},l)}),"-",(0,x.jsx)(c.AnimatePresence,{mode:"wait",children:(0,x.jsx)(c.motion.div,{initial:"initial",animate:"in",exit:"out",variants:g,transition:{type:"tween",duration:.12},children:n.length>1?n:`0${n}`},n)}),(0,x.jsx)("div",{children:" "}),(0,x.jsx)(c.AnimatePresence,{mode:"wait",children:(0,x.jsx)(c.motion.div,{initial:"initial",animate:"in",exit:"out",variants:g,transition:{type:"tween",duration:.12},children:a.length>1?a:`0${a}`},a)}),":",(0,x.jsx)(c.AnimatePresence,{mode:"wait",children:(0,x.jsx)(c.motion.div,{initial:"initial",animate:"in",exit:"out",variants:g,transition:{type:"tween",duration:.12},children:d.length>1?d:`0${d}`},d)}),":",(0,x.jsx)(c.AnimatePresence,{mode:"wait",children:(0,x.jsx)(c.motion.div,{initial:"initial",animate:"in",exit:"out",variants:g,transition:{type:"tween",duration:.12},children:h.length>1?h:`0${h}`},h)})]})}})})]}):null,j=(0,o.memo)(p);var y=s(143),b=s(4217),f=s(1429),v=s.n(f),k=s(2069),w=s(900),C=s(1098),M=s(1021);const B=()=>{const{colorMode:e,toggleColorMode:t}=(0,r.useColorMode)();return(0,x.jsx)(r.Button,{onClick:t,variant:"ghost",size:"sm",children:(0,x.jsx)(r.Icon,{as:"dark"===e?d.MoonIcon:d.SunIcon})})};var S=s(6537);const T=()=>{const e=(0,r.useColorModeValue)(S.css`
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
    `,S.css`
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
    `);return(0,x.jsx)(S.Global,{styles:e})};T.displayName="GlobalStyle";const I={"/":"@my-react","/blog":"blog","/about":"config","/excalidraw":"excalidraw"},R=()=>{const e=(0,n.useLocation)(),t=(0,n.useNavigate)(),s=(0,o.useRef)(null),[l,a]=(0,o.useState)("up"),{formatMessage:i}=(0,k.useIntl)(),{scrollY:h}=(0,c.useScroll)(),u=(0,C.o)(e=>e.state);(0,o.useEffect)(()=>{const e=v()(()=>{const e=h.get();null!==s.current&&(e>s.current?a("down"):a("up")),s.current=e},16);return h.onChange(e),()=>h.clearListeners()},[h]);const m=(0,c.useTransform)(h,[0,.2,.4],[0,.4,1]),g=I[e.pathname.toLowerCase()]||"@my-react",{data:p,loading:j}=(0,y.useQuery)(b.GetStarCountDocument,{variables:{name:"MyReact",owner:"MrWangJustToDo"}});return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(T,{}),u?(0,x.jsxs)(r.Box,{id:"page-header",position:"sticky",top:"0",backgroundColor:"bannerBackgroundColor",zIndex:"banner",children:[(0,x.jsxs)(r.Container,{maxWidth:w.d,paddingX:{base:"3",lg:"6"},className:"site-header",children:[(0,x.jsxs)(r.Flex,{id:"desktop-header",paddingY:"2",justifyContent:"space-between",alignItems:"center",display:{base:"none",md:"flex"},children:[(0,x.jsx)(r.Text,{as:"h1",fontSize:{base:"xl",md:"2xl"},fontWeight:{base:"semibold",md:"bold"},noOfLines:1,children:i({id:g})}),(0,x.jsxs)(r.HStack,{gap:{base:"4px",lg:"8px"},children:[(0,x.jsx)(r.Button,{variant:"ghost",size:"sm",onClick:()=>t(M.pr?"/":"/MyReact/"),children:"Home"}),(0,x.jsx)(r.Button,{variant:"ghost",size:"sm",onClick:()=>t(M.pr?"/Blog":"/MyReact/Blog"),children:"Example"}),(0,x.jsx)(r.Button,{variant:"ghost",size:"sm",onClick:()=>t(M.pr?"/Excalidraw":"/MyReact/Excalidraw"),children:"Excalidraw"}),!1,(0,x.jsx)(B,{}),(0,x.jsxs)(r.Button,{variant:"outline",size:"sm",as:"a",href:"https://github.com/MrWangJustToDo/MyReact",target:"_blank",children:[(0,x.jsx)(r.Icon,{as:d.GithubIcon}),j?null:(0,x.jsxs)(r.Tag,{variant:"subtle",colorScheme:"orange",marginLeft:"3",children:[(0,x.jsx)(r.TagLeftIcon,{as:d.StarIcon,color:"orange.300",fill:"currentcolor"}),(0,x.jsx)(r.TagLabel,{children:p?.repository?.stargazerCount})]})]})]})]}),(0,x.jsxs)(r.Box,{id:"mobile-header",display:{base:"block",md:"none"},height:12,overflow:"hidden",children:[(0,x.jsxs)(r.Flex,{justifyContent:"space-between",alignItems:"center",height:"up"===l?"full":"0%",width:"full",transition:"height 0.3s",overflow:"hidden",children:[(0,x.jsx)(r.Text,{as:"h1",fontSize:{base:"xl",md:"2xl"},fontWeight:{base:"semibold",md:"bold"},noOfLines:1,children:i({id:g})}),(0,x.jsxs)(r.HStack,{gap:{base:"4px",lg:"8px"},children:[(0,x.jsx)(B,{}),(0,x.jsxs)(r.Button,{variant:"outline",size:"sm",as:"a",href:"https://github.com/MrWangJustToDo/MyReact",target:"_blank",children:[(0,x.jsx)(r.Icon,{as:d.GithubIcon}),j?null:(0,x.jsxs)(r.Tag,{variant:"subtle",colorScheme:"orange",marginLeft:"3",children:[(0,x.jsx)(r.TagLeftIcon,{as:d.StarIcon,color:"orange.300",fill:"orange.300"}),(0,x.jsx)(r.TagLabel,{children:p?.repository?.stargazerCount})]})]})]})]}),(0,x.jsxs)(r.Flex,{justifyContent:"space-between",alignItems:"center",height:"full",width:"full",children:[(0,x.jsx)(r.Button,{variant:"ghost",size:"sm",onClick:()=>t(M.pr?"/":"/MyReact/"),children:"Home"}),(0,x.jsx)(r.Button,{variant:"ghost",size:"sm",onClick:()=>t(M.pr?"/Blog":"/MyReact/Blog"),children:"Example"}),(0,x.jsx)(r.Button,{variant:"ghost",size:"sm",onClick:()=>t(M.pr?"/Excalidraw":"/MyReact/Excalidraw"),children:"Excalidraw"}),!1]})]})]}),(0,x.jsx)(c.motion.div,{className:"mx-[-2em]",style:{opacity:m,borderBottom:"1px solid rgba(100, 100, 100, .2)"}})]}):(0,x.jsx)(r.Button,{position:"fixed",zIndex:"banner",top:"50%",translateY:"-50%",right:"2",variant:"outline",size:"sm",onClick:()=>t(M.pr?"/":"/MyReact/"),children:"Home"})]})},H=(0,o.memo)(R);var _=s(1124);const z=()=>{const e=(0,h.Qc)();return(0,x.jsx)(_.RemoveScroll,{enabled:e>0,className:"placeholder",as:"span",children:(0,x.jsx)(x.Fragment,{})})},D=e=>{const{id:t,head:s,body:l,foot:n,height:a,className:i,closeComplete:d,closeHandler:u,applyOverlay:m,isFirst:g}=e,p=(0,o.useRef)(!1),j=(0,o.useRef)(null),y=(0,o.useRef)(null),b=(0,o.useRef)(!1),{height:f}=(0,h.lW)(),v=(0,c.useMotionValue)(0),k=(0,c.useTransform)(v,e=>`translateX(2px) rotate(${e}deg)`),w=(0,c.useTransform)(v,e=>`translateX(-2px) rotate(${-1*e}deg)`),C=(0,c.useMotionValue)(0),M=(0,o.useCallback)(e=>{e.target&&e.target.contains(y.current)?b.current=!0:b.current=!1},[]),B=(0,o.useCallback)((e,{delta:t})=>{if(!b.current)return;const s=C.getVelocity();s>0&&v.set(10),s<0&&v.set(-10),C.set(Math.max(C.get()+t.y,0))},[]),S=(0,o.useCallback)((e,{velocity:t})=>{if(t.y>500)u&&u();else{const e=j.current,t=e?.getBoundingClientRect()?.height;C.get()/t>.6?u&&u():(0,c.animate)(C,0,{type:"spring",stiffness:300,damping:30,mass:.2}),v.set(0)}},[v]),T=(0,r.useCallbackRef)(()=>{p.current?p.current&&d&&(d(),m(t,!1)):p.current=!0});return(0,h.Su)(()=>(m(t,!0),()=>{m(t,!1)})),(0,x.jsx)(r.Portal,{children:(0,x.jsx)(r.Box,{position:"fixed",left:"0",right:"0",top:"0",bottom:"0",overflow:"hidden",zIndex:"overlay",id:t,children:(0,x.jsxs)(c.motion.div,{drag:"y",dragElastic:0,onDrag:B,dragMomentum:!1,onDragEnd:S,onDragStart:M,dragConstraints:{bottom:0,top:0},style:{height:"100%",width:"100%",position:"absolute"},children:[(0,x.jsx)(r.Box,{position:"absolute",width:"100%",height:"100%",left:"0",right:"0",onClick:u}),(0,x.jsxs)(c.motion.div,{ref:j,style:{y:C,bottom:"0",width:"100%",display:"flex",overflow:"hidden",height:`${a}%`,position:"absolute",flexDirection:"column",borderRadius:"8px 8px 0 0",filter:"drop-shadow(0 0 0.75rem rgba(100, 100, 100, 0.35))",border:"1px solid var(--chakra-colors-cardBorderColor)"},initial:{y:f},animate:{y:0,transition:{type:"tween"}},exit:{y:f,transition:{type:"tween"}},className:i,onAnimationComplete:T,children:[(0,x.jsxs)(r.Box,{ref:y,height:"25px",display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"mobileModalColor",children:[(0,x.jsx)(c.motion.span,{style:{width:"18px",height:"4px",borderRadius:"99px",transform:k,backgroundColor:"var(--chakra-colors-gray-300)"}}),(0,x.jsx)(r.Box,{width:"0.5"}),(0,x.jsx)(c.motion.span,{style:{width:"18px",height:"4px",borderRadius:"99px",transform:w,backgroundColor:"var(--chakra-colors-gray-300)"}})]}),(0,x.jsx)(r.Divider,{}),(0,x.jsx)(r.Box,{backgroundColor:"mobileModalColor",paddingX:"3.5",paddingY:"1.5",children:s}),(0,x.jsx)(r.Box,{flex:"1",enabled:!0,id:"modal-scroll-box",paddingX:"3.5",allowPinchZoom:!0,removeScrollBar:g,marginTop:"-1px",overflow:"auto",position:"relative",backgroundColor:"mobileModalColor",as:_.RemoveScroll,children:l}),(0,x.jsx)(r.Box,{backgroundColor:"mobileModalColor",padding:"3.5",paddingY:"1.5",children:n})]})]})})})},L=e=>{const{head:t,body:s,foot:o,showState:l,className:n,closeComplete:a,closeHandler:i}=e,c=(0,r.useBreakpointValue)({base:"full",lg:"3xl"},{ssr:!0});return(0,x.jsxs)(r.Modal,{size:c,isOpen:l,scrollBehavior:"inside",onClose:i,onCloseComplete:a,children:[(0,x.jsx)(r.ModalOverlay,{backdropFilter:"blur(4px)"}),(0,x.jsxs)(r.ModalContent,{className:n,children:[t&&(0,x.jsx)(r.ModalHeader,{children:t}),(0,x.jsx)(r.ModalCloseButton,{}),(0,x.jsx)(r.ModalBody,{id:"modal-scroll-box",paddingTop:"0",children:s}),o&&(0,x.jsx)(r.ModalFooter,{children:o})]})]})},P=()=>{const{desktop:e}=(0,h.TP)()||{};return(0,x.jsx)(x.Fragment,{children:e?.map(e=>(0,x.jsx)(L,{...e},e.key))})},Y=()=>{const{mobile:e}=(0,h.TP)()||{};return(0,x.jsx)(x.Fragment,{children:(0,x.jsx)(c.AnimatePresence,{children:e?.map(e=>e.showState?(0,x.jsx)(D,{...e},e.key):null)})})},F=({children:e})=>{const{overlays:t,open:s,close:l}=(0,h.pI)(),n=(0,r.useBreakpointValue)((0,o.useMemo)(()=>({base:{mobile:t,desktop:[]},md:{mobile:[],desktop:t}}),[t]),{ssr:!0});return(0,x.jsx)(h.RX.Provider,{value:n,children:(0,x.jsx)(h.Gi.Provider,{value:l,children:(0,x.jsxs)(h.yx.Provider,{value:s,children:[e,(0,x.jsxs)(r.Portal,{children:[(0,x.jsx)(Y,{}),(0,x.jsx)(P,{})]})]})})})};var W;let A=(0,s(2844).xT)(({relativePathname:e})=>({props:{title:e}}))(W=class extends o.Component{constructor(e){super(e),this.state={isMounted:!1},console.warn("create",this)}componentDidMount(){console.warn("mounted",this),this.setState({isMounted:!0})}componentWillUnmount(){console.warn("unmount",this)}UNSAFE_componentWillMount(){console.warn("willMount",this)}render(){console.warn("render",this);const{title:e}=this.props;return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(l.Helmet,{title:(e?.slice(1)?.toLowerCase()||"@my-react")+" | @my-react"}),(0,x.jsx)(z,{}),(0,x.jsxs)(F,{children:[(0,x.jsx)(H,{}),(0,x.jsx)("div",{id:"page-content",children:(0,x.jsx)(n.Outlet,{})}),(0,x.jsx)("div",{id:"page-footer",children:(0,x.jsx)(j,{})})]})]})}})||W},900(e,t,s){s.d(t,{d:()=>o});const o=1580},1098(e,t,s){s.d(t,{o:()=>o});const o=(0,s(6952).createState)(()=>({state:!0}),{withActions:e=>({enable:()=>e.state=!0,disable:()=>e.state=!1}),withNamespace:"useHead"})}};