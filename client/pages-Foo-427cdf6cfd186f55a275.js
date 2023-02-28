"use strict";(self.__LOADABLE_LOADED_CHUNKS__=self.__LOADABLE_LOADED_CHUNKS__||[]).push([[563],{36305:(t,e,n)=>{n.r(e),n.d(e,{default:()=>D,getInitialState:()=>I,isStatic:()=>V});var r=n(28777),i=n(77896),o=n.n(i),c=n(48788),l=n(86203),u=n(21970),a=n(55254),d=n(96269),s=(0,d.createContext)({totalSection:0,currentSection:0,setTotalSection:function(t){},setCurrentSection:function(t){},onNextSection:function(){},onPrevSection:function(){}}),h=function(){return(0,d.useContext)(s)},f=n(15886),p=function(t){var e=t.onSectionIndexChange,n=t.children,r=t.initialSectionLength,i=(0,d.useState)(0),o=(0,l.Z)(i,2),c=o[0],h=o[1],p=(0,d.useState)(r||0),x=(0,l.Z)(p,2),v=x[0],g=x[1],Z=(0,u.D9)(c),w=(0,a.u)(e),S=(0,a.u)((function(){h(c===v-1?0:function(t){return t+1})})),m=(0,a.u)((function(){h(0===c?v-1:function(t){return t-1})}));(0,d.useEffect)((function(){w(c,Z)}),[c,w]);var C=(0,d.useMemo)((function(){return{totalSection:v,currentSection:c,onNextSection:S,onPrevSection:m,setCurrentSection:h,setTotalSection:g}}),[c,S,m,v]);return(0,f.tZ)(s.Provider,{value:C,children:n})},x=n(98927),v=n(72660),g=n(23417),Z=n(49200),w=(0,d.createContext)({ref:{current:null}}),S=(0,d.createContext)({inViewArray:[],setCurrentView:function(t,e){}}),m=function(t){var e=t.children,n=t.index,r=(0,d.useRef)(null),i=(0,d.useMemo)((function(){return{ref:r}}),[]),o=h().currentSection,l=(0,d.useContext)(S),u=l.setCurrentView,a=l.inViewArray,s=(0,Z.Y)(r,{amount:"some",margin:"-300px 0px"});return(0,d.useEffect)((function(){null!=n&&u(s,n)}),[n,s,u,a.length]),(0,f.tZ)(w.Provider,{value:i,children:(0,f.tZ)(c.xu,{ref:r,position:"relative",overflow:"hidden","data-scroll-section":n,"data-active":o===n,children:e})})},C=function(t){var e=t.children,n=[],r=(0,v.v)().scrollY;d.Children.forEach(e,(function(t){(0,d.isValidElement)(t)&&t.type===m&&n.push(t)}));var i=n.length,o=(0,d.useState)((function(){return Array(i).fill(!1)})),c=(0,l.Z)(o,2),u=c[0],s=c[1];(0,d.useEffect)((function(){s(Array(i).fill(!1))}),[i]);var p=(0,a.u)((function(t,e){if(u[e]!==t){var n=(0,x.Z)(u);n[e]=t,s(n)}})),Z=(0,d.useMemo)((function(){return{inViewArray:u,setCurrentView:p}}),[u,p]),w=h(),C=w.setTotalSection,b=w.setCurrentSection,y=w.currentSection,k=(0,a.u)((function(t){t?u[y-1]&&b(y-1):u[y+1]&&b(y+1)}));return(0,d.useEffect)((function(){var t=0,e=(0,g.Z)((function(e){k(!(e>t)),t=e}),100,{leading:!0,trailing:!0});return r.onChange(e),function(){return r.clearListeners()}}),[k,r]),(0,a.a)((function(){C(i),b(0)}),[i,C,b]),(0,f.tZ)(S.Provider,{value:Z,children:d.Children.map(n,(function(t,e){return(0,d.cloneElement)(t,{index:e})}))})},b=n(86805),y=function(t){var e=t.className;return(0,f.tZ)("svg",{className:e,width:"14",height:"8",viewBox:"0 0 14 8",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,f.tZ)("path",{d:"M1 7L7 1L13 7",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})},k=(0,d.memo)(y),E=function(){var t=h().currentSection;return(0,f.tZ)(c.xu,{fontSize:"20px",position:"fixed",right:"10px",bottom:"20px",width:"20px",height:"20px",color:"orangeSand",textAlign:"center",verticalAlign:"middle",borderRadius:"999999px",zIndex:"sticky",display:{base:t>0?"flex":"none",md:"none"},alignItems:"center",justifyContent:"center",onClick:function(){window.scrollTo({top:0,behavior:"smooth"})},children:(0,f.tZ)(b.JO,{as:k,width:"20px",height:"20px"})})},A=function(t){var e=t.render,n=h(),r=n.totalSection,i=n.currentSection,o=(0,a.u)((function(t){var e=document.querySelector('[data-scroll-section="'.concat(t,'"]'));if(e){var n,r=e.getBoundingClientRect(),i=((null===(n=document.scrollingElement)||void 0===n?void 0:n.scrollTop)||0)+r.top;window.scrollTo({top:i,behavior:"smooth"})}})),l=(0,d.useMemo)((function(){return Array(r).fill(0)}),[r]);return(0,f.tZ)(c.kC,{height:"100vh",position:"fixed",width:"30px",display:{base:"none",md:"flex"},flexDirection:"column",top:"0",right:"100px",alignItems:"center",justifyContent:"center",zIndex:"dropdown","data-scroll-tool":!0,children:i<=r-1&&(0,f.tZ)(c.Eq,{spacing:"6",children:l.map((function(t,n){return(0,f.tZ)(c.Uc,{children:e?e({index:n,isSelect:i===n,onClick:function(){return o(n)}}):(0,f.tZ)(c.xu,{width:"10px",height:"10px",cursor:"pointer",borderRadius:"full",sx:{backgroundColor:i===n?"red":"initial",border:i===n?"none":"1px solid #e2e2e2"},onClick:function(){return o(n)}})},n)}))})})},L=n(36417),_=n(23576),R=n(64974),Y=function(t){var e=t.children,n=(0,d.useContext)(w).ref,r=(0,v.v)({target:n,axis:"y",offset:["0 0.45","1 0.6"]}).scrollYProgress,i=(0,L.H)(r,[1,.5,0],[0,1,0]),o=(0,L.H)(r,[1,.5,0],[-150,0,150]);return(0,d.useEffect)((function(){return r.onChange(console.log),function(){return r.clearListeners()}}),[r]),(0,f.tZ)(_.E.div,{style:{opacity:i,y:o},children:e})},z=function(t){var e=t.children;return(0,R.tm)()?(0,f.tZ)(Y,{children:e},"1"):(0,f.tZ)(Y,{children:e},"2")},B=n(78021);function D(t){var e=t.foo;return(0,f.tZ)(f.HY,{children:(0,f.BX)(p,{initialSectionLength:5,children:[(0,f.BX)(C,{children:[(0,f.tZ)(m,{children:(0,f.BX)(c.xu,{width:"100vw",height:"100vh",backgroundColor:"AppWorkspace",position:"relative",children:[(0,f.tZ)(c.X6,{children:"foo page"}),(0,f.BX)(c.EK,{children:["props: foo: ",e]}),(0,f.tZ)(c.xu,{position:"absolute",left:"30%",top:"50%",transform:"translateY(-50%)",border:"1px",borderRadius:"4px",padding:"2",children:(0,f.tZ)(z,{children:(0,f.tZ)(c.xv,{fontSize:"24px",children:"1 page"})})})]})}),(0,f.tZ)(m,{children:(0,f.tZ)(c.xu,{width:"100vw",height:"100vh",backgroundColor:"aliceblue",position:"relative",children:(0,f.tZ)(c.xu,{position:"absolute",left:"30%",top:"50%",transform:"translateY(-50%)",border:"1px",borderRadius:"4px",padding:"2",children:(0,f.tZ)(z,{children:(0,f.tZ)(c.xv,{fontSize:"24px",children:"2 page"})})})})}),(0,f.tZ)(m,{children:(0,f.tZ)(c.xu,{width:"100vw",height:"100vh",backgroundColor:"whatsapp.300",position:"relative",children:(0,f.tZ)(c.xu,{position:"absolute",left:"30%",top:"50%",transform:"translateY(-50%)",border:"1px",borderRadius:"4px",padding:"2",children:(0,f.tZ)(z,{children:(0,f.tZ)(c.xv,{fontSize:"24px",children:"3 page"})})})})}),(0,f.tZ)(m,{children:(0,f.tZ)(c.xu,{width:"100vw",height:"100vh",backgroundColor:"yellow.400",position:"relative",children:(0,f.tZ)(c.xu,{position:"absolute",left:"30%",top:"50%",transform:"translateY(-50%)",border:"1px",borderRadius:"4px",padding:"2",children:(0,f.tZ)(z,{children:(0,f.tZ)(c.xv,{fontSize:"24px",children:"4 page"})})})})}),(0,f.tZ)(m,{children:(0,f.tZ)(c.xu,{width:"100vw",height:"100vh",backgroundColor:"twitter.200",position:"relative",children:(0,f.tZ)(c.xu,{position:"absolute",left:"30%",top:"50%",transform:"translateY(-50%)",border:"1px",borderRadius:"4px",padding:"2",children:(0,f.tZ)(z,{children:(0,f.tZ)(c.xv,{fontSize:"24px",children:"5 page"})})})})})]}),(0,f.tZ)(A,{}),(0,f.tZ)(E,{})]})})}var V=!0,I=function(){var t=(0,r.Z)(o().mark((function t(){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,B.gw)(1e3);case 2:return t.abrupt("return",{props:{foo:"bar"}});case 3:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}()}}]);