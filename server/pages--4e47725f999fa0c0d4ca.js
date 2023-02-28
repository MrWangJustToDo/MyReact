"use strict";exports.id=617,exports.ids=[617],exports.modules={4212:(e,n,r)=>{r.d(n,{R:()=>t});const t=1580},6212:(e,n,r)=>{r.d(n,{s8:()=>s,u8:()=>i,xr:()=>t});const t="https://github.com/facebook/react/issues",s="react",i="facebook"},4491:(e,n,r)=>{r.r(n),r.d(n,{default:()=>Xe,isStatic:()=>Ze});var t=r(8930);const s="drag-able-item",i="ignore-drag-able-item",o=(...e)=>{const n=e.filter(Boolean).filter((e=>"string"==typeof e)).map((e=>e.split(" "))).reduce(((e,n)=>(n.forEach((n=>e.add(n))),e)),new Set);return new Array(...n).join(" ")};var a=r(3920);const l=(0,t.forwardRef)((({children:e,...n},r)=>(0,a.jsx)(t.Box,{ref:r,border:"1px",boxShadow:"md",borderRadius:"md",borderColor:"cardBorderColor",backgroundColor:"cardBackgroundColor",...n,children:e}))),c=(0,t.forwardRef)((({children:e,className:n,contentProps:r,...c},d)=>(0,a.jsxs)(l,{ref:d,...c,className:o(s,n),backgroundColor:{base:"mobileCardBackgroundColor",sm:"transparent"},backdropFilter:{base:"initial",sm:"blur(8px)"},children:[(0,a.jsx)(t.Flex,{justifyContent:"center",cursor:"move",children:(0,a.jsx)(t.Box,{as:"span",width:"8",height:"1",backgroundColor:"gray.300",borderRadius:"full",marginY:"2"})}),(0,a.jsx)(t.Divider,{marginBottom:"2"}),(0,a.jsx)(t.Box,{width:"100%",height:"calc(100% - var(--chakra-space-9))",sx:{scrollbarWidth:"none",scrollbarColor:"transparent"},...r,className:i,children:e})]})));var d=r(1050);const x=(0,d.WidthProvider)(d.Responsive),g=(0,t.styled)(x),m=d.Responsive;var h=r(4212),u=r(9114),p=r(6544),j=r(9378),f=r(6689),b=r.n(f),v=r(5263);const y=()=>{const e=(0,v.dD)(),n=(0,v.tm)(),{isOpen:r,onOpen:s,onClose:i}=(0,t.useDisclosure)();return(0,f.useEffect)((()=>{e&&i()}),[e,i]),!n||e?null:(0,a.jsxs)(t.Flex,{alignItems:"center",justifyContent:"center",children:[(0,a.jsx)(t.Button,{onClick:s,margin:"10px",children:"open"}),(0,a.jsxs)(t.Modal,{size:"4xl",isOpen:r,onClose:i,scrollBehavior:"inside",children:[(0,a.jsx)(t.ModalOverlay,{}),(0,a.jsxs)(t.ModalContent,{children:[(0,a.jsx)(t.ModalCloseButton,{}),(0,a.jsx)(t.ModalBody,{children:(0,a.jsx)("iframe",{title:"example",srcDoc:'\n            <!DOCTYPE html>\n            <html>\n              <head>\n                <meta charset="UTF-8" />\n                <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg==" crossorigin="anonymous" referrerpolicy="no-referrer" />\n                <link rel="stylesheet" href="./mine.css" />\n              </head>\n              <body>\n              <div class="container">\n                <div class="head">\n                <select class="select">\n                  <option selected disabled hidden>请选择</option>\n                  <option value="1">简单</option>\n                  <option value="2">中等</option>\n                  <option value="3">困难</option>\n                </select>\n                <nav class="tool">\n                  <div class="flag">\n                    <span></span>\n                    <span>00</span>\n                  </div>\n                  <div class="time">\n                    <span></span>\n                    <span>0000</span>\n                  </div>\n                </nav>\n                <nav class="close">\n                  <button><i class="fa fa-close"></i></button>\n                </nav>\n                </div>\n              </div>\n              <script src="./mine.js"><\/script>\n              </body>\n            </html>\n            ',height:"800px",width:"800px"})})]})]})]})};var w=r(7496),k=r(1381),S=r.n(k);const{onMounted:C,onUnmounted:L,reactiveApi:B}=w.__my_react_reactive__,{reactive:T,ref:I}=B,R=(0,w.createReactive)({name:"testReactive",setup:()=>{const e=I(0),n=T({x:0,y:0}),r=S()((e=>(n.x=e.clientX,n.y=e.clientY)),20);return C((()=>{console.log("reactive mounted"),window.addEventListener("mousemove",r)})),L((()=>{console.log("reactive unmount"),window.removeEventListener("mousemove",r)})),{reactiveObj:n,countRef:e,changeCount:n=>e.value=n}},render:({reactiveObj:e,countRef:n,changeCount:r})=>(0,a.jsxs)(t.VStack,{margin:"10px",spacing:"20px",children:[(0,a.jsx)(t.Heading,{children:"@my-react Reactive"}),(0,a.jsx)(t.Heading,{as:"h3",children:"count"}),(0,a.jsxs)(t.HStack,{spacing:"10px",children:[(0,a.jsx)(t.Code,{children:n}),(0,a.jsx)(t.Button,{onClick:()=>r(n+1),children:"add"}),(0,a.jsx)(t.Button,{onClick:()=>r(n-1),children:"del"})]}),(0,a.jsx)(t.Heading,{as:"h3",children:"position"}),(0,a.jsxs)(t.HStack,{children:[(0,a.jsxs)(t.Code,{children:["position x: ",e.x]}),(0,a.jsxs)(t.Code,{children:["position y: ",e.y]})]})]})});var M=r(9847),H=r(382),z=r(3308),O=r(9653),F=r.n(O),D=r(2145),W=r.n(D),N=r(9169),U=r.n(N),A=r(2767),$=r.n(A),_=r(7985),Y=r.n(_),E=r(5356),P=r.n(E),G=r(2067),J=r.n(G),V=r(2441),Q=r.n(V),q=r(1927),X=r.n(q),Z=r(5519),K=r.n(Z),ee=r(373),ne=r.n(ee),re=r(9372),te=r.n(re);W().registerLanguage("css",U()),W().registerLanguage("json",P()),W().registerLanguage("java",$()),W().registerLanguage("javascript",Y()),W().registerLanguage("typescript",ne()),W().registerLanguage("less",J()),W().registerLanguage("scss",Q()),W().registerLanguage("shell",X()),W().registerLanguage("xml",te()),W().registerLanguage("sql",K());const se=W(),ie=new(F()),oe=new(F())({html:!0,xhtmlOut:!0,breaks:!0,highlight:function(e,n){if(n&&se.getLanguage(n))try{const r=se.highlight(e,{language:n,ignoreIllegals:!0}).value.split(/\n/).slice(0,-1),t=String(r.length).length-.2;return`<pre class="rounded position-relative"><code class="hljs ${n}" style='padding-top: 30px;'>${r.reduce(((e,n,r)=>`${e}<span class='d-inline-block text-center border-right pr-2 mr-2 border-dark' style='min-width: ${t}em; line-height: 1.5'>${r+1}</span>${n}\n`),`<div class='w-100 position-absolute' style='left: 0; top: 0; font-size: 0px'>\n            <b class='position-absolute text-info' style='left: 10px; font-size: 12px; top: 4px;'>${n}</b>\n            <div class='position-absolute w-100 border-bottom border-dark' style='left: 0; top: 24px;'></div>\n          </div>`)}</code></pre>`}catch(e){}return'<pre class="rounded"><code class="hljs">'+ie.utils.escapeHtml(e)+"</code></pre>"}}),ae=new(F())({html:!0,xhtmlOut:!0,breaks:!0,highlight:function(e,n){if(n&&se.getLanguage(n))try{return`<pre class="rounded bg-dark"><code class="bg-dark hljs ${n}">${se.highlight(e,{language:n,ignoreIllegals:!0}).value}</code></pre>`}catch(e){}return`<pre class="rounded bg-dark"><code class="bg-dark hljs">${ie.utils.escapeHtml(e)}</code></pre>`}});var le=r(329),ce=r(1635),de=r.n(ce),xe=(r(5468),r(8073)),ge=r.n(xe),me=r(4195),he=r.n(me);const ue="undefined"!=typeof window?"client":"server";de().locale("zh-cn"),de().extend(he()),de().extend(ge());const pe=e=>{return"string"==typeof e&&(e=new Date(e)),e instanceof Date?de()(new Date).to(de()(e)):(n=`time parameter error : ${e}`,"error"=="error"&&(n instanceof Error?console.log(`[${ue}]`,"[error]",n.stack):console.log(`[${ue}]`,"[error]",n.toString())),de()().toNow());var n},je=(0,t.forwardRef)((({avatarUrl:e,login:n,time:r,avatarProps:s,children:i,...o},l)=>(0,a.jsxs)(t.Flex,{...o,ref:l,children:[(0,a.jsxs)(t.Flex,{alignItems:"center",width:"100%",children:[(0,a.jsx)(t.Avatar,{src:e,title:n,name:n,size:"sm",...s}),(0,a.jsxs)(t.Box,{marginLeft:"2",maxWidth:"200px",children:[(0,a.jsx)(t.Text,{fontWeight:"semibold",fontSize:"sm",noOfLines:1,children:n}),(0,a.jsx)(t.Text,{fontSize:"x-small",color:"lightTextColor",noOfLines:1,children:pe(r)})]})]}),i]}))),fe=(0,t.forwardRef)((({children:e,transform:n,...r},s)=>(0,a.jsx)(t.Box,{ref:s,position:"relative",transform:n,transformOrigin:"center",transition:"transform 0.2s",_hover:{transform:`scale(1.2, 1.2) ${n||""}`,zIndex:"1"},...r,children:e}))),be=({title:e,externalUrl:n,detailNumber:r})=>{const s=(0,z.useLocation)(),i=(0,z.useNavigate)();return(0,a.jsxs)(t.Flex,{justifyContent:"space-between",alignItems:"center",children:[(0,a.jsx)(t.Text,{fontSize:{base:"18",md:"20",lg:"22"},width:"85%",fontWeight:"medium",title:e,noOfLines:1,children:e}),(0,a.jsx)(fe,{display:"flex",alignItems:"center",children:(0,a.jsx)(t.IconButton,{"aria-label":"detail",onClick:()=>{const e=new URLSearchParams(s.search);e.append("overlay","open"),e.append("detailId",r+""),i(`${(0,le.f2)()?"/MyReact/":"/"}?${e.toString()}`)},variant:"link",size:"sm",icon:(0,a.jsx)(t.Icon,{as:M.AiOutlineRight,userSelect:"none"})})}),(0,a.jsx)(fe,{display:"flex",alignItems:"center",children:(0,a.jsx)(t.IconButton,{size:"sm",variant:"link","aria-label":"open",icon:(0,a.jsx)(t.Icon,{as:H.VscLinkExternal}),onClick:()=>window.open(n,"_blank")})})]})},ve=e=>{const{title:n,number:r,body:s,publishedAt:i,author:o,url:l}=e,c=(0,f.useMemo)((()=>ae.render(s)),[s]);return(0,a.jsxs)(t.Flex,{flexDirection:"column",height:"100%",children:[(0,a.jsxs)(t.Box,{padding:"2",backgroundColor:"cardBackgroundColor",borderTopRadius:"md",children:[(0,a.jsx)(be,{title:n,externalUrl:l,detailNumber:r}),(0,a.jsx)(je,{avatarUrl:o?.avatarUrl,login:o?.login,time:i,marginTop:"2",alignItems:"center",avatarProps:{width:6,height:6}})]}),(0,a.jsx)(t.Divider,{}),(0,a.jsx)(t.Box,{className:"typo",overflow:{base:"hidden",lg:"auto"},padding:"2",fontSize:"sm",borderBottomRadius:"md",backgroundColor:"cardBackgroundColor",dangerouslySetInnerHTML:{__html:c}})]})},ye={lg:3,md:3,sm:2,xs:1,xxs:1},we=({data:e})=>{const n=(0,v.X0)(e),{width:r}=(0,v.hV)({cssSelector:".grid-card-list"});return 0===r?null:(0,a.jsx)(m,{width:r,layouts:n,cols:ye,rowHeight:10,draggableHandle:`.${s}`,draggableCancel:`.${i}`,children:e.map(((e,n)=>(0,a.jsx)(c,{children:(0,a.jsx)(ve,{...e})},e.id+n)))})},ke=({data:e,disableGridLayout:n=!0})=>n?(0,a.jsxs)(t.SimpleGrid,{width:"100%",padding:"2",columns:{base:1,lg:2,xl:3},spacing:3,children:[(0,a.jsx)(l,{children:(0,a.jsx)(R,{})}),(0,a.jsx)(l,{children:(0,a.jsx)(y,{})}),e.map(((e,n)=>(0,a.jsx)(l,{maxHeight:"96",children:(0,a.jsx)(ve,{...e})},e.id+n)))]}):(0,a.jsx)(we,{data:e}),Se=(0,f.memo)(ke),Ce=({error:e})=>{const n=(0,t.useToast)();return(0,f.useEffect)((()=>{n({title:"Get Blog Error",description:e.message,status:"error"})}),[e,n]),(0,a.jsx)(b().Fragment,{})};var Le=r(6212);const Be=e=>{const{body:n,author:{login:r,avatarUrl:s},updatedAt:i}=e,o=(0,f.useMemo)((()=>oe.render(n)),[n]);return(0,a.jsxs)(l,{marginY:"2",padding:"2",backgroundColor:"initial",children:[(0,a.jsx)(je,{avatarUrl:s,login:r,time:i,alignItems:"flex-end",avatarProps:{width:6,height:6}}),(0,a.jsx)(t.Box,{marginTop:"3.5",className:"typo",fontSize:"small",dangerouslySetInnerHTML:{__html:o}})]})},Te=({data:e})=>(0,a.jsxs)(a.Fragment,{children:[e.length>0&&(0,a.jsx)(t.Divider,{marginY:"2"}),e.map((e=>(0,a.jsx)(Be,{...e},e.id)))]}),Ie=({data:e,Render:n})=>n({data:e}),Re=({id:e,Render:n,RenderLoading:r})=>{const{data:s,loading:i,error:o,fetchMore:l,networkStatus:c}=(0,u.useQuery)(p.GetSingleBlogDocument,{variables:{name:Le.s8,owner:Le.u8,number:Number(e),first:15},skip:void 0===e,notifyOnNetworkStatusChange:!0}),d=(0,t.useCallbackRef)((()=>{s?.repository?.issue?.comments?.pageInfo?.hasNextPage&&l({variables:{after:s.repository.issue.comments.pageInfo.endCursor}})}),[]),x=(0,f.useMemo)((()=>(0,j.throttle)((e=>{const n=e.target;n&&n.scrollTop+n.clientHeight>=.85*n.scrollHeight&&d()}),500)),[d]);return(0,f.useEffect)((()=>{const e=document.querySelector("#modal-scroll-box");if(e)return e.addEventListener("scroll",x),()=>e.removeEventListener("scroll",x)}),[x]),i&&c!==u.NetworkStatus.fetchMore?r:o?(0,a.jsx)(Ce,{error:o}):(0,a.jsx)(Ie,{data:s,Render:n})},Me=({id:e})=>(0,a.jsx)(Re,{id:e,RenderLoading:(0,a.jsx)(t.Box,{padding:"2",children:(0,a.jsx)(t.SkeletonText,{marginTop:"4",noOfLines:8})}),Render:({data:e})=>{const n=(0,f.useMemo)((()=>oe.render(e?.repository?.issue?.body||"")),[e]);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(l,{padding:"2",borderColor:"Highlight",backgroundColor:"initial",children:[(0,a.jsx)(je,{marginTop:"2",alignItems:"center",time:e?.repository?.issue?.publishedAt,login:e?.repository?.issue?.author?.login,avatarUrl:e?.repository?.issue?.author?.avatarUrl,avatarProps:{width:6,height:6}}),(0,a.jsx)(t.Box,{className:"typo",marginTop:"3.5",fontSize:{base:"sm",lg:"md"},dangerouslySetInnerHTML:{__html:n}})]}),(0,a.jsx)(Te,{data:e.repository.issue.comments.nodes})]})}}),He=({id:e})=>(0,a.jsx)(Re,{id:e,RenderLoading:(0,a.jsxs)(t.Box,{padding:"2",children:[(0,a.jsx)(t.SkeletonText,{noOfLines:1,paddingRight:"6"}),(0,a.jsx)(t.SkeletonCircle,{marginY:"3"}),(0,a.jsx)(t.SkeletonText,{noOfLines:1,spacing:"4"})]}),Render:({data:e})=>{const n=(0,u.useApolloClient)();return(0,a.jsx)(t.Box,{paddingRight:"3em",children:(0,a.jsxs)(t.Text,{as:"h1",fontSize:{base:"lg",md:"xl",lg:"2xl"},children:[e?.repository?.issue?.title,(0,a.jsx)(fe,{marginLeft:"2",display:"inline-flex",alignItems:"center",children:(0,a.jsx)(t.IconButton,{size:"sm",variant:"link","aria-label":"reload",onClick:()=>n.refetchQueries({include:[p.GetSingleBlogDocument]}),icon:(0,a.jsx)(t.Icon,{as:M.AiOutlineReload})})})]})})}}),ze=()=>{const e=(0,z.useNavigate)(),{search:n}=(0,z.useLocation)(),r=(0,f.useMemo)((()=>new URLSearchParams(n||"")),[n]),t=(0,v.Jv)(),s=(0,v.rC)(),i=r.get("detailId"),o="open"===r.get("overlay");return(0,f.useEffect)((()=>{o&&void 0!==i?t({head:(0,a.jsx)(He,{id:i}),body:(0,a.jsx)(Me,{id:i}),closeComplete:()=>{r.delete("detailId"),r.delete("overlay");const n=r.toString();e(`${(0,le.f2)()?"/MyReact/":"/"}${n?"?"+n:""}`)}}):s()}),[i,s,o,e,t,r]),(0,a.jsx)(b().Fragment,{})},Oe=(0,f.memo)(ze),Fe=()=>(0,a.jsx)(t.SimpleGrid,{columns:{base:1,md:2,lg:3},spacing:10,padding:"6",height:"100%",overflow:"hidden",children:[1,2,3,4,5].map((e=>(0,a.jsxs)(t.Box,{children:[(0,a.jsx)(t.SkeletonCircle,{marginY:"2"}),(0,a.jsx)(t.SkeletonText,{noOfLines:6,marginY:"2"})]},e)))}),De={name:Le.s8,owner:Le.u8,orderBy:{field:p.IssueOrderField.CreatedAt,direction:p.OrderDirection.Desc}},We=()=>{const e=(0,f.useRef)(),[n,r]=(0,f.useState)(!0),s=(0,t.useBreakpointValue)({base:!0,md:!1}),{data:i,loading:o,error:l,fetchMore:c,refetch:d,networkStatus:x}=(0,u.useQuery)(p.GetBlogListDocument,{variables:{...De,first:15},notifyOnNetworkStatusChange:!0}),g=(0,t.useCallbackRef)((()=>{i?.repository?.issues?.pageInfo?.hasNextPage&&c({variables:{after:i.repository.issues.pageInfo.endCursor}})}),[]),m=(0,f.useMemo)((()=>(0,j.throttle)((()=>{const n=e.current;n&&n.scrollTop+n.clientHeight>=.85*n.scrollHeight&&g()}),200)),[g]);return o&&x!==u.NetworkStatus.fetchMore?(0,a.jsx)(Fe,{}):l?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(Ce,{error:l}),(0,a.jsx)(t.Portal,{children:(0,a.jsxs)(t.ButtonGroup,{variant:"solid",position:"fixed",bottom:"4",right:"4",className:"tour_buttons",children:[(0,a.jsx)(t.Button,{color:"purple.500",textTransform:"capitalize",onClick:()=>d(),children:"refresh"}),(0,a.jsx)(t.Button,{color:"purple.500",textTransform:"capitalize",display:{base:"none",lg:"block"},onClick:()=>r((e=>!e)),children:n?"enable gridLayout":"disable gridLayout"})]})})]}):(0,a.jsxs)(t.Flex,{flexDirection:"column",height:"100%",children:[(0,a.jsxs)(t.Box,{ref:e,overflow:"auto",paddingRight:"4",onScroll:m,className:"tour_blogList",children:[(0,a.jsx)(Se,{data:i.repository.issues.nodes,disableGridLayout:n||s}),o&&i.repository.issues.nodes.length&&(0,a.jsx)(t.Center,{height:"100px",children:(0,a.jsx)(t.Spinner,{})})]}),(0,a.jsx)(t.Portal,{children:(0,a.jsxs)(t.ButtonGroup,{variant:"solid",position:"fixed",bottom:"4",right:"4",className:"tour_buttons",children:[(0,a.jsx)(t.Button,{color:"purple.500",textTransform:"capitalize",onClick:()=>d(),children:"refresh"}),(0,a.jsx)(t.Button,{color:"purple.500",textTransform:"capitalize",display:{base:"none",lg:"block"},onClick:()=>r((e=>!e)),children:n?"enable gridLayout":"disable gridLayout"})]})}),(0,a.jsx)(Oe,{})]})},Ne=(0,f.memo)(We);var Ue=r(764),Ae=r(7739),$e=r.n(Ae);const _e=e=>{const{pinchRef:n,coverRef:r}=$e()();return(0,a.jsx)(t.Box,{ref:r,...e,children:(0,a.jsx)(t.AspectRatio,{ratio:220/35,children:(0,a.jsx)(t.Image,{ref:n,src:"https://ghchart.rshah.org/MrWangJustToDo",alt:"chart",cursor:"zoom-in",objectFit:"cover"})})})},Ye=({isFirst:e,name:n,email:r,avatarUrl:s,bioHTML:i})=>{const{isOpen:o,onOpen:l,onClose:c}=(0,t.useDisclosure)();return(0,a.jsx)(fe,{children:(0,a.jsx)(t.Tooltip,{label:(0,a.jsxs)(t.VStack,{divider:(0,a.jsx)(t.StackDivider,{borderColor:"cardBorderColor"}),alignItems:"flex-start",spacing:"1",children:[(0,a.jsxs)(t.Flex,{alignItems:"center",width:"100%",children:[(0,a.jsx)(t.Icon,{as:M.AiOutlineUser}),(0,a.jsx)(t.Text,{fontWeight:"semibold",marginLeft:"1",noOfLines:1,children:n})]}),r&&(0,a.jsxs)(t.Flex,{alignItems:"center",width:"100%",children:[(0,a.jsx)(t.Icon,{as:M.AiOutlineMail}),(0,a.jsx)(t.Text,{marginLeft:"1",noOfLines:1,children:r})]}),i&&(0,a.jsx)(t.Box,{dangerouslySetInnerHTML:{__html:i}})]}),maxWidth:{base:"200px",md:"240px"},isOpen:o,borderRadius:"4",placement:"right",boxShadow:"md",offset:[0,8],hasArrow:!0,children:(0,a.jsx)(t.Avatar,{src:s,onTouchStart:l,onTouchEnd:c,onMouseEnter:l,onMouseLeave:c,border:"4px solid white",boxShadow:"md",marginTop:e?"0":"-3"})})})},Ee=({data:e})=>(0,a.jsx)(a.Fragment,{children:e.map((({login:e,name:n,avatarUrl:r,id:t,email:s,bioHTML:i},o)=>(0,a.jsx)(Ye,{id:t,isFirst:0===o,name:n||e,email:s,bioHTML:i,avatarUrl:r},t)))}),Pe=(0,f.memo)(Ee),Ge=()=>(0,a.jsxs)(t.Box,{padding:"3",children:[(0,a.jsx)(t.SkeletonCircle,{}),(0,a.jsx)(t.Skeleton,{marginY:"2"}),(0,a.jsx)(t.SkeletonText,{noOfLines:6,marginY:"2"})]}),Je=()=>{const{data:e,loading:n,error:r}=(0,u.useQuery)(p.GetViewerDocument,{variables:{first:10}});return n?(0,a.jsx)(Ge,{}):r?(0,a.jsx)(Ce,{error:r}):(0,a.jsxs)(t.Flex,{flexDirection:"column",padding:"3",height:{md:"100%"},className:"tour_about",children:[(0,a.jsx)(t.Flex,{padding:"2",alignItems:"flex-end",children:(0,a.jsx)(t.Avatar,{name:e.viewer.name,src:e.viewer.avatarUrl,size:"xl",children:(0,a.jsx)(t.AvatarBadge,{bg:"green.500",boxSize:"0.8em"})})}),(0,a.jsx)(_e,{marginY:"2",className:"tour_commit"}),(0,a.jsx)(t.Divider,{marginY:"2"}),(0,a.jsxs)(t.HStack,{divider:(0,a.jsx)(t.StackDivider,{}),spacing:"2",children:[(0,a.jsx)(t.IconButton,{"aria-label":"github",variant:"link",icon:(0,a.jsx)(t.Icon,{as:M.AiOutlineGithub,fontSize:"xl"}),as:"a",href:"https://github.com/MrWangJustToDo/"}),(0,a.jsx)(t.IconButton,{"aria-label":"leetcode",variant:"link",icon:(0,a.jsx)(t.Icon,{as:Ue.SiLeetcode,fontSize:"xl"}),as:"a",href:"https://leetcode.com/MrWangSay/"})]}),(0,a.jsxs)(t.Box,{fontSize:"sm",marginY:"2",children:[(0,a.jsx)(t.Text,{fontWeight:"semibold",children:"Recommend:"}),(0,a.jsx)(t.Link,{target:"_blank",color:"red.400",href:"https://github.com/MrWangJustToDo/MyReact",title:"https://github.com/MrWangJustToDo/MyReact",children:"MyReact"})]}),(0,a.jsxs)(t.Flex,{alignItems:"center",marginTop:"1",children:[(0,a.jsx)(t.Icon,{as:M.AiOutlineUser}),(0,a.jsx)(t.Text,{fontSize:"small",marginLeft:"2",children:e.viewer.login})]}),(0,a.jsxs)(t.Flex,{alignItems:"center",marginTop:"1",color:"lightTextColor",children:[(0,a.jsx)(t.Icon,{as:M.AiOutlineMail}),(0,a.jsx)(t.Text,{fontSize:"small",marginLeft:"2",children:e.viewer.email})]}),(0,a.jsx)(t.Text,{fontSize:"x-small",marginY:"1",children:pe(e.viewer.createdAt)}),(0,a.jsx)(t.Divider,{marginY:"2"}),(0,a.jsx)(t.Flex,{overflow:{md:"auto"},flexDirection:"column",children:(0,a.jsxs)(t.Flex,{justifyContent:"space-between",marginBottom:"2",children:[(0,a.jsxs)(t.Flex,{flexDirection:"column",alignItems:"center",children:[(0,a.jsx)(t.Flex,{alignItems:"center",marginBottom:"3",children:(0,a.jsx)(t.Text,{textTransform:"capitalize",fontSize:"sm",children:"followers :"})}),(0,a.jsx)(Pe,{data:e.viewer.followers.nodes})]}),(0,a.jsxs)(t.Flex,{flexDirection:"column",alignItems:"center",children:[(0,a.jsx)(t.Flex,{alignItems:"center",marginBottom:"3",children:(0,a.jsx)(t.Text,{textTransform:"capitalize",fontSize:"sm",children:"following :"})}),(0,a.jsx)(Pe,{data:e.viewer.following.nodes})]})]})})]})},Ve=(0,f.memo)(Je),Qe={lg:12,md:12,sm:12,xs:2,xxs:2},qe={lg:[{i:"a",x:0,y:0,w:3,h:40,minW:2,maxW:5,minH:25},{i:"b",x:3,y:0,w:9,h:50,minW:6,minH:50}],md:[{i:"a",x:0,y:0,w:4,h:30,minW:2,maxW:6,minH:20},{i:"b",x:4,y:0,w:8,h:40,minW:6,minH:40}],sm:[{i:"a",x:0,y:0,w:5,h:30,minW:2,maxW:8,minH:15},{i:"b",x:5,y:0,w:7,h:40,minW:6,minH:40}],xs:[{i:"a",x:0,y:0,w:2,h:20,minW:1,minH:10,static:!0},{i:"b",x:2,y:0,w:2,h:30,minW:2,minH:30,static:!0}],xxs:[{i:"a",x:0,y:0,w:2,h:20,minW:2,minH:10,static:!0},{i:"b",x:2,y:0,w:2,h:30,minW:2,minH:30,static:!0}]},Xe=()=>(0,a.jsx)(t.Container,{maxWidth:h.R,children:(0,a.jsxs)(g,{className:"layout",cols:Qe,position:"relative",layouts:qe,rowHeight:10,draggableHandle:`.${s}`,draggableCancel:`.${i}`,children:[(0,a.jsx)(c,{contentProps:{overflow:"auto"},children:(0,a.jsx)(Ve,{})},"a"),(0,a.jsx)(c,{className:"grid-card-list",children:(0,a.jsx)(Ne,{})},"b")]})}),Ze=!0}};