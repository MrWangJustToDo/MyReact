import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import InfiniteSnowGround from "./components/InfiniteSnowGround";
import FrameLimiter from "./utils/FPSLimiter";

const Scene = () => {
  return (
    <Canvas camera={{ fov: 65, position: [0, 30, 100] }} dpr={1}>
      <color attach="background" args={["white"]} />

      <directionalLight position={[4, 5, 0]} intensity={3} />

      <ambientLight intensity={1} />

      <InfiniteSnowGround />

      {/* <Stats /> */}
      <OrbitControls makeDefault enableDamping={false} enableRotate={false} enableZoom={false} enablePan={false} />

      <FrameLimiter />
    </Canvas>
  );
};

export default Scene;
