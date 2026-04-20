import { useState, useCallback, use } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useGame } from "../Provider";
import type { GameType } from "../types";
import type {
  EntityMergerType,
  EntitySplitterType,
  EntityTransportType,
} from "../entities/EntitiesTypes";
import "./Graph.css";
import { nodeTypes } from "./Node";
type NodeType = {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
  };
};

type EdgeType = {
  id: string;
  source: string;
  target: string;
};

export default function GraphReactFlow() {
  const { game } = useGame()!;
  const initialNodes = getInitialNodes(game);
  const initialEdges = getInitialEdges(game);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <div style={{ width: "500px", height: "300px", border: "1px solid black" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}

function getInitialNodes(state: GameType): NodeType[] {
  const nodes: NodeType[] = [];
  Array.from(state.entities.values()).map((node) => {
    nodes.push({
      id: node.id,
      type: node.type,
      position: { x: node.x * 200, y: node.y * 200 },
      data: { label: node.name },
    });
  });
  return nodes;
}

function getInitialEdges(state: GameType) {
  const edges: EdgeType[] = [];
  state.transports.forEach((transport) => {
    const entity = state.entities.get(transport) as EntityTransportType;
    if (entity.source) {
      edges.push({
        id: `${entity.source} "-" ${entity.id}`,
        source: entity.source,
        target: entity.id,
      });
    }
    if (entity.target) {
      edges.push({
        id: `${entity.id} "-" ${entity.target}`,
        source: entity.id,
        target: entity.target,
      });
    }
  });
  state.mergers.forEach((merger) => {
    const entity = state.entities.get(merger) as EntityMergerType;
    if (entity.sources) {
      for (const source of entity.sources) {
        edges.push({
          id: `${source} "-" ${entity.id}`,
          source: source,
          target: entity.id,
        });
      }
    }
    if (entity.target) {
      edges.push({
        id: `${entity.id} "-" ${entity.target}`,
        source: entity.id,
        target: entity.target,
      });
    }
  });
  state.splitters.forEach((splitter) => {
    const entity = state.entities.get(splitter) as EntitySplitterType;
    if (entity.targets) {
        for (const target of entity.targets) {
        edges.push({
        id: `${entity.id} "-" ${target}`,
        source: entity.id,
        target: target,
      });
        
    }
    if (entity.source) {
      edges.push({
          id: `${entity.source} "-" ${entity.id}`,
          source: entity.source,
          target: entity.id,
        });
      }
    }
  });
  return edges;
}
