import type { Node } from "@xyflow/react";
import type { EntityMergerType, EntityType } from "../entities/EntitiesTypes";
import SourceGraphNode from "./Nodes/Source";
import MergerGraphNode from "./Nodes/Merger";


export type EntityMergerNode = Node<{ entity: EntityMergerType }, 'EntityType'>
export type EntityNode = Node<{ entity: EntityType }, 'EntityType'>

export const nodeTypes = {
    source: SourceGraphNode,
    merger: MergerGraphNode,
}
