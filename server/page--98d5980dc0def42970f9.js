"use strict";exports.id=392,exports.ids=[392],exports.modules={3502:(e,r,t)=>{t.d(r,{H:()=>l});var a=t(8930),n=t(9882),o=t(8537),c=t(1250);const{Column:s}=n.Table,i=[{"@my-react/react (hook)":"useState","@my-react/react":"createELement","@my-react/react-dom":"render","@my-react/react-reactive":"createReactive","@my-react/react-refresh":"babel plugin","@my-react/react-refresh-tools":"webpack plugin","@my-react/react-vite":"vite plugin"},{"@my-react/react (hook)":"useCallback","@my-react/react":"cloneElement","@my-react/react-dom":"hydrate","@my-react/react-reactive":"reactive","@my-react/react-refresh":"refresh runtime","@my-react/react-refresh-tools":"next.js plugin"},{"@my-react/react (hook)":"useMemo","@my-react/react":"isValidElement","@my-react/react-dom":"renderToString","@my-react/react-reactive":"ref","@my-react/react-refresh-tools":"webpack loader"},{"@my-react/react (hook)":"useReducer","@my-react/react":"Children","@my-react/react-dom":"findDOMNode","@my-react/react-reactive":"computed"},{"@my-react/react (hook)":"useRef","@my-react/react":"forwardRef","@my-react/react-dom":"createPortal","@my-react/react-reactive":"watch"},{"@my-react/react (hook)":"useEffect","@my-react/react":"lazy","@my-react/react-dom":"unmountComponentAtNode","@my-react/react-reactive":"onBeforeMount"},{"@my-react/react (hook)":"useLayoutEffect","@my-react/react":"createContext","@my-react/react-dom":"renderToNodeStream","@my-react/react-reactive":"onBeforeUnmount"},{"@my-react/react (hook)":"useImperativeHandle","@my-react/react":"createRef","@my-react/react-dom":"createRoot","@my-react/react-reactive":"onBeforeUpdate"},{"@my-react/react (hook)":"useContext","@my-react/react":"memo","@my-react/react-dom":"hydrateRoot","@my-react/react-reactive":"onMounted"},{"@my-react/react (hook)":"useDebugValue","@my-react/react":"Component","@my-react/react-dom":"renderToStaticMarkup","@my-react/react-reactive":"onUnmounted"},{"@my-react/react (hook)":"useSignal","@my-react/react":"PureComponent","@my-react/react-dom":"renderToStaticNodeStream","@my-react/react-reactive":"onUpdated"},{"@my-react/react (hook)":"useDeferredValue","@my-react/react":"StrictMode","@my-react/react-dom":"renderToPipeableStream"},{"@my-react/react (hook)":"useId","@my-react/react":"Fragment","@my-react/react-dom":"renderToReadableStream"},{"@my-react/react (hook)":"useInsertionEffect","@my-react/react":"Suspense"},{"@my-react/react (hook)":"useSyncExternalStore","@my-react/react":"createFactory"},{"@my-react/react (hook)":"useTransition","@my-react/react":"startTransition"}],l=()=>(0,c.jsxs)(a.Container,{maxWidth:o.R,minHeight:"100vh",children:[(0,c.jsx)(a.Heading,{marginLeft:{base:"4%",md:"6%",lg:"8%"},as:"h4",fontSize:{base:"lg",lg:"2xl"},children:"Packages"}),(0,c.jsx)(a.Spacer,{marginTop:{base:"4",md:"6",lg:"8",xl:"10"}}),(0,c.jsxs)(n.Table,{dataSource:i,containerProps:{padding:{base:"2",md:"4",lg:"6"},marginX:"auto",maxWidth:{base:"90%",lg:"80%"},border:"1px solid",borderRadius:"md",borderColor:"cardBorderColor"},tableProps:{borderRadius:"md"},rowProps:{theadRow:{backgroundColor:"cardBorderColor"}},children:[(0,c.jsx)(s,{headCellRender:{cellProps:{fontSize:"1.1rem",borderLeftRadius:"2px"},Render:"@my-react/react"},dataIndex:"@my-react/react",bodyCellRender:{Render:({cellData:e})=>(0,c.jsx)(a.Code,{children:e})}}),(0,c.jsx)(s,{dataIndex:"@my-react/react (hook)",headCellRender:{cellProps:{fontSize:"1.1rem"},Render:"@my-react/react (hook)"},bodyCellRender:{Render:({cellData:e})=>(0,c.jsx)(a.Code,{children:e})}}),(0,c.jsx)(s,{headCellRender:{cellProps:{fontSize:"1.1rem"},Render:"@my-react/react-dom"},dataIndex:"@my-react/react-dom",bodyCellRender:{Render:({cellData:e})=>(0,c.jsx)(a.Code,{children:e})}}),(0,c.jsx)(s,{headCellRender:{cellProps:{fontSize:"1.1rem",borderRightRadius:"2px"},Render:"@my-react/react-reactive"},dataIndex:"@my-react/react-reactive",bodyCellRender:{Render:({cellData:e})=>(0,c.jsx)(a.Code,{children:e})}}),(0,c.jsx)(s,{headCellRender:{cellProps:{fontSize:"1.1rem",borderRightRadius:"2px"},Render:"@my-react/react-refresh"},dataIndex:"@my-react/react-refresh",bodyCellRender:{Render:({cellData:e})=>(0,c.jsx)(a.Code,{children:e})}}),(0,c.jsx)(s,{headCellRender:{cellProps:{fontSize:"1.1rem",borderRightRadius:"2px"},Render:"@my-react/react-refresh-tools"},dataIndex:"@my-react/react-refresh-tools",bodyCellRender:{Render:({cellData:e})=>(0,c.jsx)(a.Code,{children:e})}}),(0,c.jsx)(s,{headCellRender:{cellProps:{fontSize:"1.1rem",borderRightRadius:"2px"},Render:"@my-react/react-vite"},dataIndex:"@my-react/react-vite",bodyCellRender:{Render:({cellData:e})=>(0,c.jsx)(a.Code,{children:e})}})]})]})},788:(e,r,t)=>{t.r(r),t.d(r,{ApiSection:()=>x.H,MainSection:()=>g});var a=t(8930),n=t(7496),o=t(4554),c=t(3126),s=t(4661),i=t(8537),l=t(4676),d=t(3857),m=t(1250);const h=l.B1.render("\n```tsx\nimport { useState, useCallback } from '@my-react/react';\nimport { render } from '@my-react/react-dom';\n\nconst useCount = () => {\n  const [state, setState] = useState(0);\n  const add = useCallback(() => setState(i => i + 1), []);\n  const del = useCallback(() => setState(i => i - 1), []);\n\n  return [state, add, del];\n};\n\nconst App = () => {\n  const [state, add, del] = useCount();\n\n  return <div>\n    <p>{state}</p>\n    <button onClick={add}>add</button>\n    <button onClick={del}>del</button>\n  </div>\n}\n\nrender(<App />, document.querySelector('#root'));\n```\n"),g=()=>{const e=(0,s.useNavigate)(),{formatMessage:r}=(0,c.useIntl)();return(0,m.jsx)(a.Container,{maxWidth:i.R,minHeight:"100vh",children:(0,m.jsxs)(a.Flex,{justifyContent:"space-between",marginTop:"4%",flexDirection:{base:"column",md:"row"},children:[(0,m.jsxs)(a.Box,{alignSelf:"flex-start",marginLeft:{base:"4%",md:"6%",lg:"8%"},marginRight:{base:"1%",md:"0"},maxWidth:{base:"100%",md:"40%"},children:[(0,m.jsx)(a.Heading,{as:"h1",fontSize:{base:"2xl",md:"3xl",lg:"5xl"},marginBottom:"6",color:"red.400",children:r({id:"@my-react"})}),(0,m.jsx)(a.Text,{fontSize:{base:"xl",md:"3xl",lg:"4xl"},children:r({id:"description"})}),(0,m.jsxs)(a.Text,{fontSize:"sm",color:"lightTextColor",marginY:"2",lineHeight:"180%",children:["This website is built with ",(0,m.jsx)(a.Tag,{children:"@my-react"})," project. ",(0,m.jsx)("br",{})," Version: @my-react/react [",n.version,"]; @my-react/react-dom [",o.version,"]"]}),(0,m.jsxs)(a.HStack,{marginTop:"14",spacing:"4",display:{base:"none",md:"flex"},fontSize:{md:"12px",lg:"14px",xl:"16px"},children:[(0,m.jsx)(a.Button,{variant:"solid",fontSize:"inherit",borderRadius:"full",colorScheme:"messenger",onClick:()=>e(d.tE?"/Blog":"/MyReact/Blog"),children:"View Example"}),(0,m.jsx)(a.Button,{variant:"solid",fontSize:"inherit",borderRadius:"full",colorScheme:"whatsapp",as:"a",href:"https://github.com/MrWangJustToDo/MyReact",target:"_blank",children:"View on GitHub"}),(0,m.jsx)(a.Button,{variant:"solid",fontSize:"inherit",borderRadius:"full",colorScheme:"teal",display:{base:"none",lg:"inline-flex"},as:"a",href:"https://mrwangjusttodo.github.io/MrWangJustToDo.io?overlay=open&playGround=MyReact",target:"_blank",children:"Online play"}),(0,m.jsx)(a.Button,{variant:"solid",fontSize:"inherit",borderRadius:"full",as:"a",href:"https://www.npmjs.com/search?q=%40my-react",target:"_blank",children:"View on NPM"})]})]}),(0,m.jsx)(a.Box,{className:"typo",overflow:{base:"hidden",lg:"auto"},border:"1px solid",borderColor:"cardBorderColor",marginRight:{base:"4%",md:"16%"},marginTop:{base:"10%",md:"0"},marginLeft:{base:"4%",md:"1%"},marginBottom:{base:"6%"},borderRadius:"0.8em",fontSize:{base:"sm",lg:"medium"},sx:{pre:{margin:"0"}},dangerouslySetInnerHTML:{__html:h}})]})})};var x=t(3502)},1363:(e,r,t)=>{t.r(r),t.d(r,{default:()=>y,isStatic:()=>b});var a=t(8930),n=t(6689),o=t(9882),c=t(788),s=(t(3502),t(8537)),i=t(4676),l=t(1250);const d=(0,a.chakra)("iframe"),m=i.B1.render("\n```js\n// 1. create a Next.js 12 project\n\n// 2. install @my-react\npnpm add @my-react/react @my-react/react-dom\n\npnpm add -D @my-react/react-refresh @my-react/react-refresh-tools\n\n// 3. config next.config.js\nconst withNext = require('@my-react/react-refresh-tools/withNext');\n\nmodule.exports = withNext(nextConfig);\n\n// 4. start\npnpm run dev\n\n```\n"),h=(0,l.jsx)(d,{title:"@my-react online example",allowFullScreen:!0,marginX:"auto",width:{base:"100%",md:"80%"},height:"660",outline:"1px solid #252525",borderRadius:"4",zIndex:"100",marginBottom:"1em",src:"https://codesandbox.io/p/sandbox/zen-allen-mfwmmg?embed=1"}),g=()=>{const e=(0,a.useColorModeValue)("gray.300","gray.600");return(0,l.jsxs)(a.Container,{maxWidth:s.R,minHeight:"100vh",children:[(0,l.jsxs)(a.Flex,{justifyContent:"space-between",marginTop:"4%",flexDirection:{base:"column",md:"row"},children:[(0,l.jsxs)(a.Box,{alignSelf:"flex-start",marginLeft:{base:"4%",md:"6%",lg:"8%"},marginRight:{base:"1%",md:"0"},maxWidth:{base:"100%",md:"40%"},children:[(0,l.jsxs)(a.Heading,{as:"h1",fontSize:{base:"xl",md:"3xl",lg:"4xl"},marginTop:"6",children:["Quick start in ",(0,l.jsx)(a.Tag,{fontSize:"inherit",children:"Next.js"})]}),(0,l.jsx)(a.Text,{fontSize:"sm",color:"lightTextColor",marginY:"2",lineHeight:"180%",children:"Currently not support Next.js 13+, also not support React `RSC`."}),(0,l.jsx)(a.Text,{fontSize:"sm",color:"lightTextColor",marginY:"2",lineHeight:"180%",children:"This project is only a experimental project, not recommend use in the production environment."}),(0,l.jsx)(a.Spacer,{marginTop:"4"}),(0,l.jsxs)(a.HStack,{children:[(0,l.jsx)(a.Tooltip,{label:(0,l.jsxs)(a.Text,{children:["A static ",(0,l.jsx)(a.Tag,{children:"Next.js"})," site power by @my-react"]}),hasArrow:!0,placement:"top",bg:e,color:"black",children:(0,l.jsx)(a.Button,{as:"a",href:"https://mrwangjusttodo.github.io/MrWangJustToDo.io",colorScheme:"purple",target:"_blank",children:"Online Example"})}),(0,l.jsx)(a.Tooltip,{label:(0,l.jsxs)(a.Text,{children:["A ",(0,l.jsx)(a.Tag,{children:"Next.js"})," template power by @my-react"]}),hasArrow:!0,placement:"top",bg:e,color:"black",children:(0,l.jsx)(a.Button,{as:"a",href:"https://github.com/MrWangJustToDo/MyReact/tree/main/ui/next-example",colorScheme:"purple",target:"_blank",children:"Example"})})]})]}),(0,l.jsx)(a.Box,{className:"typo",overflow:{base:"hidden",lg:"auto"},border:"1px solid",borderColor:"cardBorderColor",marginRight:{base:"4%",md:"16%"},marginTop:{base:"10%",md:"0"},marginLeft:{base:"4%",md:"1%"},marginBottom:{base:"6%"},borderRadius:"0.8em",fontSize:{base:"sm",lg:"medium"},sx:{pre:{margin:"0"}},dangerouslySetInnerHTML:{__html:m}})]}),h]})},x=i.B1.render('\n```js\n// 1. create a Vite React template\n\n// 2. install @my-react\npnpm add @my-react/react @my-react/react-dom\n\npnpm add -D @my-react/react-refresh @my-react/react-vite\n\n// 3. config vite.config.ts\nimport react from "@my-react/react-vite";\n\nexport default defineConfig({\n  plugins: [react()],\n});\n\n// 4. start\npnpm run dev\n\n```\n'),u=()=>{const e=(0,a.useColorModeValue)("gray.300","gray.600");return(0,l.jsx)(a.Container,{maxWidth:s.R,minHeight:"100vh",children:(0,l.jsxs)(a.Flex,{justifyContent:"space-between",marginTop:"4%",flexDirection:{base:"column",md:"row"},children:[(0,l.jsxs)(a.Box,{alignSelf:"flex-start",marginLeft:{base:"4%",md:"6%",lg:"8%"},marginRight:{base:"1%",md:"0"},maxWidth:{base:"100%",md:"40%"},children:[(0,l.jsxs)(a.Heading,{as:"h1",fontSize:{base:"xl",md:"3xl",lg:"4xl"},marginTop:"6",children:["Quick start in ",(0,l.jsx)(a.Tag,{fontSize:"inherit",children:"Vite"})]}),(0,l.jsx)(a.Text,{fontSize:"sm",color:"lightTextColor",marginY:"2",lineHeight:"180%",children:"This project is only a experimental project, not recommend use in the production environment."}),(0,l.jsx)(a.Spacer,{marginTop:"4"}),(0,l.jsx)(a.Tooltip,{label:(0,l.jsxs)(a.Text,{children:["A ",(0,l.jsx)(a.Tag,{children:"Vite"})," template power by @my-react"]}),hasArrow:!0,placement:"top",bg:e,color:"black",children:(0,l.jsx)(a.Button,{as:"a",href:"https://github.com/MrWangJustToDo/MyReact/tree/main/ui/vite-example",colorScheme:"purple",target:"_blank",children:"Example"})})]}),(0,l.jsx)(a.Box,{className:"typo",overflow:{base:"hidden",lg:"auto"},border:"1px solid",borderColor:"cardBorderColor",marginRight:{base:"4%",md:"16%"},marginTop:{base:"10%",md:"0"},marginLeft:{base:"4%",md:"1%"},marginBottom:{base:"6%"},borderRadius:"0.8em",fontSize:{base:"sm",lg:"medium"},sx:{pre:{margin:"0"}},dangerouslySetInnerHTML:{__html:x}})]})})},p=(0,n.lazy)((()=>Promise.resolve().then(t.bind(t,788)).then((({ApiSection:e})=>({default:e}))))),y=()=>(0,l.jsx)(a.Box,{fontFamily:"fantasy",children:(0,l.jsxs)(o.mT,{initialSectionLength:1,children:[(0,l.jsxs)(o.MV,{children:[(0,l.jsx)(o.Yu,{children:(0,l.jsx)(c.MainSection,{})}),(0,l.jsx)(o.Yu,{children:(0,l.jsx)(g,{})}),(0,l.jsx)(o.Yu,{children:(0,l.jsx)(u,{})}),(0,l.jsx)(o.Yu,{children:(0,l.jsx)(p,{})})]}),(0,l.jsx)(o.T3,{}),(0,l.jsx)(o.pU,{})]})}),b=!0},4676:(e,r,t)=>{t.d(r,{B1:()=>D,H9:()=>I});var a=t(9653),n=t.n(a),o=t(2145),c=t.n(o),s=t(6780),i=t.n(s),l=t(9169),d=t.n(l),m=t(2767),h=t.n(m),g=t(7985),x=t.n(g),u=t(5356),p=t.n(u),y=t(2067),b=t.n(y),f=t(1570),j=t.n(f),R=t(2441),S=t.n(R),C=t(1927),v=t.n(C),T=t(5519),k=t.n(T),w=t(373),B=t.n(w),z=t(9372),L=t.n(z);c().registerLanguage("css",d()),c().registerLanguage("json",p()),c().registerLanguage("java",h()),c().registerLanguage("bash",i()),c().registerLanguage("markdown",j()),c().registerLanguage("javascript",x()),c().registerLanguage("typescript",B()),c().registerLanguage("less",b()),c().registerLanguage("scss",S()),c().registerLanguage("shell",v()),c().registerLanguage("xml",L()),c().registerLanguage("sql",k());const M=c(),H=new(n()),D=new(n())({html:!0,xhtmlOut:!0,breaks:!0,highlight:function(e,r){let t="";try{t=r&&M.getLanguage(r)?M.highlight(e,{language:r,ignoreIllegals:!0}).value:M.highlightAuto(e,["typescript","javascript","xml","scss","less","json","bash"]).value;const a=t.split(/\n/).slice(0,-1),n=String(a.length).length-.2;return`<pre class="rounded position-relative"><code class="hljs ${r}" style='padding-top: 30px;'>${a.reduce(((e,r,t)=>`${e}<span class='no-select d-inline-block text-center border-right pr-2 mr-2 border-dark' style='min-width: ${n}em; line-height: 1.5'>${t+1}</span>${r}\n`),`<div class='w-100 position-absolute' style='left: 0; top: 0; font-size: 0px'>\n          <b class='no-select position-absolute text-info' style='left: 10px; font-size: 12px; top: 4px;'>${r}</b>\n          <div class='position-absolute w-100 border-bottom border-dark' style='left: 0; top: 24px;'></div>\n        </div>`)}</code></pre>`}catch(e){}}}),I=new(n())({html:!0,xhtmlOut:!0,breaks:!0,highlight:function(e,r){if(r&&M.getLanguage(r))try{return`<pre class="rounded bg-dark"><code class="bg-dark hljs ${r}">${M.highlight(e,{language:r,ignoreIllegals:!0}).value}</code></pre>`}catch(e){}return`<pre class="rounded bg-dark"><code class="bg-dark hljs">${H.utils.escapeHtml(e)}</code></pre>`}})}};