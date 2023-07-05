"use strict";exports.id=497,exports.ids=[497],exports.modules={8645:(e,o,t)=>{t.r(o),t.d(o,{default:()=>P});var s=t(8930),l=t(6689),r=t(8638),a=t(3308),n=t(9847),i=t(7829),c=t(9987),d=t(3920);const h=()=>{const e=(0,c.tm)();return(0,d.jsxs)(s.Box,{textAlign:"center",children:[(0,d.jsx)(s.Flex,{marginTop:"6",justifyContent:"center",alignItems:"center",children:(0,d.jsxs)(s.Text,{fontSize:{base:"medium",md:"xl"},fontWeight:"semibold",noOfLines:1,display:"flex",alignItems:"center",children:[(0,d.jsx)(s.Link,{href:i.xr,target:"_blank",color:"blue.500",textDecoration:"none",paddingLeft:"0.2em",children:"github"}),(0,d.jsx)(s.Icon,{as:n.AiFillHeart,color:"red.600",mx:"0.2em"}),(0,d.jsx)(s.Text,{as:"span",children:"@my-react"})]})}),(0,d.jsx)(s.Text,{fontSize:"sm",marginTop:"2.5",marginBottom:"9",color:"lightTextColor",children:e?(new Date).getFullYear():""})]})},j=(0,l.memo)(h);var u=t(9114),m=t(6544),x=t(9034),g=t(6290),p=t(764),b=t(3126),f=t(8255),y=t(187),k=t(4041);const v=()=>{const{colorMode:e,toggleColorMode:o}=(0,s.useColorMode)();return(0,d.jsx)(s.Button,{onClick:o,variant:"ghost",size:"sm",children:(0,d.jsx)(s.Icon,{as:"dark"===e?k.MdOutlineDarkMode:k.MdOutlineLightMode})})};var C=t(2805);const w=()=>{const e=(0,s.useColorModeValue)(C.css`
      pre code.hljs {
        display: block;
        overflow-x: auto;
        padding: 1em;
      }
      code.hljs {
        padding: 3px 5px;
      }
      .hljs {
        color: #383a42;
        background: #fafafa;
      }
      .hljs-comment,
      .hljs-quote {
        color: #a0a1a7;
        font-style: italic;
      }
      .hljs-doctag,
      .hljs-formula,
      .hljs-keyword {
        color: #a626a4;
      }
      .hljs-deletion,
      .hljs-name,
      .hljs-section,
      .hljs-selector-tag,
      .hljs-subst {
        color: #e45649;
      }
      .hljs-literal {
        color: #0184bb;
      }
      .hljs-addition,
      .hljs-attribute,
      .hljs-meta .hljs-string,
      .hljs-regexp,
      .hljs-string {
        color: #50a14f;
      }
      .hljs-attr,
      .hljs-number,
      .hljs-selector-attr,
      .hljs-selector-class,
      .hljs-selector-pseudo,
      .hljs-template-variable,
      .hljs-type,
      .hljs-variable {
        color: #986801;
      }
      .hljs-bullet,
      .hljs-link,
      .hljs-meta,
      .hljs-selector-id,
      .hljs-symbol,
      .hljs-title {
        color: #4078f2;
      }
      .hljs-built_in,
      .hljs-class .hljs-title,
      .hljs-title.class_ {
        color: #c18401;
      }
      .hljs-emphasis {
        font-style: italic;
      }
      .hljs-strong {
        font-weight: 700;
      }
      .hljs-link {
        text-decoration: underline;
      }
    `,C.css`
      pre code.hljs {
        display: block;
        overflow-x: auto;
        padding: 1em;
      }
      code.hljs {
        padding: 3px 5px;
      }
      .hljs {
        color: #e9e9f4;
        background: #282936;
      }
      .hljs ::selection,
      .hljs::selection {
        background-color: #4d4f68;
        color: #e9e9f4;
      }
      .hljs-comment {
        color: #626483;
      }
      .hljs-tag {
        color: #62d6e8;
      }
      .hljs-operator,
      .hljs-punctuation,
      .hljs-subst {
        color: #e9e9f4;
      }
      .hljs-operator {
        opacity: 0.7;
      }
      .hljs-bullet,
      .hljs-deletion,
      .hljs-name,
      .hljs-selector-tag,
      .hljs-template-variable,
      .hljs-variable {
        color: #ea51b2;
      }
      .hljs-attr,
      .hljs-link,
      .hljs-literal,
      .hljs-number,
      .hljs-symbol,
      .hljs-variable.constant_ {
        color: #b45bcf;
      }
      .hljs-class .hljs-title,
      .hljs-title,
      .hljs-title.class_ {
        color: #00f769;
      }
      .hljs-strong {
        font-weight: 700;
        color: #00f769;
      }
      .hljs-addition,
      .hljs-code,
      .hljs-string,
      .hljs-title.class_.inherited__ {
        color: #ebff87;
      }
      .hljs-built_in,
      .hljs-doctag,
      .hljs-keyword.hljs-atrule,
      .hljs-quote,
      .hljs-regexp {
        color: #a1efe4;
      }
      .hljs-attribute,
      .hljs-function .hljs-title,
      .hljs-section,
      .hljs-title.function_,
      .ruby .hljs-property {
        color: #62d6e8;
      }
      .diff .hljs-meta,
      .hljs-keyword,
      .hljs-template-tag,
      .hljs-type {
        color: #b45bcf;
      }
      .hljs-emphasis {
        color: #b45bcf;
        font-style: italic;
      }
      .hljs-meta,
      .hljs-meta .hljs-keyword,
      .hljs-meta .hljs-string {
        color: #00f769;
      }
      .hljs-meta .hljs-keyword,
      .hljs-meta-keyword {
        font-weight: 700;
      }
    `);return(0,d.jsx)(C.Global,{styles:e})},M={"/":"@my-react","/hot":"hmr","/blog":"blog"},B=()=>{const e=(0,a.useLocation)(),o=(0,a.useNavigate)(),{formatMessage:t}=(0,b.useIntl)(),l=(0,c.dD)(),{scrollY:r}=(0,x.useScroll)(),n=(0,x.useTransform)(r,[0,.2,.4],[0,.4,1]),i=M[e.pathname.toLowerCase()]||"@my-react",{data:h,loading:j}=(0,u.useQuery)(m.GetStarCountDocument,{variables:{name:"MyReact",owner:"MrWangJustToDo"}});return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsxs)(s.Container,{maxWidth:f.R,paddingX:{base:"3",lg:"6"},children:[(0,d.jsx)(w,{}),(0,d.jsxs)(s.Flex,{paddingY:"2",justifyContent:"space-between",alignItems:"center",children:[(0,d.jsx)(s.Text,{as:"h1",fontSize:{base:"xl",md:"2xl"},fontWeight:{base:"semibold",md:"bold"},noOfLines:1,children:t({id:i})}),(0,d.jsxs)(s.HStack,{gap:{base:"4px",lg:"8px"},children:[(0,d.jsx)(s.Button,{variant:"ghost",size:"sm",onClick:()=>o(y.tE?"/":"/MyReact/"),children:"Home"}),(0,d.jsx)(s.Button,{variant:"ghost",size:"sm",onClick:()=>o(y.tE?"/Blog":"/MyReact/Blog"),children:"Example"}),(0,d.jsx)(v,{}),(0,d.jsxs)(s.Button,{variant:"outline",size:"sm",as:"a",href:"https://github.com/MrWangJustToDo/MyReact",target:"_blank",children:[(0,d.jsx)(s.Icon,{as:p.SiGithub}),j||l?null:(0,d.jsxs)(s.Tag,{variant:"subtle",colorScheme:"orange",marginLeft:"3",children:[(0,d.jsx)(s.TagLeftIcon,{as:g.FaStar,color:"orange.300"}),(0,d.jsx)(s.TagLabel,{children:h?.repository?.stargazerCount})]})]})]})]})]}),(0,d.jsx)(x.motion.div,{style:{opacity:n,borderBottom:"1px solid rgba(100, 100, 100, .2)"}})]})},R=(0,l.memo)(B);var S=t(1520);const T=()=>{const e=(0,c.UE)();return(0,d.jsx)(S.RemoveScroll,{enabled:e>0,className:"placeholder",as:"span",children:(0,d.jsx)(d.Fragment,{})})},D=e=>{const{id:o,head:t,body:r,foot:a,height:n,className:i,closeComplete:h,closeHandler:j,applyOverlay:u,isFirst:m}=e,g=(0,l.useRef)(!1),p=(0,l.useRef)(null),b=(0,l.useRef)(null),f=(0,l.useRef)(!1),{height:y}=(0,c.iP)(),k=(0,x.useMotionValue)(0),v=(0,x.useTransform)(k,(e=>`translateX(2px) rotate(${e}deg)`)),C=(0,x.useTransform)(k,(e=>`translateX(-2px) rotate(${-1*e}deg)`)),w=(0,x.useMotionValue)(0),M=(0,l.useCallback)((e=>{e.target&&e.target.contains(b.current)?f.current=!0:f.current=!1}),[]),B=(0,l.useCallback)(((e,{delta:o})=>{if(!f.current)return;const t=w.getVelocity();t>0&&k.set(10),t<0&&k.set(-10),w.set(Math.max(w.get()+o.y,0))}),[]),R=(0,l.useCallback)(((e,{velocity:o})=>{if(o.y>500)j&&j();else{const e=p.current,o=e?.getBoundingClientRect()?.height;w.get()/o>.6?j&&j():(0,x.animate)(w,0,{type:"spring",stiffness:300,damping:30,mass:.2}),k.set(0)}}),[k]),T=(0,s.useCallbackRef)((()=>{g.current?g.current&&h&&(h(),u(o,!1)):g.current=!0}));return(0,c.qR)((()=>(u(o,!0),()=>{u(o,!1)}))),(0,d.jsx)(s.Portal,{children:(0,d.jsx)(s.Box,{position:"fixed",left:"0",right:"0",top:"0",bottom:"0",overflow:"hidden",zIndex:"overlay",id:o,children:(0,d.jsxs)(x.motion.div,{drag:"y",dragElastic:0,onDrag:B,dragMomentum:!1,onDragEnd:R,onDragStart:M,dragConstraints:{bottom:0,top:0},style:{height:"100%",width:"100%",position:"absolute"},children:[(0,d.jsx)(s.Box,{position:"absolute",width:"100%",height:"100%",left:"0",right:"0",onClick:j}),(0,d.jsxs)(x.motion.div,{ref:p,style:{y:w,bottom:"0",width:"100%",display:"flex",overflow:"hidden",height:`${n}%`,position:"absolute",flexDirection:"column",borderRadius:"8px 8px 0 0",filter:"drop-shadow(0 0 0.75rem rgba(100, 100, 100, 0.35))",border:"1px solid var(--chakra-colors-cardBorderColor)"},initial:{y},animate:{y:0,transition:{type:"tween"}},exit:{y,transition:{type:"tween"}},className:i,onAnimationComplete:T,children:[(0,d.jsxs)(s.Box,{ref:b,height:"25px",display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"mobileModalColor",children:[(0,d.jsx)(x.motion.span,{style:{width:"18px",height:"4px",borderRadius:"99px",transform:v,backgroundColor:"var(--chakra-colors-gray-300)"}}),(0,d.jsx)(s.Box,{width:"0.5"}),(0,d.jsx)(x.motion.span,{style:{width:"18px",height:"4px",borderRadius:"99px",transform:C,backgroundColor:"var(--chakra-colors-gray-300)"}})]}),(0,d.jsx)(s.Divider,{}),(0,d.jsx)(s.Box,{backgroundColor:"mobileModalColor",paddingX:"3.5",paddingY:"1.5",children:t}),(0,d.jsx)(s.Box,{flex:"1",enabled:!0,id:"modal-scroll-box",paddingX:"3.5",allowPinchZoom:!0,removeScrollBar:m,marginTop:"-1px",overflow:"auto",position:"relative",backgroundColor:"mobileModalColor",as:S.RemoveScroll,children:r}),(0,d.jsx)(s.Box,{backgroundColor:"mobileModalColor",padding:"3.5",paddingY:"1.5",children:a})]})]})})})},F=e=>{const{head:o,body:t,foot:l,showState:r,className:a,closeComplete:n,closeHandler:i}=e,c=(0,s.useBreakpointValue)({base:"full",lg:"3xl"});return(0,d.jsxs)(s.Modal,{size:c,isOpen:r,scrollBehavior:"inside",onClose:i,onCloseComplete:n,children:[(0,d.jsx)(s.ModalOverlay,{}),(0,d.jsxs)(s.ModalContent,{className:a,children:[o&&(0,d.jsx)(s.ModalHeader,{children:o}),(0,d.jsx)(s.ModalCloseButton,{}),(0,d.jsx)(s.ModalBody,{id:"modal-scroll-box",paddingTop:"0",children:t}),l&&(0,d.jsx)(s.ModalFooter,{children:l})]})]})},_=()=>{const{desktop:e}=(0,c.tl)();return(0,d.jsx)(d.Fragment,{children:e.map((e=>(0,d.jsx)(F,{...e},e.key)))})},z=()=>{const{mobile:e}=(0,c.tl)();return(0,d.jsx)(d.Fragment,{children:(0,d.jsx)(x.AnimatePresence,{children:e.map((e=>e.showState?(0,d.jsx)(D,{...e},e.key):null))})})},I=({children:e})=>{const{overlays:o,open:t,close:r}=(0,c.Zb)(),a=(0,s.useBreakpointValue)((0,l.useMemo)((()=>({base:{mobile:o,desktop:[]},md:{mobile:[],desktop:o}})),[o]));return(0,d.jsx)(c.XY.Provider,{value:a,children:(0,d.jsx)(c.Nq.Provider,{value:r,children:(0,d.jsxs)(c.hZ.Provider,{value:t,children:[e,(0,d.jsxs)(s.Portal,{children:[(0,d.jsx)(z,{}),(0,d.jsx)(_,{})]})]})})})};var L;let P=(0,t(6721).G9)((({relativePathname:e})=>({props:{title:e}})))(L=class extends l.Component{constructor(e){super(e),this.state={isMounted:!1},console.warn("create",this)}componentDidMount(){console.warn("mounted",this),this.setState({isMounted:!0})}componentWillUnmount(){console.warn("unmount",this)}UNSAFE_componentWillMount(){console.warn("willMount",this)}render(){console.warn("render",this);const{title:e}=this.props,{isMounted:o}=this.state;return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(r.Helmet,{title:(e?.slice(1)?.toLowerCase()||"@my-react")+" | @my-react"}),(0,d.jsx)(T,{}),(0,d.jsxs)(I,{children:[(0,d.jsx)(s.Box,{id:"page-header",position:"sticky",top:"0",backgroundColor:o?"bannerBackgroundColor":void 0,zIndex:"banner",children:(0,d.jsx)(R,{})}),(0,d.jsx)("div",{id:"page-content",children:(0,d.jsx)(a.Outlet,{})}),(0,d.jsx)("div",{id:"page-footer",children:(0,d.jsx)(j,{})})]})]})}})||L},8255:(e,o,t)=>{t.d(o,{R:()=>s});const s=1580},7829:(e,o,t)=>{t.d(o,{s8:()=>l,u8:()=>r,xr:()=>s});const s="https://github.com/facebook/react/issues",l="react",r="facebook"}};