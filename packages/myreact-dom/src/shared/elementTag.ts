import { makeMap } from "./tools";

/**
 * @internal
 */
export const isHTMLTag = makeMap(
  "html,body,base,head,link,meta,style,title,address,article,aside,footer," +
    "header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption," +
    "figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code," +
    "data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup," +
    "time,u,var,wbr,area,audio,map,track,video,embed,object,param,source," +
    "canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td," +
    "th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup," +
    "option,output,progress,select,textarea,details,dialog,menu," +
    "summary,template,blockquote,iframe,tfoot"
);

/**
 * @internal
 */
export const isSVGTag = makeMap(
  "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile," +
    "defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer," +
    "feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap," +
    "feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR," +
    "feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset," +
    "fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter," +
    "foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask," +
    "mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern," +
    "polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol," +
    "text,textPath,title,tspan,unknown,use,view"
);

/**
 * @internal
 */
export const isSingleTag = makeMap("area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr");

/**
 * @internal
 */
export const isNativeTag = (type: string) => {
  if (!isHTMLTag[type] && !isSVGTag[type]) {
    return false;
  }
  return true;
} 
