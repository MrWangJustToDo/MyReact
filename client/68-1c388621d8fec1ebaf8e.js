"use strict";(self.webpackChunk_my_react_ssr_example=self.webpackChunk_my_react_ssr_example||[]).push([[68],{18068:(e,r,n)=>{n.d(r,{BO:()=>m,Ns:()=>h,X8:()=>k,ZL:()=>w,eq:()=>I,wn:()=>E,XI:()=>Fe});var t=n(50776),o=n(14313),c=n(53177),i=n(23497),l=n(61500),a=n(99590),s=n(89470),u=n(61732),d=(0,u.createContext)({totalSection:0,currentSection:0,setTotalSection:function(e){},setCurrentSection:function(e){},onNextSection:function(){},onPrevSection:function(){}}),f=function(){return(0,u.useContext)(d)},p=n(14980),h=function(e){var r=e.onSectionIndexChange,n=e.children,t=e.initialSectionLength,o=(0,u.useState)(0),c=(0,l.A)(o,2),i=c[0],f=c[1],h=(0,u.useState)(t||0),x=(0,l.A)(h,2),b=x[0],y=x[1],g=(0,a.Z)(i),j=(0,s.c)(r),v=(0,s.c)((function(){f(i===b-1?0:function(e){return e+1})})),O=(0,s.c)((function(){f(0===i?b-1:function(e){return e-1})}));(0,u.useEffect)((function(){j(i,g)}),[i,j]);var w=(0,u.useMemo)((function(){return{totalSection:b,currentSection:i,onNextSection:v,onPrevSection:O,setCurrentSection:f,setTotalSection:y}}),[i,v,O,b]);return(0,p.jsx)(d.Provider,{value:w,children:n})},x=n(2694),b=n(81521),y=n(85886),g=n(73853),j=n(68525),v=(0,u.createContext)({ref:{current:null}}),O=(0,u.createContext)({inViewArray:[],setCurrentView:function(e,r){}}),w=function(e){var r=e.children,n=e.index,t=(0,u.useRef)(null),o=(0,u.useMemo)((function(){return{ref:t}}),[]),c=f().currentSection,i=(0,u.useContext)(O),l=i.setCurrentView,a=i.inViewArray,s=(0,j.W)(t,{amount:"some",margin:"-300px 0px"});return(0,u.useEffect)((function(){null!=n&&l(s,n)}),[n,s,l,a.length]),(0,p.jsx)(v.Provider,{value:o,children:(0,p.jsx)(g.az,{ref:t,position:"relative",overflow:"hidden","data-scroll-section":n,"data-active":c===n,children:r})})},m=function(e){var r=e.children,n=[],o=(0,t.L)().scrollY;u.Children.forEach(r,(function(e){(0,u.isValidElement)(e)&&e.type===w&&n.push(e)}));var c=n.length,i=(0,u.useState)((function(){return Array(c).fill(!1)})),a=(0,l.A)(i,2),d=a[0],h=a[1];(0,u.useEffect)((function(){h(Array(c).fill(!1))}),[c]);var g=(0,s.c)((function(e,r){h((function(n){if(n[r]!==e){var t=(0,x.A)(n);return t[r]=e,t}return n}))})),j=(0,u.useMemo)((function(){return{inViewArray:d,setCurrentView:g}}),[d,g]),v=f(),m=v.setTotalSection,P=v.setCurrentSection,S=v.currentSection,C=(0,s.c)((function(e){e?d[S-1]&&P(S-1):d[S+1]&&P(S+1)}));return(0,u.useEffect)((function(){var e=0,r=(0,y.A)((function(r){C(!(r>e)),e=r}),100,{leading:!0,trailing:!0});return o.onChange(r),function(){return o.clearListeners()}}),[C,o]),(0,b.U)((function(){m(c),P(0)}),[c,m,P]),(0,p.jsx)(O.Provider,{value:j,children:u.Children.map(n,(function(e,r){return(0,u.cloneElement)(e,{index:r})}))})},P=n(61691),S=function(e){var r=e.className;return(0,p.jsx)("svg",{className:r,width:"14",height:"8",viewBox:"0 0 14 8",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,p.jsx)("path",{d:"M1 7L7 1L13 7",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})},C=(0,u.memo)(S),I=function(){var e=f().currentSection;return(0,p.jsx)(g.az,{fontSize:"20px",position:"fixed",right:"10px",bottom:"20px",width:"20px",height:"20px",color:"orangeSand",textAlign:"center",verticalAlign:"middle",borderRadius:"999999px",zIndex:"sticky",display:{base:e>0?"flex":"none",md:"none"},alignItems:"center",justifyContent:"center",onClick:function(){window.scrollTo({top:0,behavior:"smooth"})},children:(0,p.jsx)(P.I,{as:C,width:"20px",height:"20px"})})},D=n(34093),A=n(70359),k=function(e){var r=e.render,n=f(),t=n.totalSection,o=n.currentSection,c=(0,s.c)((function(e){var r=document.querySelector('[data-scroll-section="'.concat(e,'"]'));if(r){var n,t=r.getBoundingClientRect(),o=((null===(n=document.scrollingElement)||void 0===n?void 0:n.scrollTop)||0)+t.top;window.scrollTo({top:o,behavior:"smooth"})}})),i=(0,u.useMemo)((function(){return Array(t).fill(0)}),[t]);return t<=1?null:(0,p.jsx)(D.s,{height:"100vh",position:"fixed",width:"30px",display:{base:"none",md:"flex"},flexDirection:"column",top:"0",right:"100px",alignItems:"center",justifyContent:"center",zIndex:"dropdown","data-scroll-tool":!0,children:o<=t-1&&(0,p.jsx)(A.B,{spacing:"6",children:i.map((function(e,n){return(0,p.jsx)(A.Q,{children:r?r({index:n,isSelect:o===n,onClick:function(){return c(n)}}):(0,p.jsx)(g.az,{width:"10px",height:"10px",cursor:"pointer",borderRadius:"full",sx:{backgroundColor:o===n?"purple.600":"initial",border:o===n?"none":"1.5px solid #e2e2e2"},onClick:function(){return c(n)}})},n)}))})})},R=function(e){var r=e.children,n=(0,u.useContext)(v).ref,i=(0,t.L)({target:n,axis:"y",offset:["-0.5","0.5"]}).scrollYProgress,l=(0,o.G)(i,[0,.3,.65,1],[.3,1,1,.5]),a=(0,o.G)(i,[0,.3,.65,1],[100,0,0,-120]);return(0,p.jsx)(c.P.div,{style:{opacity:l,y:a},children:r})},E=function(e){var r=e.children;return(0,i.aq)()?(0,p.jsx)(R,{children:r}):r},z=n(77343),N=n(63810),T=n(64466),F=n(93783);function B(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function V(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?B(Object(n),!0).forEach((function(r){(0,z.A)(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):B(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}var _=function(e){var r=Object.assign({},((0,N.A)(e),e));return(0,p.jsx)(T.K,{children:(0,p.jsx)(F.X,V({variant:"simple"},r))})};function L(e){return e.dataIndex,e.cellProps,e.headCellProps,e.bodyCellProps,e.isHidden,e.headCellRender,e.bodyCellRender,(0,p.jsx)(p.Fragment,{})}var M=n(16801),W=n(57452),q=n(37316),K=["page","total","pageSize","onChange","preButtonProps","nextButtonProps"];function X(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function G(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?X(Object(n),!0).forEach((function(r){(0,z.A)(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):X(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}var H=function(e){return(0,p.jsx)(W.$,G(G({border:"1px",size:"sm",borderColor:"gray.200",textStyle:"light",fontWeight:"normal",_active:{background:"none"},_hover:{background:"none"},fontSize:"sm"},e),{},{children:e.children}))},Y=function(e){var r=e.page,n=e.total,t=e.pageSize,o=void 0===t?50:t,c=e.onChange,i=e.preButtonProps,l=e.nextButtonProps,a=(0,M.A)(e,K),s=function(e){var r=e.page,n=e.total,t=e.pageSize,o=void 0===t?50:t,c=n?Math.ceil(n/o):1;return{totalPage:c,hasNextPage:r<c,hasPrePage:r>1}}({page:r,total:n,pageSize:o}),u=s.hasNextPage,d=s.hasPrePage;return(0,p.jsxs)(D.s,G(G({justifyContent:"flex-end"},a),{},{children:[d&&(0,p.jsx)(H,G(G({"aria-label":"Prev page",leftIcon:(0,p.jsx)(P.I,{as:q.qXl}),onClick:function(){c(r-1)},marginEnd:"4"},i),{},{children:(null==i?void 0:i.children)||"prevPage"})),u&&(0,p.jsx)(H,G(G({"aria-label":"Next page",rightIcon:(0,p.jsx)(P.I,{as:q.BJp}),onClick:function(){c(r+1)},marginEnd:{base:4,lg:0}},l),{},{children:(null==l?void 0:l.children)||"nextPage"}))]}))},Z=n(718),J=n(79045),Q=n(76540),U=n(76488),$=n(38001),ee=n(15387),re=n(48945),ne=n(33465),te=n(73137),oe=n(41410),ce=n(6910);var ie=function(e){(0,te.A)(o,e);var r,n,t=(r=o,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=(0,ce.A)(r);if(n){var o=(0,ce.A)(this).constructor;e=Reflect.construct(t,arguments,o)}else e=t.apply(this,arguments);return(0,oe.A)(this,e)});function o(){var e;(0,re.A)(this,o);for(var r=arguments.length,n=new Array(r),c=0;c<r;c++)n[c]=arguments[c];return(e=t.call.apply(t,[this].concat(n))).state={error:"",stack:"",hasError:!1},e}return(0,ne.A)(o,[{key:"componentDidCatch",value:function(e,r){this.setState({error:e.message,stack:r.componentStack})}},{key:"render",value:function(){var e=this.state,r=e.hasError,n=e.stack,t=e.error;return r?(console.error(t,n),"some error happen"):this.props.children}}],[{key:"getDerivedStateFromError",value:function(){return{hasError:!0}}}]),o}(u.Component),le=["children"];function ae(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function se(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?ae(Object(n),!0).forEach((function(r){(0,z.A)(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ae(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}var ue=function(e){var r=e.children,n=(0,M.A)(e,le);return(0,p.jsx)(ee.Td,se(se({},n),{},{children:(0,p.jsx)(ie,{children:r})}))},de=["Render"],fe=["Render","CustomRender","dataIndex","rowIndex","colIndex","rowData","cellProps"],pe=["Render","CustomRender","dataIndex","rowIndex","colIndex","rowData","cellProps","showSkeleton","Skeleton"];function he(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function xe(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?he(Object(n),!0).forEach((function(r){(0,z.A)(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):he(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}var be=function(e){var r=e.Render,n=(0,M.A)(e,de);return(0,p.jsx)(p.Fragment,{children:r(n)})},ye=function(e){var r=e.Render,n=e.CustomRender,t=e.dataIndex,o=e.rowIndex,c=e.colIndex,i=e.rowData,l=e.cellProps,a=(0,M.A)(e,fe);return"function"==typeof n?n(t?{rowData:i,rowIndex:o,colIndex:c,dataIndex:t,cellData:i[t]}:{rowData:i,rowIndex:o,colIndex:c}):(0,p.jsx)(ue,xe(xe(xe({fontWeight:"medium"},a),l),{},{children:"function"==typeof r?(0,p.jsx)(be,{Render:r,dataIndex:t||"",rowIndex:o,colIndex:c,cellData:t?i[t]:{},rowData:i}):r}))};function ge(e){var r=e.Render,n=e.CustomRender,t=e.dataIndex,o=e.rowIndex,c=e.colIndex,i=e.rowData,l=e.cellProps,a=e.showSkeleton,s=void 0===a?function(e){return!e.rowData}:a,u=e.Skeleton,d=(0,M.A)(e,pe);return("function"==typeof s?s({rowIndex:o,rowData:i,colIndex:c}):s)?u?(0,p.jsx)(ue,xe(xe(xe({fontWeight:"medium"},d),l),{},{children:(0,p.jsx)(u,{rowIndex:o,colIndex:c})})):(0,p.jsx)(ue,xe(xe(xe({fontWeight:"medium"},d),l),{},{children:(0,p.jsx)($.E,{width:"80%",height:"24px"})})):(0,p.jsx)(ye,xe({},xe({rowData:i,rowIndex:o,dataIndex:t,colIndex:c,cellProps:l,Render:r,CustomRender:n},d)))}var je=n(60186),ve=n(66637),Oe=n(2663),we=function(e){return e[e.None=0]="None",e[e.Asc=1]="Asc",e[e.Desc=2]="Desc",e}({});function me(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function Pe(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?me(Object(n),!0).forEach((function(r){(0,z.A)(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):me(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}var Se=(0,u.createContext)({sorter:{order:we.None},onSort:function(){}});function Ce(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function Ie(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?Ce(Object(n),!0).forEach((function(r){(0,z.A)(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Ce(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function De(e){var r=e.Render,n=e.CustomRender,t=e.genCompareFn,o=e.dataIndex,c=e.rowIndex,i=e.colIndex,l=e.cellProps,a=e.cancelSort,s=e.sort,d=e.sortedColor,f=void 0===d?"blue.500":d,h=e.defaultOrder,x=void 0===h?we.Desc:h,b=e.tooltipProps,y=(0,u.useContext)(Se),j=y.sorter,v=y.onSort,O=(0,u.useCallback)((function(e){return(null==j?void 0:j.by)===o&&(null==j?void 0:j.order)===e?f:void 0}),[o,j,f]),w=(0,u.useMemo)((function(){return(null==j?void 0:j.by)!==o||(null==j?void 0:j.order)===we.None?x:a&&(null==j?void 0:j.order)!=x?we.None:(null==j?void 0:j.order)===we.Asc?we.Desc:we.Asc}),[o,j,x,a]);if("function"==typeof n){var m=null;return m=n(o?{dataIndex:o,rowIndex:c,colIndex:i,sorter:j,onSort:v,genCompareFn:t,defaultOrder:x,cancelSort:a,sorterClick:function(){t&&(null==j?void 0:j.genCompareFn)!==t?v({by:o,order:w,genCompareFn:t}):v({by:o,order:w})},sortAscColor:O(we.Asc),sortDescColor:O(we.Desc),toggledSortOrder:w}:{rowIndex:c,colIndex:i,sorter:j,onSort:v,sort:s,defaultOrder:x,sortAscColor:O(we.Asc),sortDescColor:O(we.Desc)}),b?(0,p.jsx)(je.m,Ie(Ie({},b),{},{children:m})):m}var S="function"==typeof r?r({dataIndex:o||"",rowIndex:c,colIndex:i}):r,C="Sort by ".concat("string"==typeof r?r:o.toString()),I=s?(0,p.jsxs)(D.s,{display:"inline-flex",as:"button",width:"auto",cursor:"pointer","aria-label":C,textTransform:"inherit",fontWeight:"semibold",onClick:function(){t&&(null==j?void 0:j.genCompareFn)!==t?v({by:o,order:w,genCompareFn:t}):v({by:o,order:w})},alignItems:"center",children:[S,(0,p.jsxs)(D.s,{transform:"scale(0.7)",marginStart:"2px",flexDirection:"column",children:[(0,p.jsx)(ve.K,{icon:(0,p.jsx)(P.I,{as:q.Kj1}),"aria-label":"Sort ascend",fontSize:"xx-small",color:O(we.Asc)}),(0,p.jsx)(ve.K,{icon:(0,p.jsx)(P.I,{as:q.zAG}),"aria-label":"Sort descend",fontSize:"xx-small",color:O(we.Desc)})]})]}):(0,p.jsx)(g.az,{fontWeight:"semibold",children:S});return(0,p.jsx)(Oe.Th,Ie(Ie({textTransform:"none",color:"inherit"},l),{},{children:b?(0,p.jsx)(je.m,Ie(Ie({},b),{},{children:I})):I}))}var Ae=["cellProps"],ke=["cellProps"];function Re(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function Ee(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?Re(Object(n),!0).forEach((function(r){(0,z.A)(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Re(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}(0,U.A)((function(){console.warn("pls make sure:\n 1. do not add hook into hyper column usage.\n 2. hyper column usage do not support hot reload")}));var ze=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return{skeletonRows:(0,u.useMemo)((function(){return new Array(r).fill(null)}),[r]),skeletonVisible:!e}};function Ne(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function Te(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?Ne(Object(n),!0).forEach((function(r){(0,z.A)(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Ne(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function Fe(e){var r=e.dataSource,n=e.sorter,t=e.pagination,o=(e.noResultText,e.CustomNoResult),c=e.tableProps,i=e.skeletonRowCount,a=e.rowProps,s=e.children,d=e.containerProps,f=function(e,r,n){var t=(0,u.useState)(Pe({order:we.None,genCompareFn:function(e){return function(r,n){var t=e.by;return null===t?0:t in r&&t in n?e.order===we.Asc?r[t].length-n[t].length:n[t].length-r[t].length:0}}},e)),o=(0,l.A)(t,2),c=o[0],i=o[1],a=(0,u.useCallback)((function(e){var r,n=Pe(Pe({},c),e);null===(r=e.onSort)||void 0===r||r.call(e,n),i(n)}),[c]),s=(0,u.useMemo)((function(){var e,t=(0,x.A)(r||[]);return c.order!==we.None&&(t.sort(null===(e=c.genCompareFn)||void 0===e?void 0:e.call(c,c)),n&&n()),t}),[r,c,n]);return{innerSorter:c,onSort:a,sortedRows:s}}(n,r,e.afterSorting),h=f.innerSorter,b=f.onSort,y=f.sortedRows,j=ze(r,i),v=j.skeletonRows,O=j.skeletonVisible,w=function(e,r){var n=[],t=[],o=e;(0,u.isValidElement)(e)&&e.type===u.Fragment&&(o=e.props.children),u.Children.forEach(o,(function(e){var r=null;if((null==e?void 0:e.type)===L)r=e;else if("function"==typeof(null==e?void 0:e.type))try{var o=e.type(e.props);(0,u.isValidElement)(o)&&o.type===L&&(r=o)}catch(e){}if(r){var c=r.props,i=c.dataIndex,l=c.cellProps,a=c.headCellProps,s=c.bodyCellProps,d=c.isHidden,f=c.headCellRender,h=c.bodyCellRender,x=(Array.isArray(f)?f:[f]).map((function(e){var r=e.cellProps,n=(0,M.A)(e,Ae);return function(e){var t=e.rowIndex,o=e.colIndex;return(0,p.jsx)(De,Ee({rowIndex:t,colIndex:o,dataIndex:i,cellProps:Ee(Ee(Ee({},l),r),a)},n),i?String(i):"".concat(t,"-").concat(o))}})),b=h.cellProps,y=(0,M.A)(h,ke);d||(t.push((function(e){var r=e.rowIndex,n=e.colIndex,t=e.rowData;return(0,p.jsx)(ge,Ee({rowIndex:r,colIndex:n,rowData:t,dataIndex:i,cellProps:Ee(Ee(Ee({},l),b),s)},y),i?String(i):"".concat(r,"-").concat(n))})),x.forEach((function(e,r){n[r]=n[r]||[],n[r].push(e)})))}}));var c=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=(0,u.useRef)({headCellRender:e,rowProps:r});return n.current={headCellRender:e,rowProps:r},(0,u.useCallback)((function(){var e=n.current,r=e.headCellRender,t=e.rowProps,o=t.commonRow,c=t.theadRow;return(0,p.jsx)(Z.d,{children:r.map((function(e,r){var n=Ee(Ee({},o),Array.isArray(c)?c[r]:c);return(0,p.jsx)(J.Tr,Ee(Ee({},n),{},{children:e.map((function(e,n){return e({rowIndex:r,colIndex:n})}))}),r)}))})}),[])}(n,r),i=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=(0,u.useRef)({bodyCellRender:e,rowProps:r});return n.current={bodyCellRender:e,rowProps:r},(0,u.useCallback)((function(e){var r=e.dataSource,t=n.current,o=t.bodyCellRender,c=t.rowProps,i=c.commonRow,l=c.tbodyRow,a=c.genTbodyRow;return(0,p.jsx)(Q.N,{children:r.map((function(e,r){var n=Ee(Ee({},i),l),t=a?a({rowIndex:r,rowData:e}):{};return(0,p.jsx)(J.Tr,Ee(Ee(Ee({},n),t),{},{children:o.map((function(n,t){return n({rowData:e,rowIndex:r,colIndex:t})}))}),r)}))})}),[])}(t,r);return(0,u.useCallback)((function(e){var r=e.dataSource;return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(c,{}),(0,p.jsx)(i,{dataSource:r})]})}),[i,c])}(s,a);return(0,p.jsxs)(Se.Provider,{value:{sorter:h,onSort:b},children:[(0,p.jsxs)(g.az,Te(Te({},d),{},{children:[(0,p.jsx)(_,Te(Te({},c),{},{children:s&&(0,p.jsx)(w,{dataSource:O?v:y})})),!O&&0===y.length&&(o?(0,p.jsx)(o,{}):"empty")]})),!!t&&(0,p.jsx)(Y,Te({},t))]})}Fe.Column=L}}]);