"use strict";(self.__LOADABLE_LOADED_CHUNKS__=self.__LOADABLE_LOADED_CHUNKS__||[]).push([[617],{89882:(e,r,t)=>{t.d(r,{MV:()=>j,mT:()=>d,T3:()=>R,Yu:()=>b,pU:()=>O,iA:()=>Re});var n=t(53129),o=(t(7999),t(78153)),a=t(53850),c=t(37923),i=(0,n.createContext)({totalSection:0,currentSection:0,setTotalSection:function(e){},setCurrentSection:function(e){},onNextSection:function(){},onPrevSection:function(){}}),l=function(){return(0,n.useContext)(i)},s=t(41250),d=function(e){var r=e.onSectionIndexChange,t=e.children,l=e.initialSectionLength,d=(0,n.useState)(0),u=(0,o.Z)(d,2),m=u[0],p=u[1],f=(0,n.useState)(l||0),h=(0,o.Z)(f,2),g=h[0],x=h[1],y=(0,a.D)(m),b=(0,c.W)(r),j=(0,c.W)((function(){p(m===g-1?0:function(e){return e+1})})),v=(0,c.W)((function(){p(0===m?g-1:function(e){return e-1})}));(0,n.useEffect)((function(){b(m,y)}),[m,b]);var w=(0,n.useMemo)((function(){return{totalSection:g,currentSection:m,onNextSection:j,onPrevSection:v,setCurrentSection:p,setTotalSection:x}}),[m,j,v,g]);return(0,s.jsx)(i.Provider,{value:w,children:t})},u=t(96629),m=t(86194),p=t(89340),f=t(23417),h=t(37308),g=t(70385),x=(0,n.createContext)({ref:{current:null}}),y=(0,n.createContext)({inViewArray:[],setCurrentView:function(e,r){}}),b=function(e){var r=e.children,t=e.index,o=(0,n.useRef)(null),a=(0,n.useMemo)((function(){return{ref:o}}),[]),c=l().currentSection,i=(0,n.useContext)(y),d=i.setCurrentView,u=i.inViewArray,m=(0,g.Y)(o,{amount:"some",margin:"-300px 0px"});return(0,n.useEffect)((function(){null!=t&&d(m,t)}),[t,m,d,u.length]),(0,s.jsx)(x.Provider,{value:a,children:(0,s.jsx)(h.xu,{ref:o,position:"relative",overflow:"hidden","data-scroll-section":t,"data-active":c===t,children:r})})},j=function(e){var r=e.children,t=[],a=(0,p.v)().scrollY;n.Children.forEach(r,(function(e){(0,n.isValidElement)(e)&&e.type===b&&t.push(e)}));var i=t.length,d=(0,n.useState)((function(){return Array(i).fill(!1)})),h=(0,o.Z)(d,2),g=h[0],x=h[1];(0,n.useEffect)((function(){x(Array(i).fill(!1))}),[i]);var j=(0,c.W)((function(e,r){x((function(t){if(t[r]!==e){var n=(0,u.Z)(t);return n[r]=e,n}return t}))})),v=(0,n.useMemo)((function(){return{inViewArray:g,setCurrentView:j}}),[g,j]),w=l(),S=w.setTotalSection,O=w.setCurrentSection,C=w.currentSection,P=(0,c.W)((function(e){e?g[C-1]&&O(C-1):g[C+1]&&O(C+1)}));return(0,n.useEffect)((function(){var e=0,r=(0,f.Z)((function(r){P(!(r>e)),e=r}),100,{leading:!0,trailing:!0});return a.onChange(r),function(){return a.clearListeners()}}),[P,a]),(0,m.G)((function(){S(i),O(0)}),[i,S,O]),(0,s.jsx)(y.Provider,{value:v,children:n.Children.map(t,(function(e,r){return(0,n.cloneElement)(e,{index:r})}))})},v=t(16068),w=function(e){var r=e.className;return(0,s.jsx)("svg",{className:r,width:"14",height:"8",viewBox:"0 0 14 8",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,s.jsx)("path",{d:"M1 7L7 1L13 7",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})},S=(0,n.memo)(w),O=function(){var e=l().currentSection;return(0,s.jsx)(h.xu,{fontSize:"20px",position:"fixed",right:"10px",bottom:"20px",width:"20px",height:"20px",color:"orangeSand",textAlign:"center",verticalAlign:"middle",borderRadius:"999999px",zIndex:"sticky",display:{base:e>0?"flex":"none",md:"none"},alignItems:"center",justifyContent:"center",onClick:function(){window.scrollTo({top:0,behavior:"smooth"})},children:(0,s.jsx)(v.J,{as:S,width:"20px",height:"20px"})})},C=t(92826),P=t(59923),R=function(e){var r=e.render,t=l(),o=t.totalSection,a=t.currentSection,i=(0,c.W)((function(e){var r=document.querySelector('[data-scroll-section="'.concat(e,'"]'));if(r){var t,n=r.getBoundingClientRect(),o=((null===(t=document.scrollingElement)||void 0===t?void 0:t.scrollTop)||0)+n.top;window.scrollTo({top:o,behavior:"smooth"})}})),d=(0,n.useMemo)((function(){return Array(o).fill(0)}),[o]);return o<=1?null:(0,s.jsx)(C.k,{height:"100vh",position:"fixed",width:"30px",display:{base:"none",md:"flex"},flexDirection:"column",top:"0",right:"100px",alignItems:"center",justifyContent:"center",zIndex:"dropdown","data-scroll-tool":!0,children:a<=o-1&&(0,s.jsx)(P.E,{spacing:"6",children:d.map((function(e,t){return(0,s.jsx)(P.U,{children:r?r({index:t,isSelect:a===t,onClick:function(){return i(t)}}):(0,s.jsx)(h.xu,{width:"10px",height:"10px",cursor:"pointer",borderRadius:"full",sx:{backgroundColor:a===t?"red":"initial",border:a===t?"none":"1px solid #e2e2e2"},onClick:function(){return i(t)}})},t)}))})})},k=t(88213),D=t(65658),I=t(84354),E=t(80233);function Z(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function z(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?Z(Object(t),!0).forEach((function(r){(0,k.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):Z(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}var T=function(e){var r=Object.assign({},((0,D.Z)(e),e));return(0,s.jsx)(I.x,{children:(0,s.jsx)(E.i,z({variant:"simple"},r))})};function A(e){return e.dataIndex,e.cellProps,e.headCellProps,e.bodyCellProps,e.isHidden,e.headCellRender,e.bodyCellRender,(0,s.jsx)(s.Fragment,{})}var L=t(20140),M=t(26528),N=t(28150),B=["page","total","pageSize","onChange","preButtonProps","nextButtonProps"];function W(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function V(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?W(Object(t),!0).forEach((function(r){(0,k.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):W(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}var _=function(e){return(0,s.jsx)(M.z,V(V({border:"1px",size:"sm",borderColor:"gray.200",textStyle:"light",fontWeight:"normal",_active:{background:"none"},_hover:{background:"none"},fontSize:"sm"},e),{},{children:e.children}))},H=function(e){var r=e.page,t=e.total,n=e.pageSize,o=void 0===n?50:n,a=e.onChange,c=e.preButtonProps,i=e.nextButtonProps,l=(0,L.Z)(e,B),d=function(e){var r=e.page,t=e.total,n=e.pageSize,o=void 0===n?50:n,a=t?Math.ceil(t/o):1;return{totalPage:a,hasNextPage:r<a,hasPrePage:r>1}}({page:r,total:t,pageSize:o}),u=d.hasNextPage,m=d.hasPrePage;return(0,s.jsxs)(C.k,V(V({justifyContent:"flex-end"},l),{},{children:[m&&(0,s.jsx)(_,V(V({"aria-label":"Prev page",leftIcon:(0,s.jsx)(v.J,{as:N.CF5}),onClick:function(){a(r-1)},marginEnd:"4"},c),{},{children:(null==c?void 0:c.children)||"prevPage"})),u&&(0,s.jsx)(_,V(V({"aria-label":"Next page",rightIcon:(0,s.jsx)(v.J,{as:N.Td4}),onClick:function(){a(r+1)},marginEnd:{base:4,lg:0}},i),{},{children:(null==i?void 0:i.children)||"nextPage"}))]}))},F=t(98709),U=t(25143),Y=t(54370),J=t(56898),X=t(77689),q=t(47231),G=t(72505),K=t(55368),Q=t(94781),$=t(67658),ee=t(18340);var re=function(e){(0,Q.Z)(o,e);var r,t,n=(r=o,t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,n=(0,ee.Z)(r);if(t){var o=(0,ee.Z)(this).constructor;e=Reflect.construct(n,arguments,o)}else e=n.apply(this,arguments);return(0,$.Z)(this,e)});function o(){var e;(0,G.Z)(this,o);for(var r=arguments.length,t=new Array(r),a=0;a<r;a++)t[a]=arguments[a];return(e=n.call.apply(n,[this].concat(t))).state={error:"",stack:"",hasError:!1},e}return(0,K.Z)(o,[{key:"componentDidCatch",value:function(e,r){this.setState({error:e.message,stack:r.componentStack})}},{key:"render",value:function(){var e=this.state,r=e.hasError,t=e.stack,n=e.error;return r?(console.error(n,t),""):this.props.children}}],[{key:"getDerivedStateFromError",value:function(){return{hasError:!0}}}]),o}(n.Component),te=["children"];function ne(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function oe(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ne(Object(t),!0).forEach((function(r){(0,k.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ne(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}var ae=function(e){var r=e.children,t=(0,L.Z)(e,te);return(0,s.jsx)(q.Td,oe(oe({},t),{},{children:(0,s.jsx)(re,{children:r})}))},ce=["Render","CustomRender","dataIndex","rowIndex","colIndex","rowData","cellProps"],ie=["Render","CustomRender","dataIndex","rowIndex","colIndex","rowData","cellProps","showSkeleton","Skeleton"];function le(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function se(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?le(Object(t),!0).forEach((function(r){(0,k.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):le(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}var de=function(e){var r=e.Render,t=e.CustomRender,n=e.dataIndex,o=e.rowIndex,a=e.colIndex,c=e.rowData,i=e.cellProps,l=(0,L.Z)(e,ce);return"function"==typeof t?t(n?{rowData:c,rowIndex:o,colIndex:a,dataIndex:n,cellData:c[n]}:{rowData:c,rowIndex:o,colIndex:a}):(0,s.jsx)(ae,se(se(se({fontWeight:"medium"},l),i),{},{children:"function"==typeof r?r({dataIndex:n||"",rowIndex:o,colIndex:a,cellData:n?c[n]:{},rowData:c}):r}))};function ue(e){var r=e.Render,t=e.CustomRender,n=e.dataIndex,o=e.rowIndex,a=e.colIndex,c=e.rowData,i=e.cellProps,l=e.showSkeleton,d=void 0===l?function(e){return!e.rowData}:l,u=e.Skeleton,m=(0,L.Z)(e,ie);return("function"==typeof d?d({rowIndex:o,rowData:c,colIndex:a}):d)?u?(0,s.jsx)(ae,se(se(se({fontWeight:"medium"},m),i),{},{children:(0,s.jsx)(u,{rowIndex:o,colIndex:a})})):(0,s.jsx)(ae,se(se(se({fontWeight:"medium"},m),i),{},{children:(0,s.jsx)(X.O,{width:"80%",height:"24px"})})):(0,s.jsx)(de,se({},se({rowData:c,rowIndex:o,dataIndex:n,colIndex:a,cellProps:i,Render:r,CustomRender:t},m)))}var me=t(28570),pe=t(19676),fe=t(44648),he=function(e){return e[e.None=0]="None",e[e.Asc=1]="Asc",e[e.Desc=2]="Desc",e}({});function ge(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function xe(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ge(Object(t),!0).forEach((function(r){(0,k.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ge(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}var ye=(0,n.createContext)({sorter:{order:he.None},onSort:function(){}});function be(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function je(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?be(Object(t),!0).forEach((function(r){(0,k.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):be(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function ve(e){var r=e.Render,t=e.CustomRender,o=e.genCompareFn,a=e.dataIndex,c=e.rowIndex,i=e.colIndex,l=e.cellProps,d=e.cancelSort,u=e.sort,m=e.sortedColor,p=void 0===m?"blue.500":m,f=e.defaultOrder,g=void 0===f?he.Desc:f,x=e.tooltipProps,y=(0,n.useContext)(ye),b=y.sorter,j=y.onSort,w=(0,n.useCallback)((function(e){return(null==b?void 0:b.by)===a&&(null==b?void 0:b.order)===e?p:void 0}),[a,b,p]),S=(0,n.useMemo)((function(){return(null==b?void 0:b.by)!==a||(null==b?void 0:b.order)===he.None?g:d&&(null==b?void 0:b.order)!=g?he.None:(null==b?void 0:b.order)===he.Asc?he.Desc:he.Asc}),[a,b,g,d]);if("function"==typeof t){var O=null;return O=t(a?{dataIndex:a,rowIndex:c,colIndex:i,sorter:b,onSort:j,genCompareFn:o,defaultOrder:g,cancelSort:d,sorterClick:function(){o&&(null==b?void 0:b.genCompareFn)!==o?j({by:a,order:S,genCompareFn:o}):j({by:a,order:S})},sortAscColor:w(he.Asc),sortDescColor:w(he.Desc),toggledSortOrder:S}:{rowIndex:c,colIndex:i,sorter:b,onSort:j,sort:u,defaultOrder:g,sortAscColor:w(he.Asc),sortDescColor:w(he.Desc)}),x?(0,s.jsx)(me.u,je(je({},x),{},{children:O})):O}var P="function"==typeof r?r({dataIndex:a||"",rowIndex:c,colIndex:i}):r,R="Sort by ".concat("string"==typeof r?r:a.toString()),k=u?(0,s.jsxs)(C.k,{display:"inline-flex",as:"button",width:"auto",cursor:"pointer","aria-label":R,textTransform:"inherit",fontWeight:"semibold",onClick:function(){o&&(null==b?void 0:b.genCompareFn)!==o?j({by:a,order:S,genCompareFn:o}):j({by:a,order:S})},alignItems:"center",children:[P,(0,s.jsxs)(C.k,{transform:"scale(0.7)",marginStart:"2px",flexDirection:"column",children:[(0,s.jsx)(pe.h,{icon:(0,s.jsx)(v.J,{as:N.j9E}),"aria-label":"Sort ascend",fontSize:"xx-small",color:w(he.Asc)}),(0,s.jsx)(pe.h,{icon:(0,s.jsx)(v.J,{as:N.cuw}),"aria-label":"Sort descend",fontSize:"xx-small",color:w(he.Desc)})]})]}):(0,s.jsx)(h.xu,{fontWeight:"semibold",children:P});return(0,s.jsx)(fe.Th,je(je({textTransform:"none",color:"inherit"},l),{},{children:x?(0,s.jsx)(me.u,je(je({},x),{},{children:k})):k}))}function we(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function Se(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?we(Object(t),!0).forEach((function(r){(0,k.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):we(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}(0,J.Z)((function(){console.warn("pls make sure:\n 1. do not add hook into hyper column usage.\n 2. hyper column usage do not support hot reload")}));var Oe=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return{skeletonRows:(0,n.useMemo)((function(){return new Array(r).fill(null)}),[r]),skeletonVisible:!e}};function Ce(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function Pe(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?Ce(Object(t),!0).forEach((function(r){(0,k.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):Ce(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function Re(e){var r=e.dataSource,t=e.sorter,a=e.pagination,c=(e.noResultText,e.CustomNoResult),i=e.tableProps,l=e.skeletonRowCount,d=e.rowProps,m=e.children,p=e.containerProps,f=function(e,r,t){var a=(0,n.useState)(xe({order:he.None,genCompareFn:function(e){return function(r,t){var n=e.by;return null===n?0:n in r&&n in t?e.order===he.Asc?r[n].length-t[n].length:t[n].length-r[n].length:0}}},e)),c=(0,o.Z)(a,2),i=c[0],l=c[1],s=(0,n.useCallback)((function(e){var r,t=xe(xe({},i),e);null===(r=e.onSort)||void 0===r||r.call(e,t),l(t)}),[i]),d=(0,n.useMemo)((function(){var e,n=(0,u.Z)(r||[]);return i.order!==he.None&&(n.sort(null===(e=i.genCompareFn)||void 0===e?void 0:e.call(i,i)),t&&t()),n}),[r,i,t]);return{innerSorter:i,onSort:s,sortedRows:d}}(t,r,e.afterSorting),g=f.innerSorter,x=f.onSort,y=f.sortedRows,b=Oe(r,l),j=b.skeletonRows,v=b.skeletonVisible,w=function(e,r){var t=[],o=[],a=e;(0,n.isValidElement)(e)&&e.type===n.Fragment&&(a=e.props.children),n.Children.forEach(a,(function(e){var r=null;if((null==e?void 0:e.type)===A)r=e;else if("function"==typeof(null==e?void 0:e.type))try{var a=e.type(e.props);(0,n.isValidElement)(a)&&a.type===A&&(r=a)}catch(e){}if(r){var c=r.props,i=c.dataIndex,l=c.cellProps,d=c.headCellProps,u=c.bodyCellProps,m=c.isHidden,p=c.headCellRender,f=c.bodyCellRender,h=(Array.isArray(p)?p:[p]).map((function(e){return function(r){var t=r.rowIndex,n=r.colIndex;return(0,s.jsx)(ve,Se({rowIndex:t,colIndex:n,dataIndex:i,cellProps:Se(Se(Se({},l),d),e.cellProps)},e),i?String(i):"".concat(t,"-").concat(n))}}));m||(o.push((function(e){var r=e.rowIndex,t=e.colIndex,n=e.rowData;return(0,s.jsx)(ue,Se({rowIndex:r,colIndex:t,rowData:n,dataIndex:i,cellProps:Se(Se(Se({},l),u),f.cellProps)},f),i?String(i):"".concat(r,"-").concat(t))})),h.forEach((function(e,r){t[r]=t[r]||[],t[r].push(e)})))}}));var c=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=(0,n.useRef)({headCellRender:e,rowProps:r});return t.current={headCellRender:e,rowProps:r},(0,n.useCallback)((function(){var e=t.current,r=e.headCellRender,n=e.rowProps,o=n.commonRow,a=n.theadRow;return(0,s.jsx)(F.h,{children:r.map((function(e,r){var t=Se(Se({},o),Array.isArray(a)?a[r]:a);return(0,s.jsx)(U.Tr,Se(Se({},t),{},{children:e.map((function(e,t){return e({rowIndex:r,colIndex:t})}))}),r)}))})}),[])}(t,r),i=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=(0,n.useRef)({bodyCellRender:e,rowProps:r});return t.current={bodyCellRender:e,rowProps:r},(0,n.useCallback)((function(e){var r=e.dataSource,n=t.current,o=n.bodyCellRender,a=n.rowProps,c=a.commonRow,i=a.tbodyRow,l=a.genTbodyRow;return(0,s.jsx)(Y.p,{children:r.map((function(e,r){var t=Se(Se({},c),i),n=l?l({rowIndex:r,rowData:e}):{};return(0,s.jsx)(U.Tr,Se(Se(Se({},t),n),{},{children:o.map((function(t,n){return t({rowData:e,rowIndex:r,colIndex:n})}))}),r)}))})}),[])}(o,r);return(0,n.useCallback)((function(e){var r=e.dataSource;return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(c,{}),(0,s.jsx)(i,{dataSource:r})]})}),[i,c])}(m,d);return(0,s.jsxs)(ye.Provider,{value:{sorter:g,onSort:x},children:[(0,s.jsxs)(h.xu,Pe(Pe({},p),{},{children:[(0,s.jsx)(T,Pe(Pe({},i),{},{children:m&&(0,s.jsx)(w,{dataSource:v?j:y})})),!v&&0===y.length&&(c?(0,s.jsx)(c,{}):"empty")]})),!!a&&(0,s.jsx)(H,Pe({},a))]})}Re.Column=A},18537:(e,r,t)=>{t.d(r,{R:()=>n});var n=1580},73502:(e,r,t)=>{t.d(r,{H:()=>m});var n=t(5676),o=t(38469),a=t(45801),c=t(92156),i=t(89882),l=t(18537),s=t(41250),d=i.iA.Column,u=[{"@my-react/react (hook)":"useState","@my-react/react":"createELement","@my-react/react-dom":"render","@my-react/react-reactive":"createReactive","@my-react/react-refresh":"babel plugin","@my-react/react-refresh-tools":"webpack plugin","@my-react/react-vite":"vite plugin"},{"@my-react/react (hook)":"useCallback","@my-react/react":"cloneElement","@my-react/react-dom":"hydrate","@my-react/react-reactive":"reactive","@my-react/react-refresh":"refresh runtime","@my-react/react-refresh-tools":"next.js plugin"},{"@my-react/react (hook)":"useMemo","@my-react/react":"isValidElement","@my-react/react-dom":"renderToString","@my-react/react-reactive":"ref","@my-react/react-refresh-tools":"webpack loader"},{"@my-react/react (hook)":"useReducer","@my-react/react":"Children","@my-react/react-dom":"findDOMNode","@my-react/react-reactive":"computed"},{"@my-react/react (hook)":"useRef","@my-react/react":"forwardRef","@my-react/react-dom":"createPortal","@my-react/react-reactive":"watch"},{"@my-react/react (hook)":"useEffect","@my-react/react":"lazy","@my-react/react-dom":"unmountComponentAtNode","@my-react/react-reactive":"onBeforeMount"},{"@my-react/react (hook)":"useLayoutEffect","@my-react/react":"createContext","@my-react/react-dom":"renderToNodeStream","@my-react/react-reactive":"onBeforeUnmount"},{"@my-react/react (hook)":"useImperativeHandle","@my-react/react":"createRef","@my-react/react-dom":"createRoot","@my-react/react-reactive":"onBeforeUpdate"},{"@my-react/react (hook)":"useContext","@my-react/react":"memo","@my-react/react-dom":"hydrateRoot","@my-react/react-reactive":"onMounted"},{"@my-react/react (hook)":"useDebugValue","@my-react/react":"Component","@my-react/react-dom":"renderToStaticMarkup","@my-react/react-reactive":"onUnmounted"},{"@my-react/react (hook)":"useSignal","@my-react/react":"PureComponent","@my-react/react-dom":"renderToStaticNodeStream","@my-react/react-reactive":"onUpdated"},{"@my-react/react (hook)":"useDeferredValue","@my-react/react":"StrictMode"},{"@my-react/react (hook)":"useId","@my-react/react":"Fragment"},{"@my-react/react (hook)":"useInsertionEffect","@my-react/react":"Suspense"},{"@my-react/react (hook)":"useSyncExternalStore","@my-react/react":"createFactory"},{"@my-react/react (hook)":"useTransition"}],m=function(){return(0,s.jsxs)(n.W,{maxWidth:l.R,minHeight:"100vh",children:[(0,s.jsx)(o.X,{marginLeft:{base:"4%",md:"6%",lg:"8%"},as:"h4",fontSize:{base:"lg",lg:"2xl"},children:"Packages"}),(0,s.jsx)(a.L,{marginTop:{base:"4",md:"6",lg:"8",xl:"10"}}),(0,s.jsxs)(i.iA,{dataSource:u,containerProps:{padding:{base:"2",md:"4",lg:"6"},marginX:"auto",maxWidth:{base:"90%",lg:"80%"},border:"1px solid",borderRadius:"md",borderColor:"cardBorderColor"},tableProps:{borderRadius:"md"},rowProps:{theadRow:{backgroundColor:"cardBorderColor"}},children:[(0,s.jsx)(d,{headCellRender:{cellProps:{fontSize:"1.1rem",borderLeftRadius:"2px"},Render:"@my-react/react"},dataIndex:"@my-react/react",bodyCellRender:{Render:function(e){var r=e.cellData;return(0,s.jsx)(c.E,{children:r})}}}),(0,s.jsx)(d,{headCellRender:{cellProps:{fontSize:"1.1rem"},Render:"@my-react/react-dom"},dataIndex:"@my-react/react-dom",bodyCellRender:{Render:function(e){var r=e.cellData;return(0,s.jsx)(c.E,{children:r})}}}),(0,s.jsx)(d,{dataIndex:"@my-react/react (hook)",headCellRender:{cellProps:{fontSize:"1.1rem"},Render:"@my-react/react (hook)"},bodyCellRender:{Render:function(e){var r=e.cellData;return(0,s.jsx)(c.E,{children:r})}}}),(0,s.jsx)(d,{headCellRender:{cellProps:{fontSize:"1.1rem",borderRightRadius:"2px"},Render:"@my-react/react-reactive"},dataIndex:"@my-react/react-reactive",bodyCellRender:{Render:function(e){var r=e.cellData;return(0,s.jsx)(c.E,{children:r})}}}),(0,s.jsx)(d,{headCellRender:{cellProps:{fontSize:"1.1rem",borderRightRadius:"2px"},Render:"@my-react/react-refresh"},dataIndex:"@my-react/react-refresh",bodyCellRender:{Render:function(e){var r=e.cellData;return(0,s.jsx)(c.E,{children:r})}}}),(0,s.jsx)(d,{headCellRender:{cellProps:{fontSize:"1.1rem",borderRightRadius:"2px"},Render:"@my-react/react-refresh-tools"},dataIndex:"@my-react/react-refresh-tools",bodyCellRender:{Render:function(e){var r=e.cellData;return(0,s.jsx)(c.E,{children:r})}}}),(0,s.jsx)(d,{headCellRender:{cellProps:{fontSize:"1.1rem",borderRightRadius:"2px"},Render:"@my-react/react-vite"},dataIndex:"@my-react/react-vite",bodyCellRender:{Render:function(e){var r=e.cellData;return(0,s.jsx)(c.E,{children:r})}}})]})]})}},30788:(e,r,t)=>{t.r(r),t.d(r,{ApiSection:()=>w.H,MainSection:()=>v});var n=t(88213),o=t(5676),a=t(92826),c=t(37308),i=t(38469),l=t(5503),s=t(56011),d=t(51718),u=t(26528),m=t(53129),p=t(27542),f=t(66404),h=t(23580),g=t(18537),x=t(74676),y=t(65277),b=t(41250),j=x.B1.render("\n```tsx\nimport { useState, useCallback } from '@my-react/react';\nimport { render } from '@my-react/react-dom';\n\nconst useCount = () => {\n  const [state, setState] = useState(0);\n  const add = useCallback(() => setState(i => i + 1), []);\n  const del = useCallback(() => setState(i => i - 1), []);\n\n  return [state, add, del];\n};\n\nconst App = () => {\n  const [state, add, del] = useCount();\n\n  return <div>\n    <p>{state}</p>\n    <button onClick={add}>add</button>\n    <button onClick={del}>del</button>\n  </div>\n}\n\nrender(<App />, document.querySelector('#root'));\n```\n"),v=function(){var e=(0,h.s0)(),r=(0,f.Z)().formatMessage;return(0,b.jsx)(o.W,{maxWidth:g.R,minHeight:"100vh",children:(0,b.jsxs)(a.k,{justifyContent:"space-between",marginTop:"4%",flexDirection:{base:"column",md:"row"},children:[(0,b.jsxs)(c.xu,{alignSelf:"flex-start",marginLeft:{base:"4%",md:"6%",lg:"8%"},marginRight:{base:"1%",md:"0"},maxWidth:{base:"100%",md:"40%"},children:[(0,b.jsx)(i.X,{as:"h1",fontSize:{base:"2xl",md:"3xl",lg:"5xl"},marginBottom:"6",color:"red.400",children:r({id:"@my-react"})}),(0,b.jsx)(l.x,{fontSize:{base:"xl",md:"3xl",lg:"4xl"},children:r({id:"description"})}),(0,b.jsxs)(l.x,{fontSize:"sm",color:"lightTextColor",marginY:"2",lineHeight:"180%",children:["This website is built with ",(0,b.jsx)(s.Vp,{children:"@my-react"})," project. ",(0,b.jsx)("br",{})," Version: @my-react/react [",m.version,"]; @my-react/react-dom [",p.version,"]"]}),(0,b.jsxs)(d.U,{marginTop:"14",spacing:"4",display:{base:"none",md:"flex"},fontSize:{md:"12px",lg:"14px",xl:"16px"},children:[(0,b.jsx)(u.z,{variant:"solid",fontSize:"inherit",borderRadius:"full",colorScheme:"messenger",onClick:function(){return e(y.noBase?"/Blog":"/".concat("MyReact","/Blog"))},children:"View Example"}),(0,b.jsx)(u.z,{variant:"solid",fontSize:"inherit",borderRadius:"full",colorScheme:"whatsapp",as:"a",href:"https://github.com/MrWangJustToDo/MyReact",target:"_blank",children:"View on GitHub"}),(0,b.jsx)(u.z,{variant:"solid",fontSize:"inherit",borderRadius:"full",colorScheme:"teal",display:{base:"none",lg:"inline-flex"},as:"a",href:"https://mrwangjusttodo.github.io/MrWangJustToDo.io?overlay=open&playGround=MyReact",target:"_blank",children:"Online play"}),(0,b.jsx)(u.z,{variant:"solid",fontSize:"inherit",borderRadius:"full",as:"a",href:"https://www.npmjs.com/search?q=%40my-react",target:"_blank",children:"View on NPM"})]})]}),(0,b.jsx)(c.xu,{className:"typo",overflow:{base:"hidden",lg:"auto"},border:"1px solid",borderColor:"cardBorderColor",marginRight:{base:"4%",md:"16%"},marginTop:{base:"10%",md:"0"},marginLeft:{base:"4%",md:"1%"},marginBottom:{base:"6%"},borderRadius:"0.8em",fontSize:{base:"sm",lg:"medium"},sx:(0,n.Z)({},"pre",{margin:"0"}),dangerouslySetInnerHTML:{__html:j}})]})})},w=t(73502)},51363:(e,r,t)=>{t.r(r),t.d(r,{default:()=>D,isStatic:()=>I});var n=t(53129),o=t(89882),a=t(30788),c=(t(73502),t(88213)),i=t(44312),l=t(65251),s=t(5676),d=t(92826),u=t(37308),m=t(38469),p=t(56011),f=t(5503),h=t(45801),g=t(51718),x=t(28570),y=t(26528),b=t(18537),j=t(74676),v=t(41250),w=(0,i.m)("iframe"),S=j.B1.render("\n```js\n// 1. create a Next.js 12 project\n\n// 2. install @my-react\npnpm add @my-react/react @my-react/react-dom\n\npnpm add -D @my-react/react-refresh @my-react/react-refresh-tools\n\n// 3. config next.config.js\nconst withNext = require('@my-react/react-refresh-tools/withNext');\n\nmodule.exports = withNext(nextConfig);\n\n// 4. start\npnpm run dev\n\n```\n"),O=(0,v.jsx)(w,{title:"@my-react online example",allowFullScreen:!0,marginX:"auto",width:{base:"100%",md:"80%"},height:"660",outline:"1px solid #252525",borderRadius:"4",zIndex:"100",marginBottom:"1em",src:"https://codesandbox.io/p/sandbox/zen-allen-mfwmmg?embed=1"}),C=function(){var e=(0,l.ff)("gray.300","gray.600");return(0,v.jsxs)(s.W,{maxWidth:b.R,minHeight:"100vh",children:[(0,v.jsxs)(d.k,{justifyContent:"space-between",marginTop:"4%",flexDirection:{base:"column",md:"row"},children:[(0,v.jsxs)(u.xu,{alignSelf:"flex-start",marginLeft:{base:"4%",md:"6%",lg:"8%"},marginRight:{base:"1%",md:"0"},maxWidth:{base:"100%",md:"40%"},children:[(0,v.jsxs)(m.X,{as:"h1",fontSize:{base:"xl",md:"3xl",lg:"4xl"},marginTop:"6",children:["Quick start in ",(0,v.jsx)(p.Vp,{fontSize:"inherit",children:"Next.js"})]}),(0,v.jsx)(f.x,{fontSize:"sm",color:"lightTextColor",marginY:"2",lineHeight:"180%",children:"Currently not support Next.js 13+, also not support React `RSC`."}),(0,v.jsx)(f.x,{fontSize:"sm",color:"lightTextColor",marginY:"2",lineHeight:"180%",children:"This project is only a experimental project, not recommend use in the production environment."}),(0,v.jsx)(h.L,{marginTop:"4"}),(0,v.jsxs)(g.U,{children:[(0,v.jsx)(x.u,{label:(0,v.jsxs)(f.x,{children:["A static ",(0,v.jsx)(p.Vp,{children:"Next.js"})," site power by @my-react"]}),hasArrow:!0,placement:"top",bg:e,color:"black",children:(0,v.jsx)(y.z,{as:"a",href:"https://mrwangjusttodo.github.io/MrWangJustToDo.io",colorScheme:"purple",target:"_blank",children:"Online Example"})}),(0,v.jsx)(x.u,{label:(0,v.jsxs)(f.x,{children:["A ",(0,v.jsx)(p.Vp,{children:"Next.js"})," template power by @my-react"]}),hasArrow:!0,placement:"top",bg:e,color:"black",children:(0,v.jsx)(y.z,{as:"a",href:"https://github.com/MrWangJustToDo/MyReact/tree/main/ui/next-example",colorScheme:"purple",target:"_blank",children:"Example"})})]})]}),(0,v.jsx)(u.xu,{className:"typo",overflow:{base:"hidden",lg:"auto"},border:"1px solid",borderColor:"cardBorderColor",marginRight:{base:"4%",md:"16%"},marginTop:{base:"10%",md:"0"},marginLeft:{base:"4%",md:"1%"},marginBottom:{base:"6%"},borderRadius:"0.8em",fontSize:{base:"sm",lg:"medium"},sx:(0,c.Z)({},"pre",{margin:"0"}),dangerouslySetInnerHTML:{__html:S}})]}),O]})},P=j.B1.render('\n```js\n// 1. create a Vite React template\n\n// 2. install @my-react\npnpm add @my-react/react @my-react/react-dom\n\npnpm add -D @my-react/react-refresh @my-react/react-vite\n\n// 3. config vite.config.ts\nimport react from "@my-react/react-vite";\n\nexport default defineConfig({\n  plugins: [react()],\n});\n\n// 4. start\npnpm run dev\n\n```\n'),R=function(){var e=(0,l.ff)("gray.300","gray.600");return(0,v.jsx)(s.W,{maxWidth:b.R,minHeight:"100vh",children:(0,v.jsxs)(d.k,{justifyContent:"space-between",marginTop:"4%",flexDirection:{base:"column",md:"row"},children:[(0,v.jsxs)(u.xu,{alignSelf:"flex-start",marginLeft:{base:"4%",md:"6%",lg:"8%"},marginRight:{base:"1%",md:"0"},maxWidth:{base:"100%",md:"40%"},children:[(0,v.jsxs)(m.X,{as:"h1",fontSize:{base:"xl",md:"3xl",lg:"4xl"},marginTop:"6",children:["Quick start in ",(0,v.jsx)(p.Vp,{fontSize:"inherit",children:"Vite"})," (upcoming)"]}),(0,v.jsx)(f.x,{fontSize:"sm",color:"lightTextColor",marginY:"2",lineHeight:"180%",children:"This project is only a experimental project, not recommend use in the production environment."}),(0,v.jsx)(h.L,{marginTop:"4"}),(0,v.jsx)(x.u,{label:(0,v.jsxs)(f.x,{children:["A ",(0,v.jsx)(p.Vp,{children:"Vite"})," template power by @my-react"]}),hasArrow:!0,placement:"top",bg:e,color:"black",children:(0,v.jsx)(y.z,{as:"a",href:"https://github.com/MrWangJustToDo/MyReact/tree/main/ui/vite-example",colorScheme:"purple",target:"_blank",children:"Example"})})]}),(0,v.jsx)(u.xu,{className:"typo",overflow:{base:"hidden",lg:"auto"},border:"1px solid",borderColor:"cardBorderColor",marginRight:{base:"4%",md:"16%"},marginTop:{base:"10%",md:"0"},marginLeft:{base:"4%",md:"1%"},marginBottom:{base:"6%"},borderRadius:"0.8em",fontSize:{base:"sm",lg:"medium"},sx:(0,c.Z)({},"pre",{margin:"0"}),dangerouslySetInnerHTML:{__html:P}})]})})},k=(0,n.lazy)((function(){return Promise.resolve().then(t.bind(t,30788)).then((function(e){return{default:e.ApiSection}}))}));const D=function(){return(0,v.jsx)(v.Fragment,{children:(0,v.jsxs)(o.mT,{initialSectionLength:1,children:[(0,v.jsxs)(o.MV,{children:[(0,v.jsx)(o.Yu,{children:(0,v.jsx)(a.MainSection,{})}),(0,v.jsx)(o.Yu,{children:(0,v.jsx)(C,{})}),(0,v.jsx)(o.Yu,{children:(0,v.jsx)(R,{})}),(0,v.jsx)(o.Yu,{children:(0,v.jsx)(k,{})})]}),(0,v.jsx)(o.T3,{}),(0,v.jsx)(o.pU,{})]})})};var I=!0},74676:(e,r,t)=>{t.d(r,{B1:()=>j,H9:()=>v});var n=t(62923),o=t.n(n),a=t(1154),c=t(98384),i=t(53513),l=t(7758),s=t(24562),d=t(4679),u=t(72837),m=t(55147),p=t(63223),f=t(34022),h=t(80454),g=t(39300),x=t(96378);a.Z.registerLanguage("css",i.Z),a.Z.registerLanguage("json",d.Z),a.Z.registerLanguage("java",l.Z),a.Z.registerLanguage("bash",c.Z),a.Z.registerLanguage("markdown",m.Z),a.Z.registerLanguage("javascript",s.Z),a.Z.registerLanguage("typescript",g.Z),a.Z.registerLanguage("less",u.Z),a.Z.registerLanguage("scss",p.Z),a.Z.registerLanguage("shell",f.Z),a.Z.registerLanguage("xml",x.Z),a.Z.registerLanguage("sql",h.Z);var y=a.Z,b=new(o()),j=new(o())({html:!0,xhtmlOut:!0,breaks:!0,highlight:function(e,r){try{var t=(r&&y.getLanguage(r)?y.highlight(e,{language:r,ignoreIllegals:!0}).value:y.highlightAuto(e,["typescript","javascript","xml","scss","less","json","bash"]).value).split(/\n/).slice(0,-1),n=String(t.length).length-.2,o=t.reduce((function(e,r,t){return"".concat(e,"<span class='no-select d-inline-block text-center border-right pr-2 mr-2 border-dark' style='min-width: ").concat(n,"em; line-height: 1.5'>").concat(t+1,"</span>").concat(r,"\n")}),"<div class='w-100 position-absolute' style='left: 0; top: 0; font-size: 0px'>\n          <b class='no-select position-absolute text-info' style='left: 10px; font-size: 12px; top: 4px;'>".concat(r,"</b>\n          <div class='position-absolute w-100 border-bottom border-dark' style='left: 0; top: 24px;'></div>\n        </div>"));return'<pre class="rounded position-relative"><code class="hljs '.concat(r,"\" style='padding-top: 30px;'>").concat(o,"</code></pre>")}catch(e){}}}),v=new(o())({html:!0,xhtmlOut:!0,breaks:!0,highlight:function(e,r){if(r&&y.getLanguage(r))try{var t=y.highlight(e,{language:r,ignoreIllegals:!0}).value;return'<pre class="rounded bg-dark"><code class="bg-dark hljs '.concat(r,'">').concat(t,"</code></pre>")}catch(e){}return'<pre class="rounded bg-dark"><code class="bg-dark hljs">'.concat(b.utils.escapeHtml(e),"</code></pre>")}})}}]);