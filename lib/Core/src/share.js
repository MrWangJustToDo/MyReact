import { error } from "./debug.js";
import { enableAllCheck } from "./env.js";

const NODE_TYPE_KEY = [
  "__isTextNode__",
  "__isEmptyNode__",
  "__isPlainNode__",
  "__isFragmentNode__",
  // ====  object node ==== //
  "__isObjectNode__",
  "__isMemo__",
  "__isPortal__",
  "__isForwardRef__",
  "__isContextProvider__",
  "__isContextConsumer__",
  // ==== dynamic node ==== //
  "__isDynamicNode__",
  "__isClassComponent__",
  "__isFunctionComponent__",
];

const COMPONENT_METHOD = [
  "shouldComponentUpdate",
  "componentDidMount",
  "componentDidUpdate",
  "componentWillUnmount",
];

const DEFAULT_NODE_TYPE = {
  __isTextNode__: false,
  __isEmptyNode__: false,
  __isPlainNode__: false,
  __isFragmentNode__: false,
  // ====  object node ==== //
  __isObjectNode__: false,
  __isMemo__: false,
  __isPortal__: false,
  __isForwardRef__: false,
  __isContextProvider__: false,
  __isContextConsumer__: false,
  // ==== dynamic node ==== //
  __isDynamicNode__: false,
  __isClassComponent__: false,
  __isFunctionComponent__: false,
};

// number props
const IS_UNIT_LESS_NUMBER = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
};

const IS_SINGLE_ELEMENT = {
  br: true,
  hr: true,
  img: true,
  input: true,
  param: true,
  meta: true,
  link: true,
};

// from ReactDOM  TODO
const possibleStandardNames = {
  // HTML
  accept: 'accept',
  acceptcharset: 'acceptCharset',
  'accept-charset': 'acceptCharset',
  accesskey: 'accessKey',
  action: 'action',
  allowfullscreen: 'allowFullScreen',
  alt: 'alt',
  as: 'as',
  async: 'async',
  autocapitalize: 'autoCapitalize',
  autocomplete: 'autoComplete',
  autocorrect: 'autoCorrect',
  autofocus: 'autoFocus',
  autoplay: 'autoPlay',
  autosave: 'autoSave',
  capture: 'capture',
  cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing',
  challenge: 'challenge',
  charset: 'charSet',
  checked: 'checked',
  children: 'children',
  cite: 'cite',
  class: 'className',
  classid: 'classID',
  classname: 'className',
  cols: 'cols',
  colspan: 'colSpan',
  content: 'content',
  contenteditable: 'contentEditable',
  contextmenu: 'contextMenu',
  controls: 'controls',
  controlslist: 'controlsList',
  coords: 'coords',
  crossorigin: 'crossOrigin',
  dangerouslysetinnerhtml: 'dangerouslySetInnerHTML',
  data: 'data',
  datetime: 'dateTime',
  default: 'default',
  defaultchecked: 'defaultChecked',
  defaultvalue: 'defaultValue',
  defer: 'defer',
  dir: 'dir',
  disabled: 'disabled',
  disablepictureinpicture: 'disablePictureInPicture',
  download: 'download',
  draggable: 'draggable',
  enctype: 'encType',
  for: 'htmlFor',
  form: 'form',
  formmethod: 'formMethod',
  formaction: 'formAction',
  formenctype: 'formEncType',
  formnovalidate: 'formNoValidate',
  formtarget: 'formTarget',
  frameborder: 'frameBorder',
  headers: 'headers',
  height: 'height',
  hidden: 'hidden',
  high: 'high',
  href: 'href',
  hreflang: 'hrefLang',
  htmlfor: 'htmlFor',
  httpequiv: 'httpEquiv',
  'http-equiv': 'httpEquiv',
  icon: 'icon',
  id: 'id',
  innerhtml: 'innerHTML',
  inputmode: 'inputMode',
  integrity: 'integrity',
  is: 'is',
  itemid: 'itemID',
  itemprop: 'itemProp',
  itemref: 'itemRef',
  itemscope: 'itemScope',
  itemtype: 'itemType',
  keyparams: 'keyParams',
  keytype: 'keyType',
  kind: 'kind',
  label: 'label',
  lang: 'lang',
  list: 'list',
  loop: 'loop',
  low: 'low',
  manifest: 'manifest',
  marginwidth: 'marginWidth',
  marginheight: 'marginHeight',
  max: 'max',
  maxlength: 'maxLength',
  media: 'media',
  mediagroup: 'mediaGroup',
  method: 'method',
  min: 'min',
  minlength: 'minLength',
  multiple: 'multiple',
  muted: 'muted',
  name: 'name',
  nomodule: 'noModule',
  nonce: 'nonce',
  novalidate: 'noValidate',
  open: 'open',
  optimum: 'optimum',
  pattern: 'pattern',
  placeholder: 'placeholder',
  playsinline: 'playsInline',
  poster: 'poster',
  preload: 'preload',
  profile: 'profile',
  radiogroup: 'radioGroup',
  readonly: 'readOnly',
  referrerpolicy: 'referrerPolicy',
  rel: 'rel',
  required: 'required',
  reversed: 'reversed',
  role: 'role',
  rows: 'rows',
  rowspan: 'rowSpan',
  sandbox: 'sandbox',
  scope: 'scope',
  scoped: 'scoped',
  scrolling: 'scrolling',
  seamless: 'seamless',
  selected: 'selected',
  shape: 'shape',
  size: 'size',
  sizes: 'sizes',
  span: 'span',
  spellcheck: 'spellCheck',
  src: 'src',
  srcdoc: 'srcDoc',
  srclang: 'srcLang',
  srcset: 'srcSet',
  start: 'start',
  step: 'step',
  style: 'style',
  summary: 'summary',
  tabindex: 'tabIndex',
  target: 'target',
  title: 'title',
  type: 'type',
  usemap: 'useMap',
  value: 'value',
  width: 'width',
  wmode: 'wmode',
  wrap: 'wrap',
  // SVG
  about: 'about',
  accentheight: 'accentHeight',
  'accent-height': 'accentHeight',
  accumulate: 'accumulate',
  additive: 'additive',
  alignmentbaseline: 'alignmentBaseline',
  'alignment-baseline': 'alignmentBaseline',
  allowreorder: 'allowReorder',
  alphabetic: 'alphabetic',
  amplitude: 'amplitude',
  arabicform: 'arabicForm',
  'arabic-form': 'arabicForm',
  ascent: 'ascent',
  attributename: 'attributeName',
  attributetype: 'attributeType',
  autoreverse: 'autoReverse',
  azimuth: 'azimuth',
  basefrequency: 'baseFrequency',
  baselineshift: 'baselineShift',
  'baseline-shift': 'baselineShift',
  baseprofile: 'baseProfile',
  bbox: 'bbox',
  begin: 'begin',
  bias: 'bias',
  by: 'by',
  calcmode: 'calcMode',
  capheight: 'capHeight',
  'cap-height': 'capHeight',
  clip: 'clip',
  clippath: 'clipPath',
  'clip-path': 'clipPath',
  clippathunits: 'clipPathUnits',
  cliprule: 'clipRule',
  'clip-rule': 'clipRule',
  color: 'color',
  colorinterpolation: 'colorInterpolation',
  'color-interpolation': 'colorInterpolation',
  colorinterpolationfilters: 'colorInterpolationFilters',
  'color-interpolation-filters': 'colorInterpolationFilters',
  colorprofile: 'colorProfile',
  'color-profile': 'colorProfile',
  colorrendering: 'colorRendering',
  'color-rendering': 'colorRendering',
  contentscripttype: 'contentScriptType',
  contentstyletype: 'contentStyleType',
  cursor: 'cursor',
  cx: 'cx',
  cy: 'cy',
  d: 'd',
  datatype: 'datatype',
  decelerate: 'decelerate',
  descent: 'descent',
  diffuseconstant: 'diffuseConstant',
  direction: 'direction',
  display: 'display',
  divisor: 'divisor',
  dominantbaseline: 'dominantBaseline',
  'dominant-baseline': 'dominantBaseline',
  dur: 'dur',
  dx: 'dx',
  dy: 'dy',
  edgemode: 'edgeMode',
  elevation: 'elevation',
  enablebackground: 'enableBackground',
  'enable-background': 'enableBackground',
  end: 'end',
  exponent: 'exponent',
  externalresourcesrequired: 'externalResourcesRequired',
  fill: 'fill',
  fillopacity: 'fillOpacity',
  'fill-opacity': 'fillOpacity',
  fillrule: 'fillRule',
  'fill-rule': 'fillRule',
  filter: 'filter',
  filterres: 'filterRes',
  filterunits: 'filterUnits',
  floodopacity: 'floodOpacity',
  'flood-opacity': 'floodOpacity',
  floodcolor: 'floodColor',
  'flood-color': 'floodColor',
  focusable: 'focusable',
  fontfamily: 'fontFamily',
  'font-family': 'fontFamily',
  fontsize: 'fontSize',
  'font-size': 'fontSize',
  fontsizeadjust: 'fontSizeAdjust',
  'font-size-adjust': 'fontSizeAdjust',
  fontstretch: 'fontStretch',
  'font-stretch': 'fontStretch',
  fontstyle: 'fontStyle',
  'font-style': 'fontStyle',
  fontvariant: 'fontVariant',
  'font-variant': 'fontVariant',
  fontweight: 'fontWeight',
  'font-weight': 'fontWeight',
  format: 'format',
  from: 'from',
  fx: 'fx',
  fy: 'fy',
  g1: 'g1',
  g2: 'g2',
  glyphname: 'glyphName',
  'glyph-name': 'glyphName',
  glyphorientationhorizontal: 'glyphOrientationHorizontal',
  'glyph-orientation-horizontal': 'glyphOrientationHorizontal',
  glyphorientationvertical: 'glyphOrientationVertical',
  'glyph-orientation-vertical': 'glyphOrientationVertical',
  glyphref: 'glyphRef',
  gradienttransform: 'gradientTransform',
  gradientunits: 'gradientUnits',
  hanging: 'hanging',
  horizadvx: 'horizAdvX',
  'horiz-adv-x': 'horizAdvX',
  horizoriginx: 'horizOriginX',
  'horiz-origin-x': 'horizOriginX',
  ideographic: 'ideographic',
  imagerendering: 'imageRendering',
  'image-rendering': 'imageRendering',
  in2: 'in2',
  in: 'in',
  inlist: 'inlist',
  intercept: 'intercept',
  k1: 'k1',
  k2: 'k2',
  k3: 'k3',
  k4: 'k4',
  k: 'k',
  kernelmatrix: 'kernelMatrix',
  kernelunitlength: 'kernelUnitLength',
  kerning: 'kerning',
  keypoints: 'keyPoints',
  keysplines: 'keySplines',
  keytimes: 'keyTimes',
  lengthadjust: 'lengthAdjust',
  letterspacing: 'letterSpacing',
  'letter-spacing': 'letterSpacing',
  lightingcolor: 'lightingColor',
  'lighting-color': 'lightingColor',
  limitingconeangle: 'limitingConeAngle',
  local: 'local',
  markerend: 'markerEnd',
  'marker-end': 'markerEnd',
  markerheight: 'markerHeight',
  markermid: 'markerMid',
  'marker-mid': 'markerMid',
  markerstart: 'markerStart',
  'marker-start': 'markerStart',
  markerunits: 'markerUnits',
  markerwidth: 'markerWidth',
  mask: 'mask',
  maskcontentunits: 'maskContentUnits',
  maskunits: 'maskUnits',
  mathematical: 'mathematical',
  mode: 'mode',
  numoctaves: 'numOctaves',
  offset: 'offset',
  opacity: 'opacity',
  operator: 'operator',
  order: 'order',
  orient: 'orient',
  orientation: 'orientation',
  origin: 'origin',
  overflow: 'overflow',
  overlineposition: 'overlinePosition',
  'overline-position': 'overlinePosition',
  overlinethickness: 'overlineThickness',
  'overline-thickness': 'overlineThickness',
  paintorder: 'paintOrder',
  'paint-order': 'paintOrder',
  panose1: 'panose1',
  'panose-1': 'panose1',
  pathlength: 'pathLength',
  patterncontentunits: 'patternContentUnits',
  patterntransform: 'patternTransform',
  patternunits: 'patternUnits',
  pointerevents: 'pointerEvents',
  'pointer-events': 'pointerEvents',
  points: 'points',
  pointsatx: 'pointsAtX',
  pointsaty: 'pointsAtY',
  pointsatz: 'pointsAtZ',
  prefix: 'prefix',
  preservealpha: 'preserveAlpha',
  preserveaspectratio: 'preserveAspectRatio',
  primitiveunits: 'primitiveUnits',
  property: 'property',
  r: 'r',
  radius: 'radius',
  refx: 'refX',
  refy: 'refY',
  renderingintent: 'renderingIntent',
  'rendering-intent': 'renderingIntent',
  repeatcount: 'repeatCount',
  repeatdur: 'repeatDur',
  requiredextensions: 'requiredExtensions',
  requiredfeatures: 'requiredFeatures',
  resource: 'resource',
  restart: 'restart',
  result: 'result',
  results: 'results',
  rotate: 'rotate',
  rx: 'rx',
  ry: 'ry',
  scale: 'scale',
  security: 'security',
  seed: 'seed',
  shaperendering: 'shapeRendering',
  'shape-rendering': 'shapeRendering',
  slope: 'slope',
  spacing: 'spacing',
  specularconstant: 'specularConstant',
  specularexponent: 'specularExponent',
  speed: 'speed',
  spreadmethod: 'spreadMethod',
  startoffset: 'startOffset',
  stddeviation: 'stdDeviation',
  stemh: 'stemh',
  stemv: 'stemv',
  stitchtiles: 'stitchTiles',
  stopcolor: 'stopColor',
  'stop-color': 'stopColor',
  stopopacity: 'stopOpacity',
  'stop-opacity': 'stopOpacity',
  strikethroughposition: 'strikethroughPosition',
  'strikethrough-position': 'strikethroughPosition',
  strikethroughthickness: 'strikethroughThickness',
  'strikethrough-thickness': 'strikethroughThickness',
  string: 'string',
  stroke: 'stroke',
  strokedasharray: 'strokeDasharray',
  'stroke-dasharray': 'strokeDasharray',
  strokedashoffset: 'strokeDashoffset',
  'stroke-dashoffset': 'strokeDashoffset',
  strokelinecap: 'strokeLinecap',
  'stroke-linecap': 'strokeLinecap',
  strokelinejoin: 'strokeLinejoin',
  'stroke-linejoin': 'strokeLinejoin',
  strokemiterlimit: 'strokeMiterlimit',
  'stroke-miterlimit': 'strokeMiterlimit',
  strokewidth: 'strokeWidth',
  'stroke-width': 'strokeWidth',
  strokeopacity: 'strokeOpacity',
  'stroke-opacity': 'strokeOpacity',
  suppresscontenteditablewarning: 'suppressContentEditableWarning',
  suppresshydrationwarning: 'suppressHydrationWarning',
  surfacescale: 'surfaceScale',
  systemlanguage: 'systemLanguage',
  tablevalues: 'tableValues',
  targetx: 'targetX',
  targety: 'targetY',
  textanchor: 'textAnchor',
  'text-anchor': 'textAnchor',
  textdecoration: 'textDecoration',
  'text-decoration': 'textDecoration',
  textlength: 'textLength',
  textrendering: 'textRendering',
  'text-rendering': 'textRendering',
  to: 'to',
  transform: 'transform',
  typeof: 'typeof',
  u1: 'u1',
  u2: 'u2',
  underlineposition: 'underlinePosition',
  'underline-position': 'underlinePosition',
  underlinethickness: 'underlineThickness',
  'underline-thickness': 'underlineThickness',
  unicode: 'unicode',
  unicodebidi: 'unicodeBidi',
  'unicode-bidi': 'unicodeBidi',
  unicoderange: 'unicodeRange',
  'unicode-range': 'unicodeRange',
  unitsperem: 'unitsPerEm',
  'units-per-em': 'unitsPerEm',
  unselectable: 'unselectable',
  valphabetic: 'vAlphabetic',
  'v-alphabetic': 'vAlphabetic',
  values: 'values',
  vectoreffect: 'vectorEffect',
  'vector-effect': 'vectorEffect',
  version: 'version',
  vertadvy: 'vertAdvY',
  'vert-adv-y': 'vertAdvY',
  vertoriginx: 'vertOriginX',
  'vert-origin-x': 'vertOriginX',
  vertoriginy: 'vertOriginY',
  'vert-origin-y': 'vertOriginY',
  vhanging: 'vHanging',
  'v-hanging': 'vHanging',
  videographic: 'vIdeographic',
  'v-ideographic': 'vIdeographic',
  viewbox: 'viewBox',
  viewtarget: 'viewTarget',
  visibility: 'visibility',
  vmathematical: 'vMathematical',
  'v-mathematical': 'vMathematical',
  vocab: 'vocab',
  widths: 'widths',
  wordspacing: 'wordSpacing',
  'word-spacing': 'wordSpacing',
  writingmode: 'writingMode',
  'writing-mode': 'writingMode',
  x1: 'x1',
  x2: 'x2',
  x: 'x',
  xchannelselector: 'xChannelSelector',
  xheight: 'xHeight',
  'x-height': 'xHeight',
  xlinkactuate: 'xlinkActuate',
  'xlink:actuate': 'xlinkActuate',
  xlinkarcrole: 'xlinkArcrole',
  'xlink:arcrole': 'xlinkArcrole',
  xlinkhref: 'xlinkHref',
  'xlink:href': 'xlinkHref',
  xlinkrole: 'xlinkRole',
  'xlink:role': 'xlinkRole',
  xlinkshow: 'xlinkShow',
  'xlink:show': 'xlinkShow',
  xlinktitle: 'xlinkTitle',
  'xlink:title': 'xlinkTitle',
  xlinktype: 'xlinkType',
  'xlink:type': 'xlinkType',
  xmlbase: 'xmlBase',
  'xml:base': 'xmlBase',
  xmllang: 'xmlLang',
  'xml:lang': 'xmlLang',
  xmlns: 'xmlns',
  'xml:space': 'xmlSpace',
  xmlnsxlink: 'xmlnsXlink',
  'xmlns:xlink': 'xmlnsXlink',
  xmlspace: 'xmlSpace',
  y1: 'y1',
  y2: 'y2',
  y: 'y',
  ychannelselector: 'yChannelSelector',
  z: 'z',
  zoomandpan: 'zoomAndPan'
};

const EMPTY_ARRAY = [];

const EMPTY_OBJECT = {};

class CustomHeap extends Array {
  constructor(
    judgeFun = (o1, o2) => o1 < o2,
    transferFun = (it) => it,
    ...args
  ) {
    super(...args);
    this.judgeFun = judgeFun;
    this.transferFun = transferFun;
    this._init();
  }

  get length() {
    return this.length;
  }

  peek() {
    return this[0];
  }

  pushValue(val) {
    this.push(val);
    let current = this.length - 1;
    let pre = ((current - 1) / 2) | 0;
    while (
      pre >= 0 &&
      this.judgeFun(
        this.transferFun(this[pre]),
        this.transferFun(this[current])
      )
    ) {
      this._swap(pre, current);
      current = pre;
      pre = ((current - 1) / 2) | 0;
    }
  }

  popTop() {
    const re = this[0];
    this[0] = this[this.length - 1];
    this.pop();
    this._heapDown(0);
    return re;
  }

  _swap(i, j) {
    const temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }

  _heapDown(current) {
    let max = current;
    const left = current * 2 + 1;
    const right = current * 2 + 2;
    if (
      left < this.length &&
      this.judgeFun(this.transferFun(this[max]), this.transferFun(this[left]))
    ) {
      max = left;
    }
    if (
      right < this.length &&
      this.judgeFun(this.transferFun(this[max]), this.transferFun(this[right]))
    ) {
      max = right;
    }
    if (max !== current) {
      this._swap(max, current);
      this._heapDown(max);
    }
  }

  _init() {
    const start = ((this.length - 1) / 2) | 0;
    for (let i = start; i >= 0; i--) {
      this._heapDown(i);
    }
  }
}

const SORT_BY_DEEP_HEAP = new CustomHeap(
  (o1, o2) => o1 > o2,
  (fiber) => fiber.deepIndex
);

class MyReactInternalType {
  __internal_node_type__ = {
    __isTextNode__: false,
    __isEmptyNode__: false,
    __isPlainNode__: false,
    __isFragmentNode__: false,
    // 对象转换为节点   //
    __isObjectNode__: false,
    __isForwardRef__: false,
    __isPortal__: false,
    __isMemo__: false,
    __isContextProvider__: false,
    __isContextConsumer__: false,
    // 动态节点 //
    __isDynamicNode__: false,
    __isClassComponent__: false,
    __isFunctionComponent__: false,
  };

  get __isTextNode__() {
    return this.__internal_node_type__.__isTextNode__;
  }
  get __isEmptyNode__() {
    return this.__internal_node_type__.__isEmptyNode__;
  }
  get __isPlainNode__() {
    return this.__internal_node_type__.__isPlainNode__;
  }
  get __isFragmentNode__() {
    return this.__internal_node_type__.__isFragmentNode__;
  }
  get __isObjectNode__() {
    return this.__internal_node_type__.__isObjectNode__;
  }
  get __isForwardRef__() {
    return this.__internal_node_type__.__isForwardRef__;
  }
  get __isPortal__() {
    return this.__internal_node_type__.__isPortal__;
  }
  get __isMemo__() {
    return this.__internal_node_type__.__isMemo__;
  }
  get __isContextProvider__() {
    return this.__internal_node_type__.__isContextProvider__;
  }
  get __isContextConsumer__() {
    return this.__internal_node_type__.__isContextConsumer__;
  }
  get __isDynamicNode__() {
    return this.__internal_node_type__.__isDynamicNode__;
  }
  get __isClassComponent__() {
    return this.__internal_node_type__.__isClassComponent__;
  }
  get __isFunctionComponent__() {
    return this.__internal_node_type__.__isFunctionComponent__;
  }

  /**
   *
   * @param {{__isTextNode__: boolean,
   *  __isEmptyNode__: boolean,
   *  __isPlainNode__: boolean,
   *  __isFragmentNode__: boolean,
   *  __isObjectNode__: boolean,
   *  __isMemo__: boolean,
   *  __isPortal__: boolean,
   *  __isForwardRef__: boolean,
   *  __isContextProvider__: boolean,
   *  __isContextConsumer__: boolean,
   *  __isDynamicNode__: boolean,
   *  __isClassComponent__: boolean,
   *  __isFunctionComponent__: boolean}} props
   */
  setNodeType(props) {
    Object.keys(props || EMPTY_OBJECT).forEach((key) => {
      this.__internal_node_type__[key] = props[key];
    });
  }

  /**
   *
   * @param {{__isTextNode__: boolean,
   *  __isEmptyNode__: boolean,
   *  __isPlainNode__: boolean,
   *  __isFragmentNode__: boolean,
   *  __isObjectNode__: boolean,
   *  __isMemo__: boolean,
   *  __isPortal__: boolean,
   *  __isForwardRef__: boolean,
   *  __isContextProvider__: boolean,
   *  __isContextConsumer__: boolean,
   *  __isDynamicNode__: boolean,
   *  __isClassComponent__: boolean,
   *  __isFunctionComponent__: boolean}} props
   */
  isSameType(props) {
    return NODE_TYPE_KEY.every(
      (key) => this.__internal_node_type__[key] === props[key]
    );
  }
}

class MyReactInternalInstance {
  /**
   * @type MyReactFiberNode
   */
  __fiber__ = null;

  /**
   * @type MyReactFiberNode
   */
  __context__ = null;

  /**
   * @type number
   */
  __hecticCount__ = 0;

  /**
   * @type number
   */
  __updateTimeStep__ = null;

  /**
   *
   * @param {MyReactFiberNode} context
   */
  setContext(context) {
    if (this.__context__) this.__context__.removeDependence(this);
    this.__context__ = context;
    this.__context__?.addDependence(this);
  }

  /**
   *
   * @param {MyReactFiberNode} fiber
   */
  setFiber(fiber) {
    this.__fiber__ = fiber;
  }

  updateTimeStep() {
    if (enableAllCheck.current) {
      const now = new Date().getTime();
      if (now - this.__updateTimeStep__ <= 2) {
        this.__hecticCount__ += 1;
      } else {
        this.__hecticCount__ = 0;
      }
      if (this.__hecticCount__ > 40) {
        error({
          message: "look like have a infinity loop on current component",
          fiber: this.__fiber__,
        });
      }
      this.__updateTimeStep__ = now;
    }
  }
}

/**
 *
 * @param {any} val
 * @returns
 */
const createRef = (val) => ({ current: val });

export {
  createRef,
  EMPTY_ARRAY,
  EMPTY_OBJECT,
  NODE_TYPE_KEY,
  COMPONENT_METHOD,
  DEFAULT_NODE_TYPE,
  SORT_BY_DEEP_HEAP,
  IS_SINGLE_ELEMENT,
  IS_UNIT_LESS_NUMBER,
  MyReactInternalType,
  MyReactInternalInstance,
};
