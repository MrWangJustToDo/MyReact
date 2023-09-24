"use strict";exports.id=392,exports.ids=[392],exports.modules={9882:(e,r,t)=>{t.d(r,{MV:()=>h,mT:()=>i,T3:()=>f,Yu:()=>u,pU:()=>y,Table:()=>M});var n=t(9034),o=t(6689),a=(t(7058),t(8930));const s=(0,o.createContext)({totalSection:0,currentSection:0,setTotalSection:e=>{},setCurrentSection:e=>{},onNextSection:()=>{},onPrevSection:()=>{}}),l=()=>(0,o.useContext)(s);var c=t(1250);const i=({onSectionIndexChange:e,children:r,initialSectionLength:t})=>{const[n,l]=(0,o.useState)(0),[i,d]=(0,o.useState)(t||0),m=(0,a.usePrevious)(n),x=(0,a.useCallbackRef)(e),u=(0,a.useCallbackRef)((()=>{l(n===i-1?0:e=>e+1)})),h=(0,a.useCallbackRef)((()=>{l(0===n?i-1:e=>e-1)}));(0,o.useEffect)((()=>{x(n,m)}),[n,x]);const p=(0,o.useMemo)((()=>({totalSection:i,currentSection:n,onNextSection:u,onPrevSection:h,setCurrentSection:l,setTotalSection:d})),[n,u,h,i]);return(0,c.jsx)(s.Provider,{value:p,children:r})};var d=t(9378);const m=(0,o.createContext)({ref:{current:null}}),x=(0,o.createContext)({inViewArray:[],setCurrentView:(e,r)=>{}}),u=({children:e,index:r})=>{const t=(0,o.useRef)(null),s=(0,o.useMemo)((()=>({ref:t})),[]),{currentSection:i}=l(),{setCurrentView:d,inViewArray:u}=(0,o.useContext)(x),h=(0,n.useInView)(t,{amount:"some",margin:"-300px 0px"});return(0,o.useEffect)((()=>{null!=r&&d(h,r)}),[r,h,d,u.length]),(0,c.jsx)(m.Provider,{value:s,children:(0,c.jsx)(a.Box,{ref:t,position:"relative",overflow:"hidden","data-scroll-section":r,"data-active":i===r,children:e})})},h=({children:e})=>{const r=[],{scrollY:t}=(0,n.useScroll)();o.Children.forEach(e,(e=>{(0,o.isValidElement)(e)&&e.type===u&&r.push(e)}));const s=r.length,[i,m]=(0,o.useState)((()=>Array(s).fill(!1)));(0,o.useEffect)((()=>{m(Array(s).fill(!1))}),[s]);const h=(0,a.useCallbackRef)(((e,r)=>{m((t=>{if(t[r]!==e){const n=[...t];return n[r]=e,n}return t}))})),p=(0,o.useMemo)((()=>({inViewArray:i,setCurrentView:h})),[i,h]),{setTotalSection:g,setCurrentSection:y,currentSection:f}=l(),b=(0,a.useCallbackRef)((e=>{e?i[f-1]&&y(f-1):i[f+1]&&y(f+1)}));return(0,o.useEffect)((()=>{let e=0;const r=(0,d.throttle)((r=>{b(!(r>e)),e=r}),100,{leading:!0,trailing:!0});return t.onChange(r),()=>t.clearListeners()}),[b,t]),(0,a.useSafeLayoutEffect)((()=>{g(s),y(0)}),[s,g,y]),(0,c.jsx)(x.Provider,{value:p,children:o.Children.map(r,((e,r)=>(0,o.cloneElement)(e,{index:r})))})},p=({className:e})=>(0,c.jsx)("svg",{className:e,width:"14",height:"8",viewBox:"0 0 14 8",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,c.jsx)("path",{d:"M1 7L7 1L13 7",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),g=(0,o.memo)(p),y=()=>{const{currentSection:e}=l();return(0,c.jsx)(a.Box,{fontSize:"20px",position:"fixed",right:"10px",bottom:"20px",width:"20px",height:"20px",color:"orangeSand",textAlign:"center",verticalAlign:"middle",borderRadius:"999999px",zIndex:"sticky",display:{base:e>0?"flex":"none",md:"none"},alignItems:"center",justifyContent:"center",onClick:()=>{window.scrollTo({top:0,behavior:"smooth"})},children:(0,c.jsx)(a.Icon,{as:g,width:"20px",height:"20px"})})},f=({render:e})=>{const{totalSection:r,currentSection:t}=l(),n=(0,a.useCallbackRef)((e=>{const r=document.querySelector(`[data-scroll-section="${e}"]`);if(r){const e=r.getBoundingClientRect(),t=(document.scrollingElement?.scrollTop||0)+e.top;window.scrollTo({top:t,behavior:"smooth"})}})),s=(0,o.useMemo)((()=>Array(r).fill(0)),[r]);return r<=1?null:(0,c.jsx)(a.Flex,{height:"100vh",position:"fixed",width:"30px",display:{base:"none",md:"flex"},flexDirection:"column",top:"0",right:"100px",alignItems:"center",justifyContent:"center",zIndex:"dropdown","data-scroll-tool":!0,children:t<=r-1&&(0,c.jsx)(a.Wrap,{spacing:"6",children:s.map(((r,o)=>(0,c.jsx)(a.WrapItem,{children:e?e({index:o,isSelect:t===o,onClick:()=>n(o)}):(0,c.jsx)(a.Box,{width:"10px",height:"10px",cursor:"pointer",borderRadius:"full",sx:{backgroundColor:t===o?"red":"initial",border:t===o?"none":"1px solid #e2e2e2"},onClick:()=>n(o)})},o)))})})},b=({...e})=>(0,c.jsx)(a.TableContainer,{children:(0,c.jsx)(a.Table,{variant:"simple",...e})});function j({dataIndex:e,cellProps:r,headCellProps:t,bodyCellProps:n,isHidden:o,headCellRender:a,bodyCellRender:s}){return(0,c.jsx)(c.Fragment,{})}var C=t(9847);const S=e=>(0,c.jsx)(a.Button,{border:"1px",size:"sm",borderColor:"gray.200",textStyle:"light",fontWeight:"normal",_active:{background:"none"},_hover:{background:"none"},fontSize:"sm",...e,children:e.children}),w=({page:e,total:r,pageSize:t=50,onChange:n,preButtonProps:o,nextButtonProps:s,...l})=>{const{hasNextPage:i,hasPrePage:d}=(({page:e,total:r,pageSize:t=50})=>{const n=r?Math.ceil(r/t):1;return{totalPage:n,hasNextPage:e<n,hasPrePage:e>1}})({page:e,total:r,pageSize:t});return(0,c.jsxs)(a.Flex,{justifyContent:"flex-end",...l,children:[d&&(0,c.jsx)(S,{"aria-label":"Prev page",leftIcon:(0,c.jsx)(a.Icon,{as:C.AiOutlineLeft}),onClick:()=>{n(e-1)},marginEnd:"4",...o,children:o?.children||"prevPage"}),i&&(0,c.jsx)(S,{"aria-label":"Next page",rightIcon:(0,c.jsx)(a.Icon,{as:C.AiOutlineRight}),onClick:()=>{n(e+1)},marginEnd:{base:4,lg:0},...s,children:s?.children||"nextPage"})]})};var R=t(2631),v=t.n(R);class k extends o.Component{constructor(...e){super(...e),this.state={error:"",stack:"",hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(e,r){this.setState({error:e.message,stack:r.componentStack})}render(){const{hasError:e,stack:r,error:t}=this.state;return e?(console.error(t,r),""):this.props.children}}const I=e=>{const{children:r,...t}=e;return(0,c.jsx)(a.Td,{...t,children:(0,c.jsx)(k,{children:r})})},T=({Render:e,...r})=>(0,c.jsx)(c.Fragment,{children:e(r)}),P=({Render:e,CustomRender:r,dataIndex:t,rowIndex:n,colIndex:o,rowData:a,cellProps:s,...l})=>"function"==typeof r?r(t?{rowData:a,rowIndex:n,colIndex:o,dataIndex:t,cellData:a[t]}:{rowData:a,rowIndex:n,colIndex:o}):(0,c.jsx)(I,{fontWeight:"medium",...l,...s,children:"function"==typeof e?(0,c.jsx)(T,{Render:e,dataIndex:t||"",rowIndex:n,colIndex:o,cellData:t?a[t]:{},rowData:a}):e});function D({Render:e,CustomRender:r,dataIndex:t,rowIndex:n,colIndex:o,rowData:s,cellProps:l,showSkeleton:i=(({rowData:e})=>!e),Skeleton:d,...m}){return("function"==typeof i?i({rowIndex:n,rowData:s,colIndex:o}):i)?d?(0,c.jsx)(I,{fontWeight:"medium",...m,...l,children:(0,c.jsx)(d,{rowIndex:n,colIndex:o})}):(0,c.jsx)(I,{fontWeight:"medium",...m,...l,children:(0,c.jsx)(a.Skeleton,{width:"80%",height:"24px"})}):(0,c.jsx)(P,{rowData:s,rowIndex:n,dataIndex:t,colIndex:o,cellProps:l,Render:e,CustomRender:r,...m})}let B=function(e){return e[e.None=0]="None",e[e.Asc=1]="Asc",e[e.Desc=2]="Desc",e}({});const z=(0,o.createContext)({sorter:{order:B.None},onSort:()=>{}});function A({Render:e,CustomRender:r,genCompareFn:t,dataIndex:n,rowIndex:s,colIndex:l,cellProps:i,cancelSort:d,sort:m,sortedColor:x="blue.500",defaultOrder:u=B.Desc,tooltipProps:h}){const{sorter:p,onSort:g}=(0,o.useContext)(z),y=(0,o.useCallback)((e=>p?.by===n&&p?.order===e?x:void 0),[n,p,x]),f=(0,o.useMemo)((()=>p?.by!==n||p?.order===B.None?u:d&&p?.order!=u?B.None:p?.order===B.Asc?B.Desc:B.Asc),[n,p,u,d]);if("function"==typeof r){let e=null;return e=r(n?{dataIndex:n,rowIndex:s,colIndex:l,sorter:p,onSort:g,genCompareFn:t,defaultOrder:u,cancelSort:d,sorterClick:()=>{g(t&&p?.genCompareFn!==t?{by:n,order:f,genCompareFn:t}:{by:n,order:f})},sortAscColor:y(B.Asc),sortDescColor:y(B.Desc),toggledSortOrder:f}:{rowIndex:s,colIndex:l,sorter:p,onSort:g,sort:m,defaultOrder:u,sortAscColor:y(B.Asc),sortDescColor:y(B.Desc)}),h?(0,c.jsx)(a.Tooltip,{...h,children:e}):e}const b="function"==typeof e?e({dataIndex:n||"",rowIndex:s,colIndex:l}):e,j=`Sort by ${"string"==typeof e?e:n.toString()}`,S=m?(0,c.jsxs)(a.Flex,{display:"inline-flex",as:"button",width:"auto",cursor:"pointer","aria-label":j,textTransform:"inherit",fontWeight:"semibold",onClick:()=>{g(t&&p?.genCompareFn!==t?{by:n,order:f,genCompareFn:t}:{by:n,order:f})},alignItems:"center",children:[b,(0,c.jsxs)(a.Flex,{transform:"scale(0.7)",marginStart:"2px",flexDirection:"column",children:[(0,c.jsx)(a.IconButton,{icon:(0,c.jsx)(a.Icon,{as:C.AiOutlineUp}),"aria-label":"Sort ascend",fontSize:"xx-small",color:y(B.Asc)}),(0,c.jsx)(a.IconButton,{icon:(0,c.jsx)(a.Icon,{as:C.AiOutlineDown}),"aria-label":"Sort descend",fontSize:"xx-small",color:y(B.Desc)})]})]}):(0,c.jsx)(a.Box,{fontWeight:"semibold",children:b});return(0,c.jsx)(a.Th,{textTransform:"none",color:"inherit",...i,children:h?(0,c.jsx)(a.Tooltip,{...h,children:S}):S})}v()((()=>{console.warn("pls make sure:\n 1. do not add hook into hyper column usage.\n 2. hyper column usage do not support hot reload")}));const L=(e,r=0)=>({skeletonRows:(0,o.useMemo)((()=>new Array(r).fill(null)),[r]),skeletonVisible:!e});function M({dataSource:e,sorter:r,pagination:t,noResultText:n,CustomNoResult:s,tableProps:l,skeletonRowCount:i,rowProps:d,children:m,containerProps:x,afterSorting:u}){const{innerSorter:h,onSort:p,sortedRows:g}=function(e,r,t){const[n,a]=(0,o.useState)({order:B.None,genCompareFn:e=>(r,t)=>{const n=e.by;return null===n?0:n in r&&n in t?e.order===B.Asc?r[n].length-t[n].length:t[n].length-r[n].length:0},...e}),s=(0,o.useCallback)((e=>{const r={...n,...e};e.onSort?.(r),a(r)}),[n]),l=(0,o.useMemo)((()=>{const e=[...r||[]];return n.order!==B.None&&(e.sort(n.genCompareFn?.(n)),t&&t()),e}),[r,n,t]);return{innerSorter:n,onSort:s,sortedRows:l}}(r,e,u),{skeletonRows:y,skeletonVisible:f}=L(e,i),C=function(e,r){const t=[],n=[];let s=e;(0,o.isValidElement)(e)&&e.type===o.Fragment&&(s=e.props.children),o.Children.forEach(s,(e=>{let r=null;if(e?.type===j)r=e;else if("function"==typeof e?.type)try{const t=e.type(e.props);(0,o.isValidElement)(t)&&t.type===j&&(r=t)}catch(e){}if(r){const{dataIndex:e,cellProps:o,headCellProps:a,bodyCellProps:s,isHidden:l,headCellRender:i,bodyCellRender:d}=r.props,m=(Array.isArray(i)?i:[i]).map((r=>({rowIndex:t,colIndex:n})=>(0,c.jsx)(A,{rowIndex:t,colIndex:n,dataIndex:e,cellProps:{...o,...a,...r.cellProps},...r},e?String(e):`${t}-${n}`))),x=({rowIndex:r,colIndex:t,rowData:n})=>(0,c.jsx)(D,{rowIndex:r,colIndex:t,rowData:n,dataIndex:e,cellProps:{...o,...s,...d.cellProps},...d},e?String(e):`${r}-${t}`);l||(n.push(x),m.forEach(((e,r)=>{t[r]=t[r]||[],t[r].push(e)})))}}));const l=function(e,r={}){const t=(0,o.useRef)({headCellRender:e,rowProps:r});return t.current={headCellRender:e,rowProps:r},(0,o.useCallback)((()=>{const{headCellRender:e,rowProps:{commonRow:r,theadRow:n}}=t.current;return(0,c.jsx)(a.Thead,{children:e.map(((e,t)=>{const o={...r,...Array.isArray(n)?n[t]:n};return(0,c.jsx)(a.Tr,{...o,children:e.map(((e,r)=>e({rowIndex:t,colIndex:r})))},t)}))})}),[])}(t,r),i=function(e,r={}){const t=(0,o.useRef)({bodyCellRender:e,rowProps:r});return t.current={bodyCellRender:e,rowProps:r},(0,o.useCallback)((({dataSource:e})=>{const{bodyCellRender:r,rowProps:{commonRow:n,tbodyRow:o,genTbodyRow:s}}=t.current;return(0,c.jsx)(a.Tbody,{children:e.map(((e,t)=>{const l={...n,...o},i=s?s({rowIndex:t,rowData:e}):{};return(0,c.jsx)(a.Tr,{...l,...i,children:r.map(((r,n)=>r({rowData:e,rowIndex:t,colIndex:n})))},t)}))})}),[])}(n,r);return(0,o.useCallback)((({dataSource:e})=>(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(l,{}),(0,c.jsx)(i,{dataSource:e})]})),[i,l])}(m,d);return(0,c.jsxs)(z.Provider,{value:{sorter:h,onSort:p},children:[(0,c.jsxs)(a.Box,{...x,children:[(0,c.jsx)(b,{...l,children:m&&(0,c.jsx)(C,{dataSource:f?y:g})}),!f&&0===g.length&&(s?(0,c.jsx)(s,{}):"empty")]}),!!t&&(0,c.jsx)(w,{...t})]})}M.Column=j},3502:(e,r,t)=>{t.d(r,{H:()=>i});var n=t(8930),o=t(9882),a=t(8537),s=t(1250);const{Column:l}=o.Table,c=[{"@my-react/react (hook)":"useState","@my-react/react":"createELement","@my-react/react-dom":"render","@my-react/react-reactive":"createReactive","@my-react/react-refresh":"babel plugin","@my-react/react-refresh-tools":"webpack plugin","@my-react/react-vite":"vite plugin"},{"@my-react/react (hook)":"useCallback","@my-react/react":"cloneElement","@my-react/react-dom":"hydrate","@my-react/react-reactive":"reactive","@my-react/react-refresh":"refresh runtime","@my-react/react-refresh-tools":"next.js plugin"},{"@my-react/react (hook)":"useMemo","@my-react/react":"isValidElement","@my-react/react-dom":"renderToString","@my-react/react-reactive":"ref","@my-react/react-refresh-tools":"webpack loader"},{"@my-react/react (hook)":"useReducer","@my-react/react":"Children","@my-react/react-dom":"findDOMNode","@my-react/react-reactive":"computed"},{"@my-react/react (hook)":"useRef","@my-react/react":"forwardRef","@my-react/react-dom":"createPortal","@my-react/react-reactive":"watch"},{"@my-react/react (hook)":"useEffect","@my-react/react":"lazy","@my-react/react-dom":"unmountComponentAtNode","@my-react/react-reactive":"onBeforeMount"},{"@my-react/react (hook)":"useLayoutEffect","@my-react/react":"createContext","@my-react/react-dom":"renderToNodeStream","@my-react/react-reactive":"onBeforeUnmount"},{"@my-react/react (hook)":"useImperativeHandle","@my-react/react":"createRef","@my-react/react-dom":"createRoot","@my-react/react-reactive":"onBeforeUpdate"},{"@my-react/react (hook)":"useContext","@my-react/react":"memo","@my-react/react-dom":"hydrateRoot","@my-react/react-reactive":"onMounted"},{"@my-react/react (hook)":"useDebugValue","@my-react/react":"Component","@my-react/react-dom":"renderToStaticMarkup","@my-react/react-reactive":"onUnmounted"},{"@my-react/react (hook)":"useSignal","@my-react/react":"PureComponent","@my-react/react-dom":"renderToStaticNodeStream","@my-react/react-reactive":"onUpdated"},{"@my-react/react (hook)":"useDeferredValue","@my-react/react":"StrictMode","@my-react/react-dom":"renderToPipeableStream"},{"@my-react/react (hook)":"useId","@my-react/react":"Fragment"},{"@my-react/react (hook)":"useInsertionEffect","@my-react/react":"Suspense"},{"@my-react/react (hook)":"useSyncExternalStore","@my-react/react":"createFactory"},{"@my-react/react (hook)":"useTransition","@my-react/react":"startTransition"}],i=()=>(0,s.jsxs)(n.Container,{maxWidth:a.R,minHeight:"100vh",children:[(0,s.jsx)(n.Heading,{marginLeft:{base:"4%",md:"6%",lg:"8%"},as:"h4",fontSize:{base:"lg",lg:"2xl"},children:"Packages"}),(0,s.jsx)(n.Spacer,{marginTop:{base:"4",md:"6",lg:"8",xl:"10"}}),(0,s.jsxs)(o.Table,{dataSource:c,containerProps:{padding:{base:"2",md:"4",lg:"6"},marginX:"auto",maxWidth:{base:"90%",lg:"80%"},border:"1px solid",borderRadius:"md",borderColor:"cardBorderColor"},tableProps:{borderRadius:"md"},rowProps:{theadRow:{backgroundColor:"cardBorderColor"}},children:[(0,s.jsx)(l,{headCellRender:{cellProps:{fontSize:"1.1rem",borderLeftRadius:"2px"},Render:"@my-react/react"},dataIndex:"@my-react/react",bodyCellRender:{Render:({cellData:e})=>(0,s.jsx)(n.Code,{children:e})}}),(0,s.jsx)(l,{dataIndex:"@my-react/react (hook)",headCellRender:{cellProps:{fontSize:"1.1rem"},Render:"@my-react/react (hook)"},bodyCellRender:{Render:({cellData:e})=>(0,s.jsx)(n.Code,{children:e})}}),(0,s.jsx)(l,{headCellRender:{cellProps:{fontSize:"1.1rem"},Render:"@my-react/react-dom"},dataIndex:"@my-react/react-dom",bodyCellRender:{Render:({cellData:e})=>(0,s.jsx)(n.Code,{children:e})}}),(0,s.jsx)(l,{headCellRender:{cellProps:{fontSize:"1.1rem",borderRightRadius:"2px"},Render:"@my-react/react-reactive"},dataIndex:"@my-react/react-reactive",bodyCellRender:{Render:({cellData:e})=>(0,s.jsx)(n.Code,{children:e})}}),(0,s.jsx)(l,{headCellRender:{cellProps:{fontSize:"1.1rem",borderRightRadius:"2px"},Render:"@my-react/react-refresh"},dataIndex:"@my-react/react-refresh",bodyCellRender:{Render:({cellData:e})=>(0,s.jsx)(n.Code,{children:e})}}),(0,s.jsx)(l,{headCellRender:{cellProps:{fontSize:"1.1rem",borderRightRadius:"2px"},Render:"@my-react/react-refresh-tools"},dataIndex:"@my-react/react-refresh-tools",bodyCellRender:{Render:({cellData:e})=>(0,s.jsx)(n.Code,{children:e})}}),(0,s.jsx)(l,{headCellRender:{cellProps:{fontSize:"1.1rem",borderRightRadius:"2px"},Render:"@my-react/react-vite"},dataIndex:"@my-react/react-vite",bodyCellRender:{Render:({cellData:e})=>(0,s.jsx)(n.Code,{children:e})}})]})]})},788:(e,r,t)=>{t.r(r),t.d(r,{ApiSection:()=>h.H,MainSection:()=>u});var n=t(8930),o=t(7496),a=t(4554),s=t(3126),l=t(4661),c=t(8537),i=t(4676),d=t(3857),m=t(1250);const x=i.B1.render("\n```tsx\nimport { useState, useCallback } from '@my-react/react';\nimport { render } from '@my-react/react-dom';\n\nconst useCount = () => {\n  const [state, setState] = useState(0);\n  const add = useCallback(() => setState(i => i + 1), []);\n  const del = useCallback(() => setState(i => i - 1), []);\n\n  return [state, add, del];\n};\n\nconst App = () => {\n  const [state, add, del] = useCount();\n\n  return <div>\n    <p>{state}</p>\n    <button onClick={add}>add</button>\n    <button onClick={del}>del</button>\n  </div>\n}\n\nrender(<App />, document.querySelector('#root'));\n```\n"),u=()=>{const e=(0,l.useNavigate)(),{formatMessage:r}=(0,s.useIntl)();return(0,m.jsx)(n.Container,{maxWidth:c.R,minHeight:"100vh",children:(0,m.jsxs)(n.Flex,{justifyContent:"space-between",marginTop:"4%",flexDirection:{base:"column",md:"row"},children:[(0,m.jsxs)(n.Box,{alignSelf:"flex-start",marginLeft:{base:"4%",md:"6%",lg:"8%"},marginRight:{base:"1%",md:"0"},maxWidth:{base:"100%",md:"40%"},children:[(0,m.jsx)(n.Heading,{as:"h1",fontSize:{base:"2xl",md:"3xl",lg:"5xl"},marginBottom:"6",color:"red.400",children:r({id:"@my-react"})}),(0,m.jsx)(n.Text,{fontSize:{base:"xl",md:"3xl",lg:"4xl"},children:r({id:"description"})}),(0,m.jsxs)(n.Text,{fontSize:"sm",color:"lightTextColor",marginY:"2",lineHeight:"180%",children:["This website is built with ",(0,m.jsx)(n.Tag,{children:"@my-react"})," project. ",(0,m.jsx)("br",{})," Version: @my-react/react [",o.version,"]; @my-react/react-dom [",a.version,"]"]}),(0,m.jsxs)(n.HStack,{marginTop:"14",spacing:"4",display:{base:"none",md:"flex"},fontSize:{md:"12px",lg:"14px",xl:"16px"},children:[(0,m.jsx)(n.Button,{variant:"solid",fontSize:"inherit",borderRadius:"full",colorScheme:"messenger",onClick:()=>e(d.tE?"/Blog":"/MyReact/Blog"),children:"View Example"}),(0,m.jsx)(n.Button,{variant:"solid",fontSize:"inherit",borderRadius:"full",colorScheme:"whatsapp",as:"a",href:"https://github.com/MrWangJustToDo/MyReact",target:"_blank",children:"View on GitHub"}),(0,m.jsx)(n.Button,{variant:"solid",fontSize:"inherit",borderRadius:"full",colorScheme:"teal",display:{base:"none",lg:"inline-flex"},as:"a",href:"https://mrwangjusttodo.github.io/MrWangJustToDo.io?overlay=open&playGround=MyReact",target:"_blank",children:"Online play"}),(0,m.jsx)(n.Button,{variant:"solid",fontSize:"inherit",borderRadius:"full",as:"a",href:"https://www.npmjs.com/search?q=%40my-react",target:"_blank",children:"View on NPM"})]})]}),(0,m.jsx)(n.Box,{className:"typo",overflow:{base:"hidden",lg:"auto"},border:"1px solid",borderColor:"cardBorderColor",marginRight:{base:"4%",md:"16%"},marginTop:{base:"10%",md:"0"},marginLeft:{base:"4%",md:"1%"},marginBottom:{base:"6%"},borderRadius:"0.8em",fontSize:{base:"sm",lg:"medium"},sx:{pre:{margin:"0"}},dangerouslySetInnerHTML:{__html:x}})]})})};var h=t(3502)},1363:(e,r,t)=>{t.r(r),t.d(r,{default:()=>y,isStatic:()=>f});var n=t(6689),o=t(9882),a=t(788),s=(t(3502),t(8930)),l=t(8537),c=t(4676),i=t(1250);const d=(0,s.chakra)("iframe"),m=c.B1.render("\n```js\n// 1. create a Next.js 12 project\n\n// 2. install @my-react\npnpm add @my-react/react @my-react/react-dom\n\npnpm add -D @my-react/react-refresh @my-react/react-refresh-tools\n\n// 3. config next.config.js\nconst withNext = require('@my-react/react-refresh-tools/withNext');\n\nmodule.exports = withNext(nextConfig);\n\n// 4. start\npnpm run dev\n\n```\n"),x=(0,i.jsx)(d,{title:"@my-react online example",allowFullScreen:!0,marginX:"auto",width:{base:"100%",md:"80%"},height:"660",outline:"1px solid #252525",borderRadius:"4",zIndex:"100",marginBottom:"1em",src:"https://codesandbox.io/p/sandbox/zen-allen-mfwmmg?embed=1"}),u=()=>{const e=(0,s.useColorModeValue)("gray.300","gray.600");return(0,i.jsxs)(s.Container,{maxWidth:l.R,minHeight:"100vh",children:[(0,i.jsxs)(s.Flex,{justifyContent:"space-between",marginTop:"4%",flexDirection:{base:"column",md:"row"},children:[(0,i.jsxs)(s.Box,{alignSelf:"flex-start",marginLeft:{base:"4%",md:"6%",lg:"8%"},marginRight:{base:"1%",md:"0"},maxWidth:{base:"100%",md:"40%"},children:[(0,i.jsxs)(s.Heading,{as:"h1",fontSize:{base:"xl",md:"3xl",lg:"4xl"},marginTop:"6",children:["Quick start in ",(0,i.jsx)(s.Tag,{fontSize:"inherit",children:"Next.js"})]}),(0,i.jsx)(s.Text,{fontSize:"sm",color:"lightTextColor",marginY:"2",lineHeight:"180%",children:"Currently not support Next.js 13+, also not support React `RSC`."}),(0,i.jsx)(s.Text,{fontSize:"sm",color:"lightTextColor",marginY:"2",lineHeight:"180%",children:"This project is only a experimental project, not recommend use in the production environment."}),(0,i.jsx)(s.Spacer,{marginTop:"4"}),(0,i.jsxs)(s.HStack,{children:[(0,i.jsx)(s.Tooltip,{label:(0,i.jsxs)(s.Text,{children:["A static ",(0,i.jsx)(s.Tag,{children:"Next.js"})," site power by @my-react"]}),hasArrow:!0,placement:"top",bg:e,color:"black",children:(0,i.jsx)(s.Button,{as:"a",href:"https://mrwangjusttodo.github.io/MrWangJustToDo.io",colorScheme:"purple",target:"_blank",children:"Online Example"})}),(0,i.jsx)(s.Tooltip,{label:(0,i.jsxs)(s.Text,{children:["A ",(0,i.jsx)(s.Tag,{children:"Next.js"})," template power by @my-react"]}),hasArrow:!0,placement:"top",bg:e,color:"black",children:(0,i.jsx)(s.Button,{as:"a",href:"https://github.com/MrWangJustToDo/MyReact/tree/main/ui/next-example",colorScheme:"purple",target:"_blank",children:"Example"})})]})]}),(0,i.jsx)(s.Box,{className:"typo",overflow:{base:"hidden",lg:"auto"},border:"1px solid",borderColor:"cardBorderColor",marginRight:{base:"4%",md:"16%"},marginTop:{base:"10%",md:"0"},marginLeft:{base:"4%",md:"1%"},marginBottom:{base:"6%"},borderRadius:"0.8em",fontSize:{base:"sm",lg:"medium"},sx:{pre:{margin:"0"}},dangerouslySetInnerHTML:{__html:m}})]}),x]})},h=c.B1.render('\n```js\n// 1. create a Vite React template\n\n// 2. install @my-react\npnpm add @my-react/react @my-react/react-dom\n\npnpm add -D @my-react/react-refresh @my-react/react-vite\n\n// 3. config vite.config.ts\nimport react from "@my-react/react-vite";\n\nexport default defineConfig({\n  plugins: [react()],\n});\n\n// 4. start\npnpm run dev\n\n```\n'),p=()=>{const e=(0,s.useColorModeValue)("gray.300","gray.600");return(0,i.jsx)(s.Container,{maxWidth:l.R,minHeight:"100vh",children:(0,i.jsxs)(s.Flex,{justifyContent:"space-between",marginTop:"4%",flexDirection:{base:"column",md:"row"},children:[(0,i.jsxs)(s.Box,{alignSelf:"flex-start",marginLeft:{base:"4%",md:"6%",lg:"8%"},marginRight:{base:"1%",md:"0"},maxWidth:{base:"100%",md:"40%"},children:[(0,i.jsxs)(s.Heading,{as:"h1",fontSize:{base:"xl",md:"3xl",lg:"4xl"},marginTop:"6",children:["Quick start in ",(0,i.jsx)(s.Tag,{fontSize:"inherit",children:"Vite"})]}),(0,i.jsx)(s.Text,{fontSize:"sm",color:"lightTextColor",marginY:"2",lineHeight:"180%",children:"This project is only a experimental project, not recommend use in the production environment."}),(0,i.jsx)(s.Spacer,{marginTop:"4"}),(0,i.jsx)(s.Tooltip,{label:(0,i.jsxs)(s.Text,{children:["A ",(0,i.jsx)(s.Tag,{children:"Vite"})," template power by @my-react"]}),hasArrow:!0,placement:"top",bg:e,color:"black",children:(0,i.jsx)(s.Button,{as:"a",href:"https://github.com/MrWangJustToDo/MyReact/tree/main/ui/vite-example",colorScheme:"purple",target:"_blank",children:"Example"})})]}),(0,i.jsx)(s.Box,{className:"typo",overflow:{base:"hidden",lg:"auto"},border:"1px solid",borderColor:"cardBorderColor",marginRight:{base:"4%",md:"16%"},marginTop:{base:"10%",md:"0"},marginLeft:{base:"4%",md:"1%"},marginBottom:{base:"6%"},borderRadius:"0.8em",fontSize:{base:"sm",lg:"medium"},sx:{pre:{margin:"0"}},dangerouslySetInnerHTML:{__html:h}})]})})},g=(0,n.lazy)((()=>Promise.resolve().then(t.bind(t,788)).then((({ApiSection:e})=>({default:e}))))),y=()=>(0,i.jsx)(i.Fragment,{children:(0,i.jsxs)(o.mT,{initialSectionLength:1,children:[(0,i.jsxs)(o.MV,{children:[(0,i.jsx)(o.Yu,{children:(0,i.jsx)(a.MainSection,{})}),(0,i.jsx)(o.Yu,{children:(0,i.jsx)(u,{})}),(0,i.jsx)(o.Yu,{children:(0,i.jsx)(p,{})}),(0,i.jsx)(o.Yu,{children:(0,i.jsx)(g,{})})]}),(0,i.jsx)(o.T3,{}),(0,i.jsx)(o.pU,{})]})}),f=!0},4676:(e,r,t)=>{t.d(r,{B1:()=>A,H9:()=>L});var n=t(9653),o=t.n(n),a=t(2145),s=t.n(a),l=t(6780),c=t.n(l),i=t(9169),d=t.n(i),m=t(2767),x=t.n(m),u=t(7985),h=t.n(u),p=t(5356),g=t.n(p),y=t(2067),f=t.n(y),b=t(1570),j=t.n(b),C=t(2441),S=t.n(C),w=t(1927),R=t.n(w),v=t(5519),k=t.n(v),I=t(373),T=t.n(I),P=t(9372),D=t.n(P);s().registerLanguage("css",d()),s().registerLanguage("json",g()),s().registerLanguage("java",x()),s().registerLanguage("bash",c()),s().registerLanguage("markdown",j()),s().registerLanguage("javascript",h()),s().registerLanguage("typescript",T()),s().registerLanguage("less",f()),s().registerLanguage("scss",S()),s().registerLanguage("shell",R()),s().registerLanguage("xml",D()),s().registerLanguage("sql",k());const B=s(),z=new(o()),A=new(o())({html:!0,xhtmlOut:!0,breaks:!0,highlight:function(e,r){let t="";try{t=r&&B.getLanguage(r)?B.highlight(e,{language:r,ignoreIllegals:!0}).value:B.highlightAuto(e,["typescript","javascript","xml","scss","less","json","bash"]).value;const n=t.split(/\n/).slice(0,-1),o=String(n.length).length-.2;return`<pre class="rounded position-relative"><code class="hljs ${r}" style='padding-top: 30px;'>${n.reduce(((e,r,t)=>`${e}<span class='no-select d-inline-block text-center border-right pr-2 mr-2 border-dark' style='min-width: ${o}em; line-height: 1.5'>${t+1}</span>${r}\n`),`<div class='w-100 position-absolute' style='left: 0; top: 0; font-size: 0px'>\n          <b class='no-select position-absolute text-info' style='left: 10px; font-size: 12px; top: 4px;'>${r}</b>\n          <div class='position-absolute w-100 border-bottom border-dark' style='left: 0; top: 24px;'></div>\n        </div>`)}</code></pre>`}catch(e){}}}),L=new(o())({html:!0,xhtmlOut:!0,breaks:!0,highlight:function(e,r){if(r&&B.getLanguage(r))try{return`<pre class="rounded bg-dark"><code class="bg-dark hljs ${r}">${B.highlight(e,{language:r,ignoreIllegals:!0}).value}</code></pre>`}catch(e){}return`<pre class="rounded bg-dark"><code class="bg-dark hljs">${z.utils.escapeHtml(e)}</code></pre>`}})}};