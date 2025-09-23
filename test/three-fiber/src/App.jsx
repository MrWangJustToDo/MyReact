import { useEffect, useRef } from "react";
import { isMobile, isTablet } from "react-device-detect";

import Scene from "./Scene";

function App() {
  const tutorialRef = useRef(null);

  useEffect(() => {
    const hideTutorial = () => {
      tutorialRef.current.style.display = "none";
    };

    document.addEventListener("touchstart", hideTutorial);
    document.addEventListener("keydown", hideTutorial);

    return () => {
      document.removeEventListener("touchstart", hideTutorial);
      document.removeEventListener("keydown", hideTutorial);
    };
  }, []);

  return (
    <div className="canvas-wrapper">
      <Scene />

      <div ref={tutorialRef} className="tutorial-wrapper">
        {isTablet || isMobile ? (
          <span className="mobile-tutorial">
            Touch and drag on the screen to navigate the character.
          </span>
        ) : (
          <div className="tutorial-keys">
            <section className="wasd-keys">
              <span>W</span>
              <span>A</span>
              <span>S</span>
              <span>D</span>
            </section>

            <section className="arrow-keys">
              <span>&uarr;</span>
              <span>&larr;</span>
              <span>&darr;</span>
              <span>&rarr;</span>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
