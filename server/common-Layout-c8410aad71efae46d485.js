"use strict";exports.id=497,exports.ids=[497],exports.modules={5914:(e,o,s)=>{s.r(o),s.d(o,{default:()=>P});var l=s(8930),t=s(6689),r=s(8638),a=s(3308),n=s(9847),i=s(1198),c=s(3887),d=s(3920);const h=()=>{const e=(0,c.tm)();return(0,d.jsxs)(l.Box,{textAlign:"center",children:[(0,d.jsx)(l.Flex,{marginTop:"6",justifyContent:"center",alignItems:"center",children:(0,d.jsxs)(l.Text,{fontSize:{base:"medium",md:"xl"},fontWeight:"semibold",noOfLines:1,display:"flex",alignItems:"center",children:[(0,d.jsx)(l.Link,{href:i.xr,target:"_blank",color:"blue.500",textDecoration:"none",paddingLeft:"0.2em",children:"github"}),(0,d.jsx)(l.Icon,{as:n.AiFillHeart,color:"red.600",mx:"0.2em"}),(0,d.jsx)(l.Text,{as:"span",children:"@my-react"})]})}),(0,d.jsx)(l.Text,{fontSize:"sm",marginTop:"2.5",marginBottom:"9",color:"lightTextColor",children:e?(new Date).getFullYear():""})]})},j=(0,t.memo)(h);var m=s(9114),x=s(6544),u=s(9034),g=s(6290),p=s(764),b=s(3126),f=s(6737),y=s(7615),v=s(4041);const k=()=>{const{colorMode:e,toggleColorMode:o}=(0,l.useColorMode)();return(0,d.jsx)(l.Button,{onClick:o,variant:"ghost",size:"sm",children:(0,d.jsx)(l.Icon,{as:"dark"===e?v.MdOutlineDarkMode:v.MdOutlineLightMode})})};var C=s(2805);const w=()=>{const e=(0,l.useColorModeValue)(C.css`
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
    `);return(0,d.jsx)(C.Global,{styles:e})},M={"/":"@my-react","/hot":"hmr","/blog":"blog"},B=()=>{const e=(0,a.useLocation)(),o=(0,a.useNavigate)(),{formatMessage:s}=(0,b.useIntl)(),t=(0,c.dD)(),{scrollY:r}=(0,u.useScroll)(),n=(0,u.useTransform)(r,[0,.2,.4],[0,.4,1]),i=M[e.pathname.toLowerCase()]||"@my-react",{data:h,loading:j}=(0,m.useQuery)(x.GetStarCountDocument,{variables:{name:"MyReact",owner:"MrWangJustToDo"}});return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsxs)(l.Container,{maxWidth:f.R,paddingX:{base:"3",lg:"6"},children:[(0,d.jsx)(w,{}),(0,d.jsxs)(l.Flex,{paddingY:"2",justifyContent:"space-between",alignItems:"center",children:[(0,d.jsx)(l.Text,{as:"h1",fontSize:{base:"xl",md:"2xl"},fontWeight:{base:"semibold",md:"bold"},noOfLines:1,children:s({id:i})}),(0,d.jsxs)(l.HStack,{gap:{base:"4px",lg:"8px"},children:[(0,d.jsx)(l.Button,{variant:"ghost",size:"sm",onClick:()=>o((0,y.f2)()?"/MyReact/":"/"),children:"Home"}),(0,d.jsx)(l.Button,{variant:"ghost",size:"sm",onClick:()=>o((0,y.f2)()?"/MyReact/Blog":"/Blog"),children:"Example"}),(0,d.jsx)(k,{}),(0,d.jsxs)(l.Button,{variant:"outline",size:"sm",as:"a",href:"https://github.com/MrWangJustToDo/MyReact",target:"_blank",children:[(0,d.jsx)(l.Icon,{as:p.SiGithub}),j||t?null:(0,d.jsxs)(l.Tag,{variant:"subtle",colorScheme:"orange",marginLeft:"3",children:[(0,d.jsx)(l.TagLeftIcon,{as:g.FaStar,color:"orange.300"}),(0,d.jsx)(l.TagLabel,{children:h?.repository?.stargazerCount})]})]})]})]})]}),(0,d.jsx)(u.motion.div,{style:{opacity:n,borderBottom:"1px solid rgba(100, 100, 100, .2)"}})]})},T=(0,t.memo)(B);var R=s(1520);const S=()=>{const e=(0,c.UE)();return(0,d.jsx)(R.RemoveScroll,{enabled:e>0,className:"placeholder",as:"span",children:(0,d.jsx)(d.Fragment,{})})},F=e=>{const{id:o,head:s,body:r,foot:a,height:n,className:i,closeComplete:h,closeHandler:j,applyOverlay:m,isFirst:x}=e,g=(0,t.useRef)(!1),p=(0,t.useRef)(null),{height:b}=(0,c.iP)(),f=(0,u.useMotionValue)(0),y=(0,u.useTransform)(f,(e=>`translateX(2px) rotate(${e}deg)`)),v=(0,u.useTransform)(f,(e=>`translateX(-2px) rotate(${-1*e}deg)`)),k=(0,u.useMotionValue)(0),C=(0,t.useCallback)(((e,{delta:o})=>{const s=k.getVelocity();s>0&&f.set(10),s<0&&f.set(-10),k.set(Math.max(k.get()+o.y,0))}),[]),w=(0,t.useCallback)(((e,{velocity:o})=>{if(o.y>500)j&&j();else{const e=p.current,o=e?.getBoundingClientRect()?.height;k.get()/o>.6?j&&j():(0,u.animate)(k,0,{type:"spring",stiffness:300,damping:30,mass:.2}),f.set(0)}}),[f]),M=(0,l.useCallbackRef)((()=>{g.current?g.current&&h&&(h(),m(o,!1)):g.current=!0}));return(0,c.qR)((()=>(m(o,!0),()=>{m(o,!1)}))),(0,d.jsx)(l.Portal,{children:(0,d.jsx)(l.Box,{position:"fixed",left:"0",right:"0",top:"0",bottom:"0",overflow:"hidden",zIndex:"overlay",id:o,children:(0,d.jsxs)(u.motion.div,{drag:"y",dragElastic:0,onDrag:C,dragMomentum:!1,onDragEnd:w,dragConstraints:{bottom:0,top:0},style:{height:"100%",width:"100%",position:"absolute"},children:[(0,d.jsx)(l.Box,{position:"absolute",width:"100%",height:"100%",left:"0",right:"0",onClick:j}),(0,d.jsxs)(u.motion.div,{ref:p,style:{y:k,bottom:"0",width:"100%",display:"flex",overflow:"hidden",height:`${n}%`,position:"absolute",flexDirection:"column",borderRadius:"8px 8px 0 0",filter:"drop-shadow(0 0 0.75rem rgba(100, 100, 100, 0.35))",border:"1px solid var(--chakra-colors-cardBorderColor)"},initial:{y:b},animate:{y:0,transition:{type:"tween"}},exit:{y:b,transition:{type:"tween"}},className:i,onAnimationComplete:M,children:[(0,d.jsxs)(l.Box,{height:"25px",display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"mobileModalColor",children:[(0,d.jsx)(u.motion.span,{style:{width:"18px",height:"4px",borderRadius:"99px",transform:y,backgroundColor:"var(--chakra-colors-gray-300)"}}),(0,d.jsx)(l.Box,{width:"0.5"}),(0,d.jsx)(u.motion.span,{style:{width:"18px",height:"4px",borderRadius:"99px",transform:v,backgroundColor:"var(--chakra-colors-gray-300)"}})]}),(0,d.jsx)(l.Divider,{}),(0,d.jsx)(l.Box,{backgroundColor:"mobileModalColor",paddingX:"3.5",paddingY:"1.5",children:s}),(0,d.jsx)(l.Box,{flex:"1",enabled:!0,id:"modal-scroll-box",paddingX:"3.5",allowPinchZoom:!0,removeScrollBar:x,marginTop:"-1px",overflow:"auto",position:"relative",backgroundColor:"mobileModalColor",as:R.RemoveScroll,children:r}),(0,d.jsx)(l.Box,{backgroundColor:"mobileModalColor",padding:"3.5",paddingY:"1.5",children:a})]})]})})})},D=e=>{const{head:o,body:s,foot:t,showState:r,className:a,closeComplete:n,closeHandler:i}=e,c=(0,l.useBreakpointValue)({base:"full",lg:"3xl"});return(0,d.jsxs)(l.Modal,{size:c,isOpen:r,scrollBehavior:"inside",onClose:i,onCloseComplete:n,children:[(0,d.jsx)(l.ModalOverlay,{}),(0,d.jsxs)(l.ModalContent,{className:a,children:[o&&(0,d.jsx)(l.ModalHeader,{children:o}),(0,d.jsx)(l.ModalCloseButton,{}),(0,d.jsx)(l.ModalBody,{id:"modal-scroll-box",paddingTop:"0",children:s}),t&&(0,d.jsx)(l.ModalFooter,{children:t})]})]})},_=()=>{const{desktop:e}=(0,c.tl)();return(0,d.jsx)(d.Fragment,{children:e.map((e=>(0,d.jsx)(D,{...e},e.key)))})},z=()=>{const{mobile:e}=(0,c.tl)();return(0,d.jsx)(d.Fragment,{children:(0,d.jsx)(u.AnimatePresence,{children:e.map((e=>e.showState?(0,d.jsx)(F,{...e},e.key):null))})})},I=({children:e})=>{const{overlays:o,open:s,close:r}=(0,c.Zb)(),a=(0,l.useBreakpointValue)((0,t.useMemo)((()=>({base:{mobile:o,desktop:[]},md:{mobile:[],desktop:o}})),[o]));return(0,d.jsx)(c.XY.Provider,{value:a,children:(0,d.jsx)(c.Nq.Provider,{value:r,children:(0,d.jsxs)(c.hZ.Provider,{value:s,children:[e,(0,d.jsxs)(l.Portal,{children:[(0,d.jsx)(z,{}),(0,d.jsx)(_,{})]})]})})})};var L;let P=(0,s(1822).G9)((({relativePathname:e})=>({props:{title:e}})))(L=class extends t.Component{constructor(e){super(e),this.state={isMounted:!1},console.warn("create",this)}componentDidMount(){console.warn("mounted",this),this.setState({isMounted:!0})}componentWillUnmount(){console.warn("unmount",this)}UNSAFE_componentWillMount(){console.warn("willMount",this)}render(){console.warn("render",this);const{title:e}=this.props,{isMounted:o}=this.state;return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(r.Helmet,{title:(e.slice(1).toLowerCase()||"@my-react")+" | @my-react"}),(0,d.jsx)(S,{}),(0,d.jsxs)(I,{children:[(0,d.jsx)(l.Box,{id:"page-header",position:"sticky",top:"0",backgroundColor:o?"bannerBackgroundColor":void 0,zIndex:"banner",children:(0,d.jsx)(T,{})}),(0,d.jsx)("div",{id:"page-content",children:(0,d.jsx)(a.Outlet,{})}),(0,d.jsx)("div",{id:"page-footer",children:(0,d.jsx)(j,{})})]})]})}})||L},6737:(e,o,s)=>{s.d(o,{R:()=>l});const l=1580},1198:(e,o,s)=>{s.d(o,{s8:()=>t,u8:()=>r,xr:()=>l});const l="https://github.com/facebook/react/issues",t="react",r="facebook"}};