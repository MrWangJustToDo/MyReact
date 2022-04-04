import {
  React,
  forwardRef,
  useCallback,
  useState,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  memo,
  createPortal,
  createRef,
  createContext,
} from "./react.js";

const Context = createContext("kkf");

const useCounter = (init = 1) => {
  const [count, setCount] = useState(init);
  const i = useCallback(() => setCount((last) => last + 1), [setCount]);
  const j = useCallback(() => setCount((last) => last - 1), [setCount]);

  return [count, i, j];
};

const useTime = () => {
  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleString()
  );
  useEffect(() => {
    console.log("init");
    const id = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return currentTime;
};

const usePosition = () => {
  const [currentPosition, setCurrentPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const action = (e) => setCurrentPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", action);
    return () => window.removeEventListener("mousemove", action);
  }, []);

  return [currentPosition.x, currentPosition.y];
};

class F extends React.Component {
  componentDidMount() {
    console.log("class mount", this);
  }
  render() {
    const { children } = this.props;
    return <div> class Component : children {children} </div>;
  }
}

const App = () => {
  const [val, setVal] = useState(123);
  const time = useTime();
  const ref = useRef();
  useEffect(() => {
    console.log(ref);
  });
  return (
    <>
      {val} {time} <button onClick={() => setVal(Math.random())}>add</button>
      <GG val={val} />
      <GGM />
      <TestF />
      <Ref ref={ref} children={123} />
      <MRef ref={ref} children={123} />
      <MRef>
        <>memo ref</>
      </MRef>
      <PB />
    </>
  );
};

const Foo = ({ children }) => {
  console.log(children);
  return <>{children}</>;
};

function GG({ val }) {
  console.log("run GG");
  return createPortal(
    <>
      {"1234"} 456 bbg {val}{" "}
    </>,
    document.querySelector("#r")
  );
}

const GGM = memo(() => {
  console.log("run GGM");
  return createPortal(<>{"1234"} 456 bbg </>, document.querySelector("#r"));
});

const Ref = forwardRef((p, r) => {
  console.log("run ref");
  return <div ref={r}>{p.children}</div>;
});

const MRef = memo(
  forwardRef(({ children }, r) => {
    console.log("run memo ref");
    return <div ref={r}>{children}</div>;
  })
);

function PO({ children }) {
  return <PB>{[1, 2, 3].map((i) => children)}</PB>;
}
function PB({ children }) {
  return <>{children}</>;
}

function TestF({ children }) {
  return (
    <div>
      <PO>
        {[1, 2, 3, 4, 5].map((i, _i) => (
          <p>{i}</p>
        ))}
      </PO>
      {children}
      <button>add</button>
    </div>
  );
}

const BB = () => {
  const [v, add] = useCounter();
  const [val, setVal] = useState([]);
  return (
    <>
      {v % 2 !== 0 && <p>123</p>}
      {/* <>
        {val.map((i) => (
          <p>{i}</p>
        ))}
      </> */}
      <Context.Provider>123</Context.Provider>
      {/* <button onClick={add}>add</button>
      <button onClick={() => setVal((last) => [...last, Math.random()])}>
        add array
      </button> */}
    </>
  );
};

// React.render(<App />, document.querySelector("#root"));
React.render(<BB />, document.querySelector("#root"));
