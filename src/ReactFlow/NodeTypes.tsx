import type { Node } from "@xyflow/react";
import type { EntityExchangerType, EntityMergerType, EntitySplitterType, EntityStockType, EntityType } from "../entities/EntitiesTypes";
import SourceGraphNode from "./Nodes/Source";
import MergerGraphNode from "./Nodes/Merger";
import ConsumerGraphNode from "./Nodes/Consumer";
import SplitterGraphNode from "./Nodes/Splitter";
import StockGraphNode from "./Nodes/Stock";
import ExchangerGraphNode from "./Nodes/Exchanger";


export type EntityMergerNode = Node<{ entity: EntityMergerType }, 'EntityType'>
export type EntitySplitterNode = Node<{ entity: EntitySplitterType }, 'EntityType'>
export type EntityStockNode = Node<{ entity: EntityStockType }, 'EntityType'>
export type EntityExchangerNode = Node<{ entity: EntityExchangerType }, 'EntityType'>
export type EntityNode = Node<{ entity: EntityType }, 'EntityType'>

export const nodeTypes = {
    source: SourceGraphNode,
    consumer: ConsumerGraphNode,
    merger: MergerGraphNode,
    splitter: SplitterGraphNode,
    stock: StockGraphNode,
    exchanger: ExchangerGraphNode,
}
