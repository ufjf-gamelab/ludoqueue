import { useFrame } from "@react-three/fiber";
import R3fForceGraph, { type GraphMethods } from "r3f-forcegraph";
import SpriteText from "three-spritetext";
import type { GraphType } from "../types";
import { useRef } from "react";

export default function Graph({ graphData }: { graphData: GraphType }) {
  const fgRef = useRef<GraphMethods>(undefined);
  const clonedData = structuredClone(graphData);
  useFrame(() => fgRef.current?.tickFrame());

  return (
    <R3fForceGraph
      ref={fgRef}
      graphData={clonedData}
      nodeThreeObject={(node) => {
        const sprite = new SpriteText(String(node.id));
        sprite.color = "white";
        sprite.textHeight = 8;
        return sprite;
      }}
    />
  );
}
