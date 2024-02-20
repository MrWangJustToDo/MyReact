"use strict";exports.id=792,exports.ids=[792],exports.modules={7066:(e,n,t)=>{t.d(n,{Z:()=>o});var r=t(8930),s=t(7358);const o=(0,r.forwardRef)((({children:e,...n},t)=>(0,s.jsx)(r.Box,{ref:t,border:"1px",boxShadow:"md",borderRadius:"md",borderColor:"cardBorderColor",backgroundColor:"cardBackgroundColor",...n,children:e})))},2418:(e,n,t)=>{t.r(n),t.d(n,{default:()=>Le,getInitialState:()=>Be,isStatic:()=>Te});var r=t(8930),s=t(6544);const o="drag-able-item",i="ignore-drag-able-item",a=(...e)=>{const n=e.filter(Boolean).filter((e=>"string"==typeof e)).map((e=>e.split(" "))).reduce(((e,n)=>(n.forEach((n=>e.add(n))),e)),new Set);return new Array(...n).join(" ")};var l=t(7066),d=t(7358);const c=(0,r.forwardRef)((({children:e,className:n,enableBlur:t=!0,contentProps:s,...c},x)=>(0,d.jsxs)(l.Z,{ref:x,...c,className:a(o,n),backgroundColor:{base:"mobileCardBackgroundColor",sm:"transparent"},backdropFilter:{base:"initial",sm:t?"blur(8px)":"initial"},children:[(0,d.jsx)(r.Flex,{justifyContent:"center",cursor:"move",children:(0,d.jsx)(r.Box,{as:"span",width:"8",height:"1",backgroundColor:"gray.300",borderRadius:"full",marginY:"2"})}),(0,d.jsx)(r.Divider,{marginBottom:"2"}),(0,d.jsx)(r.Box,{width:"100%",height:"calc(100% - var(--chakra-space-9))",sx:{scrollbarWidth:"none",scrollbarColor:"transparent"},...s,className:i,children:e})]})));var x=t(1050);const g=(0,x.WidthProvider)(x.Responsive),h=(0,r.styled)(g),m=x.Responsive;var u=t(5292),p=t(9114),j=t(9378),f=t(6689),b=t.n(f),v=t(255);const y=()=>{const e=(0,v.dD)(),n=(0,v.tm)(),{isOpen:t,onToggle:s,onClose:o}=(0,r.useDisclosure)();return(0,f.useEffect)((()=>{e&&o()}),[e,o]),!n||e?null:(0,d.jsxs)(r.Flex,{alignItems:"center",justifyContent:"center",children:[(0,d.jsx)(r.Button,{onClick:s,margin:"10px",children:"open"}),(0,d.jsxs)(r.Modal,{size:"4xl",isOpen:t,onClose:o,scrollBehavior:"inside",children:[(0,d.jsx)(r.ModalOverlay,{}),(0,d.jsxs)(r.ModalContent,{children:[(0,d.jsx)(r.ModalCloseButton,{}),(0,d.jsx)(r.ModalBody,{children:(0,d.jsx)("iframe",{title:"example",srcDoc:'\n            <!DOCTYPE html>\n            <html>\n              <head>\n                <meta charset="UTF-8" />\n                <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg==" crossorigin="anonymous" referrerpolicy="no-referrer" />\n                <link rel="stylesheet" href="./mine.css" />\n              </head>\n              <body>\n              <div class="container">\n                <div class="head">\n                <select class="select">\n                  <option selected disabled hidden>请选择</option>\n                  <option value="1">简单</option>\n                  <option value="2">中等</option>\n                  <option value="3">困难</option>\n                </select>\n                <nav class="tool">\n                  <div class="flag">\n                    <span></span>\n                    <span>00</span>\n                  </div>\n                  <div class="time">\n                    <span></span>\n                    <span>0000</span>\n                  </div>\n                </nav>\n                <nav class="close">\n                  <button><i class="fa fa-close"></i></button>\n                </nav>\n                </div>\n              </div>\n              <script src="./mine.js"><\/script>\n              </body>\n            </html>\n            ',height:"800px",width:"800px"})})]})]})]})};var w=t(322),S=t(1381),k=t.n(S);const C=(0,w.createReactive)({setup:()=>{const e=(0,w.ref)(0),n=(0,w.ref)(0),t=(0,w.reactive)({x:0,y:0}),r=k()((e=>(t.x=e.clientX,t.y=e.clientY)),20);(0,w.watch)((()=>t.x),(()=>n.value++));const s=(0,w.computed)((()=>"position.x has changed:"+n.value+" counts"));return(0,w.onMounted)((()=>{console.log("reactive mounted"),window.addEventListener("mousemove",r)})),(0,w.onUnmounted)((()=>{console.log("reactive unmount"),window.removeEventListener("mousemove",r)})),{reactiveObj:t,countRef:e,changeCount:n=>e.value=n,reactiveObjXChangeCount:s}},render:({reactiveObj:e,countRef:n,changeCount:t,reactiveObjXChangeCount:s})=>(0,d.jsxs)(r.VStack,{margin:"10px",spacing:"20px",children:[(0,d.jsx)(r.Heading,{children:"@my-react Reactive"}),(0,d.jsx)(r.Heading,{as:"h3",children:"count"}),(0,d.jsxs)(r.HStack,{spacing:"10px",children:[(0,d.jsx)(r.Code,{children:n}),(0,d.jsx)(r.Button,{onClick:()=>t(n+1),children:"add"}),(0,d.jsx)(r.Button,{onClick:()=>t(n-1),children:"del"})]}),(0,d.jsx)(r.Heading,{as:"h3",children:"position"}),(0,d.jsxs)(r.HStack,{children:[(0,d.jsxs)(r.Code,{children:["position x: ",e.x]}),(0,d.jsxs)(r.Code,{children:["position y: ",e.y]})]}),(0,d.jsx)(r.Code,{children:s})]})});var L=t(9847),B=t(382),T=t(3308),I=t(7507),R=t(9466),D=t(1635),z=t.n(D),O=(t(5468),t(8073)),H=t.n(O),M=t(4195),F=t.n(M);const W="undefined"!=typeof window?"client":"server";z().locale("zh-cn"),z().extend(F()),z().extend(H());const A=e=>{return"string"==typeof e&&(e=new Date(e)),e instanceof Date?z()(new Date).to(z()(e)):(n=`time parameter error : ${e}`,"error"=="error"&&(n instanceof Error?console.log(`[${W}]`,"[error]",n.stack):console.log(`[${W}]`,"[error]",n.toString())),z()().toNow());var n},N=(0,r.forwardRef)((({avatarUrl:e,login:n,time:t,avatarProps:s,children:o,...i},a)=>(0,d.jsxs)(r.Flex,{...i,ref:a,children:[(0,d.jsxs)(r.Flex,{alignItems:"center",width:"100%",children:[(0,d.jsx)(r.Avatar,{src:e,title:n,name:n,size:"sm",...s}),(0,d.jsxs)(r.Box,{marginLeft:"2",maxWidth:"200px",children:[(0,d.jsx)(r.Text,{fontWeight:"semibold",fontSize:"sm",noOfLines:1,children:n}),(0,d.jsx)(r.Text,{fontSize:"x-small",color:"lightTextColor",noOfLines:1,children:A(t)})]})]}),o]}))),E=(0,r.forwardRef)((({children:e,transform:n,...t},s)=>(0,d.jsx)(r.Box,{ref:s,position:"relative",transform:n,transformOrigin:"center",transition:"transform 0.2s",_hover:{transform:`scale(1.2, 1.2) ${n||""}`,zIndex:"1"},...t,children:e}))),U=({title:e,externalUrl:n,detailNumber:t})=>{const s=(0,T.useLocation)(),o=(0,T.useNavigate)();return(0,d.jsxs)(r.Flex,{justifyContent:"space-between",alignItems:"center",children:[(0,d.jsx)(r.Tooltip,{label:e,placement:"top",hasArrow:!0,children:(0,d.jsx)(r.Text,{fontSize:{base:"18",md:"20",lg:"22"},width:"85%",fontWeight:"medium",title:e,noOfLines:1,children:e})}),(0,d.jsx)(E,{display:"flex",alignItems:"center",children:(0,d.jsx)(r.IconButton,{"aria-label":"detail",onClick:()=>{const e=new URLSearchParams(s.search);e.append("overlay","open"),e.append("detailId",t+""),o(`${R.tE?"/Blog":"/MyReact/Blog"}?${e.toString()}`)},variant:"link",size:"sm",icon:(0,d.jsx)(r.Icon,{as:L.AiOutlineRight,userSelect:"none"})})}),(0,d.jsx)(E,{display:"flex",alignItems:"center",children:(0,d.jsx)(r.IconButton,{size:"sm",variant:"link","aria-label":"open",icon:(0,d.jsx)(r.Icon,{as:B.VscLinkExternal}),onClick:()=>window.open(n,"_blank")})})]})},_=e=>{const{title:n,number:t,body:s,publishedAt:o,author:i,url:a}=e,l=(0,f.useMemo)((()=>I.H9.render(s)),[s]);return(0,d.jsxs)(r.Flex,{flexDirection:"column",height:"100%",children:[(0,d.jsxs)(r.Box,{padding:"2",borderTopRadius:"md",children:[(0,d.jsx)(U,{title:n,externalUrl:a,detailNumber:t}),(0,d.jsx)(N,{avatarUrl:i?.avatarUrl,login:i?.login,time:o,marginTop:"2",alignItems:"center",avatarProps:{width:6,height:6}})]}),(0,d.jsx)(r.Divider,{}),(0,d.jsx)(r.Box,{className:"typo",overflow:{base:"hidden",lg:"auto"},padding:"2",fontSize:"sm",borderBottomRadius:"md",dangerouslySetInnerHTML:{__html:l}})]})},$={lg:4,md:3,sm:2,xs:1,xxs:1},{updateLayout:G,mergeLayout:Y}=v.sb.getActions(),P=({data:e})=>{const n=(0,v.X0)(e),t=(0,v.sb)((e=>e.data)),{width:r}=(0,v.hV)({cssSelector:".grid-card-list"});(0,f.useEffect)((()=>{Y(n)}),[n]);const s=(0,f.useMemo)((()=>{const e={};return Object.keys(n).forEach((r=>{const s=t[r]?.length>0;e[r]=[];const o=t[r]||[];n[r].forEach((n=>{const t=o.find((e=>e.i===n.i));t?e[r].push(t):s?e[r].push({...n,y:1/0}):e[r].push(n)}))})),e}),[n,t]);return 0===r?null:(0,d.jsx)(m,{width:r,layouts:s,cols:$,onLayoutChange:(e,n)=>{G(n)},rowHeight:10,draggableHandle:`.${o}`,draggableCancel:`.${i}`,children:e.map(((e,n)=>(0,d.jsx)(c,{children:(0,d.jsx)(_,{...e})},e.id+n)))})},Z=({data:e,disableGridLayout:n=!0})=>n?(0,d.jsxs)(r.SimpleGrid,{width:"100%",padding:"2",columns:{base:1,lg:2,xl:3},spacing:3,children:[(0,d.jsx)(l.Z,{children:(0,d.jsx)(C,{})}),(0,d.jsx)(l.Z,{children:(0,d.jsx)(y,{})}),e.map(((e,n)=>(0,d.jsx)(l.Z,{maxHeight:"96",children:(0,d.jsx)(_,{...e})},e.id+n)))]}):(console.log(e),(0,d.jsx)(P,{data:e})),X=(0,f.memo)(Z),Q=({error:e})=>{const n=(0,r.useToast)();return(0,f.useEffect)((()=>{n({title:"Get Blog Error",description:e.message,status:"error"})}),[e,n]),(0,d.jsx)(b().Fragment,{})};var V=t(143);const q=e=>{const{body:n,author:{login:t,avatarUrl:s},updatedAt:o}=e,i=(0,f.useMemo)((()=>I.B1.render(n)),[n]);return(0,d.jsxs)(l.Z,{marginY:"2",padding:"2",backgroundColor:"initial",children:[(0,d.jsx)(N,{avatarUrl:s,login:t,time:o,alignItems:"flex-end",avatarProps:{width:6,height:6}}),(0,d.jsx)(r.Box,{marginTop:"3.5",className:"typo",fontSize:"small",dangerouslySetInnerHTML:{__html:i}})]})},J=({data:e})=>(0,d.jsxs)(d.Fragment,{children:[e.length>0&&(0,d.jsx)(r.Divider,{marginY:"2"}),e.map((e=>(0,d.jsx)(q,{...e},e.id)))]}),K=({data:e,Render:n})=>n({data:e}),ee=({id:e,Render:n,RenderLoading:t})=>{const{data:o,loading:i,error:a,fetchMore:l,networkStatus:c}=(0,p.useQuery)(s.GetSingleBlogDocument,{variables:{name:V.s8,owner:V.u8,number:Number(e),first:15},skip:void 0===e,notifyOnNetworkStatusChange:!0}),x=(0,r.useCallbackRef)((()=>{o?.repository?.issue?.comments?.pageInfo?.hasNextPage&&l({variables:{after:o.repository.issue.comments.pageInfo.endCursor}})}),[]),g=(0,f.useMemo)((()=>(0,j.throttle)((e=>{const n=e.target;n&&n.scrollTop+n.clientHeight>=.85*n.scrollHeight&&x()}),500)),[x]);return(0,f.useEffect)((()=>{const e=document.querySelector("#modal-scroll-box");if(e)return e.addEventListener("scroll",g),()=>e.removeEventListener("scroll",g)}),[g]),i&&c!==p.NetworkStatus.fetchMore?t:a?(0,d.jsx)(Q,{error:a}):(0,d.jsx)(K,{data:o,Render:n})},ne=({id:e})=>(0,d.jsx)(ee,{id:e,RenderLoading:(0,d.jsx)(r.Box,{padding:"2",children:(0,d.jsx)(r.SkeletonText,{marginTop:"4",noOfLines:8})}),Render:({data:e})=>{const n=(0,f.useMemo)((()=>I.B1.render(e?.repository?.issue?.body||"")),[e]);return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsxs)(l.Z,{padding:"2",borderColor:"Highlight",backgroundColor:"initial",children:[(0,d.jsx)(N,{marginTop:"2",alignItems:"center",time:e?.repository?.issue?.publishedAt,login:e?.repository?.issue?.author?.login,avatarUrl:e?.repository?.issue?.author?.avatarUrl,avatarProps:{width:6,height:6}}),(0,d.jsx)(r.Box,{className:"typo",marginTop:"3.5",fontSize:{base:"sm",lg:"md"},dangerouslySetInnerHTML:{__html:n}})]}),(0,d.jsx)(J,{data:e.repository.issue.comments.nodes})]})}}),te=({id:e})=>(0,d.jsx)(ee,{id:e,RenderLoading:(0,d.jsxs)(r.Box,{padding:"2",children:[(0,d.jsx)(r.SkeletonText,{noOfLines:1,paddingRight:"6"}),(0,d.jsx)(r.SkeletonCircle,{marginY:"3"}),(0,d.jsx)(r.SkeletonText,{noOfLines:1,spacing:"4"})]}),Render:({data:e})=>{const n=(0,p.useApolloClient)();return(0,d.jsx)(r.Box,{paddingRight:"3em",children:(0,d.jsxs)(r.Text,{as:"h1",fontSize:{base:"lg",md:"xl",lg:"2xl"},children:[e?.repository?.issue?.title,(0,d.jsx)(E,{marginLeft:"2",display:"inline-flex",alignItems:"center",children:(0,d.jsx)(r.IconButton,{size:"sm",variant:"link","aria-label":"reload",onClick:()=>n.refetchQueries({include:[s.GetSingleBlogDocument]}),icon:(0,d.jsx)(r.Icon,{as:L.AiOutlineReload})})})]})})}}),re=()=>{const e=(0,T.useNavigate)(),{search:n}=(0,T.useLocation)(),t=(0,f.useMemo)((()=>new URLSearchParams(n||"")),[n]),r=(0,v.Jv)(),s=(0,v.rC)(),o=t.get("detailId"),i="open"===t.get("overlay");return(0,f.useEffect)((()=>{i&&void 0!==o?r({head:(0,d.jsx)(te,{id:o}),body:(0,d.jsx)(ne,{id:o}),closeComplete:()=>setTimeout((()=>{t.delete("detailId"),t.delete("overlay");const n=t.toString();e(`${R.tE?"/Blog":"/MyReact/Blog"}${n?"?"+n:""}`)}))}):s()}),[o,s,i,e,r,t]),(0,d.jsx)(b().Fragment,{})},se=(0,f.memo)(re),oe=()=>(0,d.jsx)(r.SimpleGrid,{columns:{base:1,md:2,lg:3},spacing:10,padding:"6",height:"100%",overflow:"hidden",children:[1,2,3,4,5].map((e=>(0,d.jsxs)(r.Box,{children:[(0,d.jsx)(r.SkeletonCircle,{marginY:"2"}),(0,d.jsx)(r.SkeletonText,{noOfLines:6,marginY:"2"})]},e)))}),ie={name:V.s8,owner:V.u8,orderBy:{field:s.IssueOrderField.CreatedAt,direction:s.OrderDirection.Desc}},ae=()=>{const e=(0,f.useRef)(),[n,t]=(0,f.useState)(!1),o=(0,r.useBreakpointValue)({base:!0,md:!1}),{data:i,loading:a,error:l,fetchMore:c,refetch:x,networkStatus:g}=(0,p.useQuery)(s.GetBlogListDocument,{variables:{...ie,first:15,states:s.IssueState.Open},notifyOnNetworkStatusChange:!0});(0,v.qR)(x);const h=(0,r.useCallbackRef)((()=>{i?.repository?.issues?.pageInfo?.hasNextPage&&c({variables:{after:i.repository.issues.pageInfo.endCursor}})}),[]),m=(0,f.useMemo)((()=>(0,j.throttle)((()=>{const n=e.current;n&&n.scrollTop+n.clientHeight>=.85*n.scrollHeight&&h()}),200)),[h]);return a&&g!==p.NetworkStatus.fetchMore?(0,d.jsx)(oe,{}):l?(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(Q,{error:l}),(0,d.jsx)(r.Portal,{children:(0,d.jsxs)(r.ButtonGroup,{variant:"solid",position:"fixed",bottom:"4",right:"4",className:"tour_buttons",children:[(0,d.jsx)(r.Button,{colorScheme:"facebook",textTransform:"capitalize",onClick:()=>x(),children:"refresh"}),(0,d.jsx)(r.Button,{colorScheme:"facebook",textTransform:"capitalize",display:{base:"none",lg:"block"},onClick:()=>t((e=>!e)),children:n?"enable gridLayout":"disable gridLayout"})]})})]}):(0,d.jsxs)(r.Flex,{flexDirection:"column",height:"100%",children:[(0,d.jsxs)(r.Box,{ref:e,overflow:"auto",paddingRight:"4",onScroll:m,className:"tour_blogList",children:[(0,d.jsx)(X,{data:i.repository.issues.nodes,disableGridLayout:n||o}),a&&i.repository.issues.nodes.length&&(0,d.jsx)(r.Center,{height:"100px",children:(0,d.jsx)(r.Spinner,{})})]}),(0,d.jsx)(r.Portal,{children:(0,d.jsxs)(r.ButtonGroup,{variant:"solid",position:"fixed",bottom:"4",right:"4",className:"tour_buttons",children:[(0,d.jsx)(r.Button,{colorScheme:"facebook",textTransform:"capitalize",onClick:()=>x(),children:"refresh"}),(0,d.jsx)(r.Button,{colorScheme:"facebook",textTransform:"capitalize",display:{base:"none",lg:"block"},onClick:()=>t((e=>!e)),children:n?"enable gridLayout":"disable gridLayout"})]})}),(0,d.jsx)(se,{})]})},le=(0,f.memo)(ae);var de=t(764),ce=t(7739),xe=t.n(ce);const ge=e=>{const{pinchRef:n,coverRef:t}=xe()();return(0,d.jsx)(r.Box,{ref:t,...e,children:(0,d.jsx)(r.AspectRatio,{ratio:220/35,children:(0,d.jsx)(r.Image,{ref:n,src:"https://ghchart.rshah.org/MrWangJustToDo",alt:"chart",cursor:"zoom-in",objectFit:"cover"})})})},he=({isFirst:e,name:n,email:t,avatarUrl:s,bioHTML:o})=>{const{isOpen:i,onOpen:a,onClose:l}=(0,r.useDisclosure)();return(0,d.jsx)(E,{children:(0,d.jsx)(r.Tooltip,{label:(0,d.jsxs)(r.VStack,{divider:(0,d.jsx)(r.StackDivider,{borderColor:"cardBorderColor"}),alignItems:"flex-start",spacing:"1",children:[(0,d.jsxs)(r.Flex,{alignItems:"center",width:"100%",children:[(0,d.jsx)(r.Icon,{as:L.AiOutlineUser}),(0,d.jsx)(r.Text,{fontWeight:"semibold",marginLeft:"1",noOfLines:1,children:n})]}),t&&(0,d.jsxs)(r.Flex,{alignItems:"center",width:"100%",children:[(0,d.jsx)(r.Icon,{as:L.AiOutlineMail}),(0,d.jsx)(r.Text,{marginLeft:"1",noOfLines:1,children:t})]}),o&&(0,d.jsx)(r.Box,{dangerouslySetInnerHTML:{__html:o}})]}),maxWidth:{base:"200px",md:"240px"},isOpen:i,borderRadius:"4",placement:"right",boxShadow:"md",offset:[0,8],hasArrow:!0,children:(0,d.jsx)(r.Avatar,{src:s,onTouchStart:a,onTouchEnd:l,onMouseEnter:a,onMouseLeave:l,border:"4px solid white",boxShadow:"md",marginTop:e?"0":"-3"})})})},me=({data:e})=>(0,d.jsx)(d.Fragment,{children:e.map((({login:e,name:n,avatarUrl:t,id:r,email:s,bioHTML:o},i)=>(0,d.jsx)(he,{id:r,isFirst:0===i,name:n||e,email:s,bioHTML:o,avatarUrl:t},r)))}),ue=(0,f.memo)(me),pe=()=>{const{data:e,loading:n}=(0,p.useQuery)(s.GetRepoAboutDocument,{variables:{owner:"mrwangjusttodo",name:"MrWangJustToDo.io"}});return(0,d.jsx)(l.Z,{backgroundColor:{base:"mobileCardBackgroundColor",sm:"transparent"},width:"100%",padding:"4px",paddingX:"6px",paddingBottom:"8px",_firstLetter:{fontSize:"2em"},boxShadow:"sm",children:(0,d.jsxs)(r.Link,{href:e?.repository?.url,target:"_blank",fontWeight:"500",textDecoration:"underline",children:[(0,d.jsx)(r.Text,{as:"span",children:"Blog"}),":"," ",(0,d.jsx)(r.SkeletonText,{isLoaded:!n,children:(0,d.jsx)(r.Text,{as:"span",color:"slategrey",children:e?.repository?.description})})]})})},je=()=>{const{data:e,loading:n}=(0,p.useQuery)(s.GetRepoAboutDocument,{variables:{owner:"mrwangjusttodo",name:"reactivity-store"}});return(0,d.jsx)(l.Z,{backgroundColor:{base:"mobileCardBackgroundColor",sm:"transparent"},width:"100%",padding:"4px",paddingX:"6px",paddingBottom:"8px",_firstLetter:{fontSize:"2em"},boxShadow:"sm",children:(0,d.jsxs)(r.Link,{href:e?.repository?.url,target:"_blank",fontWeight:"500",textDecoration:"underline",children:[(0,d.jsx)(r.Text,{as:"span",children:"RStore"}),":"," ",(0,d.jsx)(r.SkeletonText,{isLoaded:!n,children:(0,d.jsx)(r.Text,{as:"span",color:"slategrey",children:e?.repository?.description})})]})})},fe=()=>{const{data:e,loading:n}=(0,p.useQuery)(s.GetRepoAboutDocument,{variables:{owner:"mrwangjusttodo",name:"react-ssr-setup"}});return(0,d.jsx)(l.Z,{backgroundColor:{base:"mobileCardBackgroundColor",sm:"transparent"},width:"100%",padding:"4px",paddingX:"6px",paddingBottom:"8px",_firstLetter:{fontSize:"2em"},boxShadow:"sm",children:(0,d.jsxs)(r.Link,{href:e?.repository?.url,target:"_blank",fontWeight:"500",textDecoration:"underline",children:[(0,d.jsx)(r.Text,{as:"span",children:"SSR template"}),":"," ",(0,d.jsx)(r.SkeletonText,{isLoaded:!n,children:(0,d.jsx)(r.Text,{as:"span",color:"slategrey",children:e?.repository?.description})})]})})},be=()=>{const{data:e,loading:n}=(0,p.useQuery)(s.GetRepoAboutDocument,{variables:{owner:"mrwangjusttodo",name:"git-diff-view"}});return(0,d.jsx)(l.Z,{backgroundColor:{base:"mobileCardBackgroundColor",sm:"transparent"},width:"100%",padding:"4px",paddingX:"6px",paddingBottom:"8px",_firstLetter:{fontSize:"2em"},boxShadow:"sm",children:(0,d.jsxs)(r.Link,{href:e?.repository?.url,target:"_blank",fontWeight:"500",textDecoration:"underline",children:[(0,d.jsx)(r.Text,{as:"span",children:"Git-diff-view"}),":"," ",(0,d.jsx)(r.SkeletonText,{isLoaded:!n,children:(0,d.jsx)(r.Text,{as:"span",color:"slategrey",children:e?.repository?.description})})]})})},ve=()=>(0,d.jsxs)(r.Box,{padding:"3",children:[(0,d.jsx)(r.SkeletonCircle,{}),(0,d.jsx)(r.Skeleton,{marginY:"2"}),(0,d.jsx)(r.SkeletonText,{noOfLines:6,marginY:"2"})]}),ye=()=>{const{data:e,loading:n,error:t,refetch:o}=(0,p.useQuery)(s.GetViewerDocument,{variables:{first:10}});return(0,v.qR)(o),n?(0,d.jsx)(ve,{}):t?(0,d.jsx)(Q,{error:t}):(0,d.jsxs)(r.Flex,{flexDirection:"column",padding:"3",height:{md:"100%"},className:"tour_about",children:[(0,d.jsx)(r.Flex,{padding:"2",alignItems:"flex-end",children:(0,d.jsx)(r.Avatar,{name:e.viewer.name,src:e.viewer.avatarUrl,size:"xl",children:(0,d.jsx)(r.AvatarBadge,{bg:"green.500",boxSize:"0.8em"})})}),(0,d.jsx)(ge,{marginY:"2",className:"tour_commit"}),(0,d.jsx)(r.Divider,{marginY:"2"}),(0,d.jsxs)(r.HStack,{divider:(0,d.jsx)(r.StackDivider,{}),spacing:"2",children:[(0,d.jsx)(r.IconButton,{as:"a",color:"gray",variant:"outline","aria-label":"github",href:"https://github.com/MrWangJustToDo/",icon:(0,d.jsx)(r.Icon,{as:L.AiOutlineGithub,fontSize:"xl"})}),(0,d.jsx)(r.IconButton,{as:"a",color:"gray",variant:"outline","aria-label":"leetcode",href:"https://leetcode.com/MrWangSay/",icon:(0,d.jsx)(r.Icon,{as:de.SiLeetcode,fontSize:"xl"})})]}),(0,d.jsxs)(r.Box,{fontSize:"sm",marginY:"2",children:[(0,d.jsx)(r.Text,{fontWeight:"semibold",children:"Recommend:"}),(0,d.jsxs)(r.VStack,{divider:(0,d.jsx)(r.StackDivider,{}),spacing:"2",marginTop:"1",children:[(0,d.jsx)(je,{}),(0,d.jsx)(pe,{}),(0,d.jsx)(fe,{}),(0,d.jsx)(be,{})]})]}),(0,d.jsxs)(r.Flex,{alignItems:"center",marginTop:"1",children:[(0,d.jsx)(r.Icon,{as:L.AiOutlineUser}),(0,d.jsx)(r.Text,{fontSize:"small",marginLeft:"2",children:e.viewer.login})]}),(0,d.jsxs)(r.Flex,{alignItems:"center",marginTop:"1",color:"lightTextColor",children:[(0,d.jsx)(r.Icon,{as:L.AiOutlineMail}),(0,d.jsx)(r.Text,{fontSize:"small",marginLeft:"2",children:e.viewer.email})]}),(0,d.jsx)(r.Text,{fontSize:"x-small",marginY:"1",children:A(e.viewer.createdAt)}),(0,d.jsx)(r.Divider,{marginY:"2"}),(0,d.jsx)(r.Flex,{overflow:{md:"auto"},flexDirection:"column",children:(0,d.jsxs)(r.Flex,{justifyContent:"space-between",marginBottom:"2",children:[(0,d.jsxs)(r.Flex,{flexDirection:"column",alignItems:"center",children:[(0,d.jsx)(r.Flex,{alignItems:"center",marginBottom:"3",children:(0,d.jsx)(r.Text,{textTransform:"capitalize",fontSize:"sm",children:"followers :"})}),(0,d.jsx)(ue,{data:e.viewer.followers.nodes})]}),(0,d.jsxs)(r.Flex,{flexDirection:"column",alignItems:"center",children:[(0,d.jsx)(r.Flex,{alignItems:"center",marginBottom:"3",children:(0,d.jsx)(r.Text,{textTransform:"capitalize",fontSize:"sm",children:"following :"})}),(0,d.jsx)(ue,{data:e.viewer.following.nodes})]})]})})]})},we=(0,f.memo)(ye),Se=(0,t(658).createState)((()=>({drag:!1})),{withActions:e=>({onDragStart:()=>e.drag=!0,onDragEnd:()=>e.drag=!1}),withNamespace:"useMainCard"}),ke={lg:12,md:12,sm:12,xs:2,xxs:2},Ce={lg:[{i:"a",x:0,y:0,w:3,h:50,minW:2,maxW:5,minH:25},{i:"b",x:3,y:0,w:9,h:50,minW:6,minH:50}],md:[{i:"a",x:0,y:0,w:4,h:40,minW:2,maxW:6,minH:20},{i:"b",x:4,y:0,w:8,h:40,minW:6,minH:40}],sm:[{i:"a",x:0,y:0,w:5,h:40,minW:2,maxW:8,minH:15},{i:"b",x:5,y:0,w:7,h:40,minW:6,minH:40}],xs:[{i:"a",x:0,y:0,w:2,h:30,minW:1,minH:10,static:!0},{i:"b",x:2,y:0,w:2,h:30,minW:2,minH:30,static:!0}],xxs:[{i:"a",x:0,y:0,w:2,h:30,minW:2,minH:10,static:!0},{i:"b",x:2,y:0,w:2,h:30,minW:2,minH:30,static:!0}]},Le=()=>{const{drag:e,onDragEnd:n,onDragStart:t}=Se();return(0,d.jsx)(r.Container,{maxWidth:u.R,children:(0,d.jsxs)(h,{className:"layout",cols:ke,position:"relative",layouts:Ce,rowHeight:10,draggableHandle:`.${o}`,draggableCancel:`.${i}`,onDragStart:t,onDragStop:n,children:[(0,d.jsx)(c,{contentProps:{overflow:"auto"},children:(0,d.jsx)(we,{})},"a"),(0,d.jsx)(c,{className:"grid-card-list",enableBlur:e,children:(0,d.jsx)(le,{})},"b")]})})},Be=async()=>{},Te=!0},7507:(e,n,t)=>{t.d(n,{B1:()=>O,H9:()=>H});var r=t(9653),s=t.n(r),o=t(2145),i=t.n(o),a=t(6780),l=t.n(a),d=t(9169),c=t.n(d),x=t(2767),g=t.n(x),h=t(7985),m=t.n(h),u=t(5356),p=t.n(u),j=t(2067),f=t.n(j),b=t(1570),v=t.n(b),y=t(2441),w=t.n(y),S=t(1927),k=t.n(S),C=t(5519),L=t.n(C),B=t(373),T=t.n(B),I=t(9372),R=t.n(I);i().registerLanguage("css",c()),i().registerLanguage("json",p()),i().registerLanguage("java",g()),i().registerLanguage("bash",l()),i().registerLanguage("markdown",v()),i().registerLanguage("javascript",m()),i().registerLanguage("typescript",T()),i().registerLanguage("less",f()),i().registerLanguage("scss",w()),i().registerLanguage("shell",k()),i().registerLanguage("xml",R()),i().registerLanguage("sql",L());const D=i(),z=new(s()),O=new(s())({html:!0,xhtmlOut:!0,breaks:!0,highlight:function(e,n){let t="";try{t=n&&D.getLanguage(n)?D.highlight(e,{language:n,ignoreIllegals:!0}).value:D.highlightAuto(e,["typescript","javascript","xml","scss","less","json","bash"]).value;const r=t.split(/\n/).slice(0,-1),s=String(r.length).length-.2;return`<pre class="rounded position-relative"><code class="hljs ${n}" style='padding-top: 30px;'>${r.reduce(((e,n,t)=>`${e}<span class='no-select code-num d-inline-block text-center border-right pr-2 mr-2 border-dark' style='min-width: ${s}em; line-height: 1.5'>${t+1}</span>${n}\n`),`<div class='w-100 position-absolute' style='left: 0; top: 0; font-size: 0px'>\n          <b class='no-select position-absolute text-info' style='left: 10px; font-size: 12px; top: 4px;'>${n}</b>\n          <div class='position-absolute w-100 border-bottom border-dark' style='left: 0; top: 24px;'></div>\n        </div>`)}</code></pre>`}catch(e){}}}),H=new(s())({html:!0,xhtmlOut:!0,breaks:!0,highlight:function(e,n){if(n&&D.getLanguage(n))try{return`<pre class="rounded bg-dark"><code class="bg-dark hljs ${n}">${D.highlight(e,{language:n,ignoreIllegals:!0}).value}</code></pre>`}catch(e){}return`<pre class="rounded bg-dark"><code class="bg-dark hljs">${z.utils.escapeHtml(e)}</code></pre>`}})}};