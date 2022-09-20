// 使用context实现store
import React, { useContext, createContext, Component } from "react";

// 实现store对象
class Store {
  constructor(reducer, init) {
    // reducer函数,处理不同的派发请求
    this.reducer = reducer;
    // state, store对象存储的数据
    this.state = init;
    // 派发任务执行时的监听器
    this.listeners = [];
  }

  // 获取store对象存储的数据
  getState = () => {
    return this.state;
  };

  // 派发任务的函数
  dispatch = (action) => {
    this.state = this.reducer(this.state, action);
    this.listeners.forEach((it) => {
      it();
    });
  };

  // 添加额外触发器的函数,每一次dispath后都会执行的函数
  subscribe = (listener) => {
    this.listeners.push(listener);
    // 返回一个取消监听的函数
    return () =>
      (this.listeners = this.listeners.filter((it) => it != listener));
  };
}

// 实现redux的createStore方法
function createStore(reducer, init) {
  return new Store(reducer, init);
}

let StoreContext = createContext();

// 实现react-redux的Provider组件, 用法<Provider store={store}></Provider>
function Provider({ store, children }) {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

// 实现react-redux的useSelector() hook函数, 从store存储的数据中提取数据
function useSelector(selector) {
  let store = useContext(StoreContext);
  return selector(store.getState());
}

// 实现react-redux的useDispath() hook函数, 使用store对象派发操作
function useDispatch() {
  let store = useContext(StoreContext);
  return function (action) {
    store.dispatch(action);
  };
}

// 实现react-redux的useStore()  hook函数, 直接获取store对象
function useStore() {
  return useContext(StoreContext);
}

// 通过高阶组件实现类组件的connect(mapStateToProps,mapDispatchToProps )方法, 将一个react组件连接到redux的store数据源上,最终就可以从组件的自身属性上获取到
// 一般接收两个函数,第一个将store对象的state映射为组件的props,第二个将store的dispath方法映射为组件的props
// redux管理的store上的数据

function connect(mapStateToProps, mapDispatchToProps) {
  return function (Comp) {
    return class extends Component {
      static contextType = StoreContext;

      render() {
        let store = this.context;
        let stateToProps = mapStateToProps(store.getState(), this.props);
        let dispathToProps = mapDispatchToProps(store.dispath);
        return (
          <Comp {...this.props} {...stateToProps} {...dispathToProps}>
            {this.props.children}
          </Comp>
        );
      }
    };
  };
}

export { createStore, Provider, useSelector, useDispatch, useStore };
