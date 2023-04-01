"use strict";exports.id=497,exports.ids=[497],exports.modules={5914:(e,o,l)=>{l.r(o),l.d(o,{default:()=>P});var s=l(8930),t=l(6689),r=l(8638),a=l(3308),n=l(9847),i=l(1198),c=l(3887),d=l(3920);const h=()=>{const e=(0,c.tm)();return(0,d.jsxs)(s.Box,{textAlign:"center",children:[(0,d.jsx)(s.Flex,{marginTop:"6",justifyContent:"center",alignItems:"center",children:(0,d.jsxs)(s.Text,{fontSize:{base:"medium",md:"xl"},fontWeight:"semibold",noOfLines:1,display:"flex",alignItems:"center",children:[(0,d.jsx)(s.Link,{href:i.xr,target:"_blank",color:"blue.500",textDecoration:"none",paddingLeft:"0.2em",children:"github"}),(0,d.jsx)(s.Icon,{as:n.AiFillHeart,color:"red.600",mx:"0.2em"}),(0,d.jsx)(s.Text,{as:"span",children:"@my-react"})]})}),(0,d.jsx)(s.Text,{fontSize:"sm",marginTop:"2.5",marginBottom:"9",color:"lightTextColor",children:e?(new Date).getFullYear():""})]})},j=(0,t.memo)(h);var m=l(9114),x=l(6544),u=l(9034),g=l(6290),p=l(764),b=l(3126),f=l(6737),y=l(7615),v=l(4041);const k=()=>{const{colorMode:e,toggleColorMode:o}=(0,s.useColorMode)();return(0,d.jsx)(s.Button,{onClick:o,variant:"ghost",size:"sm",children:(0,d.jsx)(s.Icon,{as:"dark"===e?v.MdOutlineDarkMode:v.MdOutlineLightMode})})};var C=l(2805);const w=()=>{const e=(0,s.useColorModeValue)(C.css`
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
    `);return(0,d.jsx)(C.Global,{styles:e})},M={"/":"@my-react","/hot":"hmr","/blog":"blog"},B=()=>{const e=(0,a.useLocation)(),o=(0,a.useNavigate)(),{formatMessage:l}=(0,b.useIntl)(),{scrollY:t}=(0,u.useScroll)(),r=(0,u.useTransform)(t,[0,.2,.4],[0,.4,1]),n=M[e.pathname.toLowerCase()]||"@my-react",{data:i,loading:c}=(0,m.useQuery)(x.GetStarCountDocument,{variables:{name:"MyReact",owner:"MrWangJustToDo"}});return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsxs)(s.Container,{maxWidth:f.R,paddingX:{base:"3",lg:"6"},children:[(0,d.jsx)(w,{}),(0,d.jsxs)(s.Flex,{paddingY:"2",justifyContent:"space-between",alignItems:"center",children:[(0,d.jsx)(s.Text,{as:"h1",fontSize:{base:"xl",md:"2xl"},fontWeight:{base:"semibold",md:"bold"},children:l({id:n})}),(0,d.jsxs)(s.HStack,{gap:{base:"4px",lg:"8px"},children:[(0,d.jsx)(s.Button,{variant:"ghost",size:"sm",onClick:()=>o((0,y.f2)()?"/MyReact/":"/"),children:"Home"}),(0,d.jsx)(s.Button,{variant:"ghost",size:"sm",onClick:()=>o((0,y.f2)()?"/MyReact/Blog":"/Blog"),children:"Example"}),(0,d.jsx)(k,{}),(0,d.jsxs)(s.Button,{variant:"outline",size:"sm",as:"a",href:"https://github.com/MrWangJustToDo/MyReact",target:"_blank",children:[(0,d.jsx)(s.Icon,{as:p.SiGithub}),c?null:(0,d.jsxs)(s.Tag,{variant:"subtle",colorScheme:"orange",marginLeft:"3",children:[(0,d.jsx)(s.TagLeftIcon,{as:g.FaStar,color:"orange.300"}),(0,d.jsx)(s.TagLabel,{children:i?.repository?.stargazerCount})]})]})]})]})]}),(0,d.jsx)(u.motion.div,{style:{opacity:r,borderBottom:"1px solid rgba(100, 100, 100, .2)"}})]})},T=(0,t.memo)(B);var R=l(1520);const S=()=>{const e=(0,c.UE)();return(0,d.jsx)(R.RemoveScroll,{enabled:e>0,className:"placeholder",as:"span",children:(0,d.jsx)(d.Fragment,{})})},F=e=>{const{id:o,head:l,body:r,foot:a,height:n,className:i,closeComplete:h,closeHandler:j,applyOverlay:m,isFirst:x}=e,g=(0,t.useRef)(!1),p=(0,t.useRef)(null),{height:b}=(0,c.iP)(),f=(0,u.useMotionValue)(0),y=(0,u.useTransform)(f,(e=>`translateX(2px) rotate(${e}deg)`)),v=(0,u.useTransform)(f,(e=>`translateX(-2px) rotate(${-1*e}deg)`)),k=(0,u.useMotionValue)(0),C=(0,t.useCallback)(((e,{delta:o})=>{const l=k.getVelocity();l>0&&f.set(10),l<0&&f.set(-10),k.set(Math.max(k.get()+o.y,0))}),[]),w=(0,t.useCallback)(((e,{velocity:o})=>{if(o.y>500)j&&j();else{const e=p.current,o=e?.getBoundingClientRect()?.height;k.get()/o>.6?j&&j():(0,u.animate)(k,0,{type:"spring",stiffness:300,damping:30,mass:.2}),f.set(0)}}),[f]),M=(0,s.useCallbackRef)((()=>{g.current?g.current&&h&&(h(),m(o,!1)):g.current=!0}));return(0,c.qR)((()=>(m(o,!0),()=>{m(o,!1)}))),(0,d.jsx)(s.Portal,{children:(0,d.jsx)(s.Box,{position:"fixed",left:"0",right:"0",top:"0",bottom:"0",overflow:"hidden",zIndex:"overlay",id:o,children:(0,d.jsxs)(u.motion.div,{drag:"y",dragElastic:0,onDrag:C,dragMomentum:!1,onDragEnd:w,dragConstraints:{bottom:0,top:0},style:{height:"100%",width:"100%",position:"absolute"},children:[(0,d.jsx)(s.Box,{position:"absolute",width:"100%",height:"100%",left:"0",right:"0",onClick:j}),(0,d.jsxs)(u.motion.div,{ref:p,style:{y:k,bottom:"0",width:"100%",display:"flex",overflow:"hidden",height:`${n}%`,position:"absolute",flexDirection:"column",borderRadius:"8px 8px 0 0",filter:"drop-shadow(0 0 0.75rem rgba(100, 100, 100, 0.35))",border:"1px solid var(--chakra-colors-cardBorderColor)"},initial:{y:b},animate:{y:0,transition:{type:"tween"}},exit:{y:b,transition:{type:"tween"}},className:i,onAnimationComplete:M,children:[(0,d.jsxs)(s.Box,{height:"25px",display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"mobileModalColor",children:[(0,d.jsx)(u.motion.span,{style:{width:"18px",height:"4px",borderRadius:"99px",transform:y,backgroundColor:"var(--chakra-colors-gray-300)"}}),(0,d.jsx)(s.Box,{width:"0.5"}),(0,d.jsx)(u.motion.span,{style:{width:"18px",height:"4px",borderRadius:"99px",transform:v,backgroundColor:"var(--chakra-colors-gray-300)"}})]}),(0,d.jsx)(s.Divider,{}),(0,d.jsx)(s.Box,{backgroundColor:"mobileModalColor",paddingX:"3.5",paddingY:"1.5",children:l}),(0,d.jsx)(s.Box,{flex:"1",enabled:!0,id:"modal-scroll-box",paddingX:"3.5",allowPinchZoom:!0,removeScrollBar:x,marginTop:"-1px",overflow:"auto",position:"relative",backgroundColor:"mobileModalColor",as:R.RemoveScroll,children:r}),(0,d.jsx)(s.Box,{backgroundColor:"mobileModalColor",padding:"3.5",paddingY:"1.5",children:a})]})]})})})},_=e=>{const{head:o,body:l,foot:t,showState:r,className:a,closeComplete:n,closeHandler:i}=e,c=(0,s.useBreakpointValue)({base:"full",lg:"3xl"});return(0,d.jsxs)(s.Modal,{size:c,isOpen:r,scrollBehavior:"inside",onClose:i,onCloseComplete:n,children:[(0,d.jsx)(s.ModalOverlay,{}),(0,d.jsxs)(s.ModalContent,{className:a,children:[o&&(0,d.jsx)(s.ModalHeader,{children:o}),(0,d.jsx)(s.ModalCloseButton,{}),(0,d.jsx)(s.ModalBody,{id:"modal-scroll-box",paddingTop:"0",children:l}),t&&(0,d.jsx)(s.ModalFooter,{children:t})]})]})},z=()=>{const{desktop:e}=(0,c.tl)();return(0,d.jsx)(d.Fragment,{children:e.map((e=>(0,d.jsx)(_,{...e},e.key)))})},D=()=>{const{mobile:e}=(0,c.tl)();return(0,d.jsx)(d.Fragment,{children:(0,d.jsx)(u.AnimatePresence,{children:e.map((e=>e.showState?(0,d.jsx)(F,{...e},e.key):null))})})},I=({children:e})=>{const{overlays:o,open:l,close:r}=(0,c.Zb)(),a=(0,s.useBreakpointValue)((0,t.useMemo)((()=>({base:{mobile:o,desktop:[]},md:{mobile:[],desktop:o}})),[o]));return(0,d.jsx)(c.XY.Provider,{value:a,children:(0,d.jsx)(c.Nq.Provider,{value:r,children:(0,d.jsxs)(c.hZ.Provider,{value:l,children:[e,(0,d.jsxs)(s.Portal,{children:[(0,d.jsx)(D,{}),(0,d.jsx)(z,{})]})]})})})};var L;let P=(0,l(1822).G9)((({relativePathname:e})=>({props:{title:e}})))(L=class extends t.Component{constructor(e){super(e),this.state={isMounted:!1},console.warn("create",this)}componentDidMount(){console.warn("mounted",this),this.setState({isMounted:!0})}componentWillUnmount(){console.warn("unmount",this)}UNSAFE_componentWillMount(){console.warn("willMount",this)}render(){console.warn("render",this);const{title:e}=this.props,{isMounted:o}=this.state;return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(r.Helmet,{title:(e.slice(1).toLowerCase()||"@my-react")+" | @my-react"}),(0,d.jsx)(S,{}),(0,d.jsxs)(I,{children:[(0,d.jsx)(s.Box,{id:"page-header",position:"sticky",top:"0",backgroundColor:o?"bannerBackgroundColor":void 0,zIndex:"banner",children:(0,d.jsx)(T,{})}),(0,d.jsx)("div",{id:"page-content",children:(0,d.jsx)(a.Outlet,{})}),(0,d.jsx)("div",{id:"page-footer",children:(0,d.jsx)(j,{})})]})]})}})||L},6737:(e,o,l)=>{l.d(o,{R:()=>s});const s=1580},1198:(e,o,l)=>{l.d(o,{s8:()=>t,u8:()=>r,xr:()=>s});const s="https://github.com/facebook/react/issues",t="react",r="facebook"}};