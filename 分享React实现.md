## React的原理以及实现分享

&emsp; 在React的HTML页面引入中  React分为了两个包：React 以及 ReactDOM  其中前者定义了React中的主要方法以及数据结构的逻辑  而后者则主要用来连接React的逻辑与真实渲染对象的映射  因此通过React可以衍生出操作其他平台的渲染框架  
```js
// JSX语法
const a = <div>123</div>
const b = () => <div>123</div>
```
&emsp; JSX语法是一项可以在JS中直接书写HTML标签来定义组件的语法，通过这种方式，开发者可以明确的了解组件的结构与内容。JSX本身是不会被任何环境识别运行的，必须通过第三方工具进行编译，生成js代码后才能够运行，而这个编译工具就是Babel，简单点来说Babel就是一个通用的可扩展的js转换工具，通过Babel的插件和一些配置，可以将高版本的JS代码转换为可以在低版本的JS运行环境上运行的代码，JSX也需要通过Babel进行编译，Babel的解析成为AST 即语法树，一般是通过递归下降的算法来进行逐行解析的，解析完成后会生成一颗语法树，通过对语法书不同的语义进行特定替换，就可以将解析出来的内容转换为其他多种风格的内容，比如说解析一个JSON格式字符串，本质上来说与解析JSX是一样的。
```js
// 编译结果
var a = MReact.createElement("div", null, "123");

var b = function b() {
  return MReact.createElement("div", null, "123");
};
```

&emsp; Babel对于React有特殊的支持，从当前开始标签到结束标签，会通过一个React的核心方法来进行连接： React.createElement(type, props, ...children), 这个方法是React的核心方法之一，作用是将JSX转换为一个嵌套的js对象，这个对象中包含了JSX的所有信息。另一个React的核心方法为render，作用是将js对象渲染为页面上的真实DOM，当渲染完成后，React会接管页面上DOM的更新渲染，通过虚拟DOM，diff比较来最大可能复用页面上已经存在的DOM对象。

&emsp; 早期的React实现的render过程是递归实现的，这会造成在递归运行期间，浏览器主线程是完全被占用的，如果执行时间过长，而用户又进行了操作，此时浏览器不会有任何响应，在React16版本中，React重写了底部的逻辑，引入了分片任务Fiber的概念，即React的操作不会长时间占用浏览器主线程，通过将任务划分为一个一个小任务，依次来进行执行。Fiber结构简单来说是一个双向链表的多叉树结构，从根节点开始，一个jsx标签对应一个fiber节点，因为整体结构是一个双向链表，所以React内部可以随时进行暂停，开始等操作，首先，初始化会生成一颗初始fiber树，之后的每次更新，会在上一次fiber树的基础上创建新的fiber进行替换，通过前后前后两次props的比较，来定义当前fiber需要进行的操作，最后会在所有fiber比较完成后，一次性进行递归渲染更新。

&emsp; 函数组件和普通的JSX标签式存在一些区别，因为函数组件会存在标签而本身不会对应任何DOM，并且函数组件本身也是需要运行才能获取到内部的结果，因此在处理时需要进行特殊处理

&emsp; HOOK实现，hook本身是通过js的闭包逻辑实现的，通过外挂在fiber节点上的属性进行保存。hook会有几个使用规则： 1  保证多次渲染的执行顺序   2  只能在React内部运行  。hook的原理是通过一个index索引以及当前函数组件fiber的全局变量来定位自己是在哪个函数组件中被调用运行的，每次运行函数组件会让外部的标记指向这个fiber，并且初始化index，运行函数组件后，如果函数组件内部存在hook，hook则可以通过外部的标记知道自己对应的fiber，然后读取到响应的数据，并且递增index值，这样通过index值就可以明确当前hook的顺序以及结果。

&emsp; 几点补充：一：现在的diff逻辑比较简单，对于数组的情况也没用通过设置key进行比较而是直接按照循序进行。二：现在的的运行调度完全依赖于浏览器的方法，不能够自己进行控制。三：现在的实现将dom与数据结构逻辑深度耦合，没有进行拆分。四：现在的hook逻辑不够优雅，实现的比较粗糙，没有做异步更新机制。五：没有实现React的class支持