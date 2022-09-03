import { lazy, Suspense, useEffect, useState } from "react";

const LazyUI = lazy(() => import("../components/LazyLoadTest"));

const usePosition = () => {
  const [currentPosition, setCurrentPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const action = (e: MouseEvent) => setCurrentPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", action);
    return () => window.removeEventListener("mousemove", action);
  }, []);

  return [currentPosition.x, currentPosition.y];
};

const LazyLoad = () => {
  const [x] = usePosition();
  return (
    <div>
      <Suspense fallback={<>123</>}>
        <div>
          <h2>lazy page</h2>
          <div>123</div>
          <LazyUI time={new Date().toString()} />
          <LazyUI time="foo bar" />
          <LazyUI time={x.toString()} />
        </div>
      </Suspense>
    </div>
  );
};

export default LazyLoad;
