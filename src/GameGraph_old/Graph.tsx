import { Canvas, useFrame } from "@react-three/fiber";
import R3fForceGraph, { type GraphMethods } from "r3f-forcegraph";
import SpriteText from "three-spritetext";
import type { GraphType } from "../types";
import React, { useRef } from "react";
import { TrackballControls } from "@react-three/drei";

function Graph({ graph }: { graph: GraphType }) {
  return (
    <Canvas
      style={{ width: "600px", height: "400px", borderRadius: "20px"}}
      flat
      camera={{ position: [0, 0, 80], far: 800 }}
    >
      <TrackballControls />
      <color attach="background" args={[0, 0, 0.01]} />
      <ambientLight color={0xcccccc} intensity={Math.PI} />
      <directionalLight intensity={0.6 * Math.PI} />
      <GraphInner graphData={graph} />
    </Canvas>
  );
}

function GraphInner({ graphData }: { graphData: GraphType }) {
  const fgRef = useRef<GraphMethods>(undefined);
  const clonedData = structuredClone(graphData);
  useFrame(() => fgRef.current?.tickFrame());

  return (
    <R3fForceGraph
      ref={fgRef}
      graphData={clonedData}
      // Ativa a seta e define o tamanho (em unidades 3D)
      linkDirectionalArrowLength={3.5}
      // Coloca a seta no final do link (0 = início, 1 = fim)
      linkDirectionalArrowRelPos={1}
      // (Opcional) Cor da seta
      linkDirectionalArrowColor={() => "white"}
      nodeThreeObject={(node) => {
        const sprite = new SpriteText(String(node.id));
        sprite.color = "white";
        sprite.textHeight = 8;
        return sprite;
      }}
    />
  );
}

export default React.memo(Graph);
