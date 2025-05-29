export const code = {
  "Simple.tsx": `import { Canvas, useFrame } from "@my-react/react-three-fiber";
import { useRef, useState } from "react";

import type { ThreeElements } from "@my-react/react-three-fiber";

function Box(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  useFrame((state, delta) => (ref.current.rotation.x += delta));
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export const Exp = () => {
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
};
`,
  "SuspenseMaterial.tsx": `import { Canvas } from "@my-react/react-three-fiber";
import { Suspense, useReducer } from "react";
import { suspend } from "suspend-react";

function SlowMaterial({ arg = 0 }) {
  suspend(() => new Promise((res) => setTimeout(res, 1000)), [arg]);
  return <meshStandardMaterial name="main" color="salmon" toneMapped={false} />;
}

function FallbackMaterial() {
  return <meshStandardMaterial name="fallback" color="white" />;
}

export const Exp = function App() {
  const [arg, inc] = useReducer((x) => x + 1, 0);
  return (
    <Canvas>
      <ambientLight intensity={Math.PI} />
      <directionalLight />
      <mesh onClick={inc}>
        <sphereGeometry args={[1, 64, 32]} />
        <Suspense fallback={<FallbackMaterial />}>
          <SlowMaterial arg={arg} />
        </Suspense>
      </mesh>
    </Canvas>
  );
};
`,
  "AutoDispose.tsx": `import { Canvas, useFrame } from "@my-react/react-three-fiber";
import { useRef, useState } from "react";

import type { ThreeElements} from "@my-react/react-three-fiber";
import type * as THREE from "three";

type BoxProps = ThreeElements["object3D"] & {
  setActive: (active: boolean) => void;
  active: boolean;
};

function Box1(props: BoxProps) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  useFrame((state) => (mesh.current.position.y = Math.sin(state.clock.elapsedTime)));

  return (
    <mesh {...props} ref={mesh} onClick={(e) => props.setActive(!props.active)} onPointerOver={(e) => setHover(true)} onPointerOut={(e) => setHover(false)}>
      <boxGeometry />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

function Box2(props: BoxProps) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  useFrame((state) => (mesh.current.position.y = Math.sin(state.clock.elapsedTime)));

  return (
    <group {...props}>
      <mesh {...props} ref={mesh} onClick={(e) => props.setActive(!props.active)} onPointerOver={(e) => setHover(true)} onPointerOut={(e) => setHover(false)}>
        <boxGeometry />
        <meshStandardMaterial color={hovered ? "green" : "blue"} />
      </mesh>
    </group>
  );
}

function Switcher() {
  const [active, setActive] = useState(false);

  return (
    <>
      {active && <Box1 active={active} setActive={setActive} position={[-0.5, 0, 0]} />}
      {!active && <Box2 active={active} setActive={setActive} position={[0.25, 0, 0]} />}
    </>
  );
}

export const Exp = function App() {
  return (
    <Canvas orthographic camera={{ zoom: 100 }}>
      <ambientLight intensity={Math.PI} />
      <Switcher />
    </Canvas>
  );
};
`,
  "ContextMenuOverride.tsx": `import { Canvas } from "@my-react/react-three-fiber";
import { useState } from "react";

export const Exp = function Exp() {
  const [state, setState] = useState(false);

  return (
    <Canvas orthographic camera={{ zoom: 150, fov: 75, position: [0, 0, 25] }} onPointerMissed={() => console.log("canvas.missed")}>
      <ambientLight intensity={Math.PI} />
      <pointLight decay={0} position={[10, 10, 10]} />
      <mesh
        scale={[2, 2, 2]}
        position={[1, 0, 0]}
        onContextMenu={(ev) => {
          ev.nativeEvent.preventDefault();
          setState((value) => !value);
        }}
        onPointerMissed={() => console.log("mesh.missed")}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial color={state ? "hotpink" : "blue"} />
      </mesh>
    </Canvas>
  );
};
`,
  "MultiMaterial.tsx": `import { Canvas } from "@my-react/react-three-fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import type { ThreeElements} from "@my-react/react-three-fiber";


const redMaterial = new THREE.MeshBasicMaterial({ color: "aquamarine", toneMapped: false });

function ReuseMaterial(props: ThreeElements["mesh"]) {
  return (
    <mesh {...props}>
      <sphereGeometry args={[0.25, 64, 64]} />
      <primitive attach="material" object={redMaterial} />
    </mesh>
  );
}

function TestReuse() {
  const [okay, setOkay] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setOkay((okay) => !okay), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {okay && <ReuseMaterial position={[-1.5, 0, 0]} />}
      <ReuseMaterial position={[1.5, 0, 0]} />
    </>
  );
}

function TestMultiMaterial(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  const [okay, setOkay] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setOkay((okay) => !okay), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log(ref.current.material);
  }, [okay]);

  return (
    <mesh ref={ref} {...props}>
      <boxGeometry args={[0.75, 0.75, 0.75]} />
      <meshBasicMaterial attach="material-0" color="hotpink" toneMapped={false} />
      <meshBasicMaterial attach="material-1" color="lightgreen" toneMapped={false} />
      {okay ? <meshBasicMaterial attach="material-2" color="lightblue" toneMapped={false} /> : <meshNormalMaterial attach="material-2" />}
      <meshBasicMaterial attach="material-3" color="pink" toneMapped={false} />
      <meshBasicMaterial attach="material-4" color="orange" toneMapped={false} />
      <meshBasicMaterial attach="material-5" color="lavender" toneMapped={false} />
    </mesh>
  );
}

function TestMultiDelete(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  const [okay, setOkay] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setOkay((okay) => !okay), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log(ref.current.material);
  }, [okay]);

  return (
    <mesh ref={ref} {...props}>
      <boxGeometry args={[0.75, 0.75, 0.75]} />
      <meshBasicMaterial attach="material-0" color="hotpink" side={THREE.DoubleSide} toneMapped={false} />
      <meshBasicMaterial attach="material-1" color="lightgreen" side={THREE.DoubleSide} toneMapped={false} />
      {okay && <meshBasicMaterial attach="material-2" color="lightblue" side={THREE.DoubleSide} toneMapped={false} />}
      <meshBasicMaterial attach="material-3" color="pink" side={THREE.DoubleSide} toneMapped={false} />
      <meshBasicMaterial attach="material-4" color="orange" side={THREE.DoubleSide} toneMapped={false} />
      <meshBasicMaterial attach="material-5" color="lavender" side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}

function TestMix(props: ThreeElements["mesh"]) {
  const [size, setSize] = useState(0.1);
  const geometry = useMemo(() => new THREE.SphereGeometry(size, 64, 64), [size]);

  useEffect(() => {
    const timeout = setInterval(
      () =>
        setSize((s) => {
          return s < 0.4 ? s + 0.025 : 0;
        }),
      1000
    );
    return () => clearTimeout(timeout);
  }, []);

  return (
    <mesh args={[geometry]} {...props}>
      <meshBasicMaterial color="hotpink" toneMapped={false} />
    </mesh>
  );
}

export const Exp = function Test() {
  return (
    <Canvas camera={{ position: [2, 2, 2] }}>
      <TestMultiMaterial position={[0, 0, 0.5]} />
      <TestMultiDelete position={[0, 0, -0.5]} />
      <TestReuse />
      <TestMix position={[0, 1, 0]} />
    </Canvas>
  );
};
`,
  "MultiRender.tsx": `import { useFrame, Canvas } from "@my-react/react-three-fiber";
import { useEffect, useRef, useState } from "react";


import type * as THREE from "three";

const CanvasStyle = {
  width: "100%",
  height: "50%",
};

const Object = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.03;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  );
};

const SpinningScene = () => (
  <div style={CanvasStyle}>
    <Canvas>
      <Object />
    </Canvas>
  </div>
);

const StaticScene = () => (
  <div style={CanvasStyle}>
    <Canvas>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshNormalMaterial />
      </mesh>
    </Canvas>
  </div>
);

export const Exp = function App() {
  const [secondScene, setSecondScene] = useState(false);

  useEffect(() => {
    setTimeout(() => setSecondScene(true), 500);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <SpinningScene />
      {secondScene && <StaticScene />}
    </div>
  );
};
`,
  "Pointcloud.tsx": `import { Canvas, createPortal } from "@my-react/react-three-fiber";
import { useCallback, useEffect, useReducer, useState } from "react";


import type * as THREE from "three";

function Icosahedron() {
  const [active, setActive] = useState(false);
  const handleClick = useCallback(() => setActive((state) => !state), []);
  return (
    <mesh scale={active ? [2, 2, 2] : [1, 1, 1]} onClick={handleClick}>
      <icosahedronGeometry args={[1, 0]} />
      <meshNormalMaterial />
    </mesh>
  );
}

function RenderToPortal({ targets }: { targets: THREE.Group[] }) {
  const [target, toggle] = useReducer((state) => (state + 1) % targets.length, 0);

  useEffect(() => {
    const interval = setInterval(toggle, 1000);
    return () => clearInterval(interval);
  }, [targets]);

  return <>{createPortal(<Icosahedron />, targets[target])}</>;
}

export const Exp = function Group() {
  const [ref1, set1] = useState<THREE.Group>(null!);
  const [ref2, set2] = useState<THREE.Group>(null!);

  console.log("rendering Group", ref1, ref2);

  return (
    <Canvas onCreated={() => console.log("onCreated")}>
      <group>
        <group ref={set1 as any} position={[-2, 0, 0]} />
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshNormalMaterial />
        </mesh>
        <group ref={set2 as any} position={[2, 0, 0]} />
        {ref1 && ref2 && <RenderToPortal targets={[ref1, ref2]} />}
      </group>
    </Canvas>
  );
};
`,
};
