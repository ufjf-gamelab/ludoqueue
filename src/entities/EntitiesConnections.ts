import type { GameType } from "../types";
import {
  getInvertedDirection,
  type EntityConsumerType,
  type EntityMergerType,
  type EntitySourceType,
  type EntitySplitterType,
  type EntityStockType,
  type EntityTransportType,
  type EntityType,
} from "./EntitiesTypes";
import { clearConnectionsToEntity, getNeighbor } from "./EntityCommonActions";

//functions that are common for connections between different entities

export const functionsToConnectSource: Record<
  "stock" | "transport" | "source" | "splitter" | "merger",
  (
    entity: EntityType,
    connectingEntity: EntityTransportType | EntitySplitterType,
  ) => void
> = {
  stock: (entity, connectingEntity) => {
    if (entity.type !== "stock") return;

    if (
      entity.direction === getInvertedDirection(connectingEntity.entryDirection)
    ) {
      connectingEntity.source = entity.id;
    }
  },

  transport: (entity, connectingEntity) => {
    if (entity.type !== "transport") return;

    if (
      entity.leavingDirection ===
      getInvertedDirection(connectingEntity.entryDirection)
    ) {
      connectingEntity.source = entity.id;
      entity.target = connectingEntity.id;
    }
  },

  source: (entity, connectingEntity) => {
    if (entity.type !== "source") return;

    if (
      entity.leavingDirection ===
      getInvertedDirection(connectingEntity.entryDirection)
    ) {
      connectingEntity.source = entity.id;
    }
  },

  splitter: (entity, connectingEntity) => {
    if (entity.type !== "splitter") return;

    if (
      entity.entryDirection !==
      getInvertedDirection(connectingEntity.entryDirection)
    ) {
      entity.targets.push(connectingEntity.id);
      connectingEntity.source = entity.id;
    }
  },

  merger: (entity, connectingEntity) => {
    if (entity.type !== "merger") return;

    if (
      entity.leavingDirection ===
      getInvertedDirection(connectingEntity.entryDirection)
    ) {
      entity.target = connectingEntity.id;
      connectingEntity.source = entity.id;
    }
  },
};

export const functionsToConnectTarget: Record<
  "stock" | "transport" | "consumer" | "splitter" | "merger",
  (
    entity: EntityType,
    connectingEntity: EntityTransportType | EntityMergerType,
  ) => void
> = {
  stock: (entity, connectingEntity) => {
    if (entity.type !== "stock") return;

    if (entity.direction === connectingEntity.leavingDirection) {
      connectingEntity.target = entity.id;
    }
  },

  transport: (entity, connectingEntity) => {
    if (entity.type !== "transport") return;

    if (
      entity.entryDirection ===
      getInvertedDirection(connectingEntity.leavingDirection)
    ) {
      entity.source = connectingEntity.id;
      connectingEntity.target = entity.id;
    }
  },

  consumer: (entity, connectingEntity) => {
    if (entity.type !== "consumer") return;

    if (
      entity.entryDirection ===
      getInvertedDirection(connectingEntity.leavingDirection)
    ) {
      connectingEntity.target = entity.id;
    }
  },

  splitter: (entity, connectingEntity) => {
    if (entity.type !== "splitter") return;

    if (
      entity.entryDirection ===
      getInvertedDirection(connectingEntity.leavingDirection)
    ) {
      entity.source = connectingEntity.id;
      connectingEntity.target = entity.id;
    }
  },

  merger: (entity, connectingEntity) => {
    if (entity.type !== "merger") return;

    if (
      entity.leavingDirection !==
      getInvertedDirection(connectingEntity.leavingDirection)
    ) {
      entity.sources.push(connectingEntity.id);
      connectingEntity.target = entity.id;
    }
  },
};

export function updatePassiveEntitiesConnections(
  state: GameType,
  entity: EntityStockType | EntitySourceType | EntityConsumerType,
) {
  //faz um so pra passivo? fiz so pq da pra agrupar, so muda o jeito de pegar direcoes. verificar se mantem esse
  clearConnectionsToEntity(state, entity);
  clearConnectionsToEntity(state, entity);

  let entryNeighbor: EntityType | null = null;
  let leavingNeighbor: EntityType | null = null;
  if (entity.type === "stock") {
    entryNeighbor = getNeighbor(
      state,
      entity,
      getInvertedDirection(entity.direction),
    );
    leavingNeighbor = getNeighbor(state, entity, entity.direction);
  }

  if (entity.type === "consumer") {
    entryNeighbor = getNeighbor(state, entity, entity.entryDirection);
  }

  if (entity.type === "source") {
    leavingNeighbor = getNeighbor(state, entity, entity.leavingDirection);
  }


  if (
    entryNeighbor &&

    entity.type !== "source"
  ) {
    if (entryNeighbor.type === "transport" || entryNeighbor.type === "merger"){


    functionsToConnectTarget[entity.type]?.(
      entity,
      entryNeighbor as EntityTransportType | EntityMergerType,
    );
  }
  if (entryNeighbor.type === "splitter"){
    entryNeighbor.targets.push(entity.id);
  }
  }
  if (leavingNeighbor && entity.type !== "consumer") {
    if (
      leavingNeighbor.type === "transport" ||
      leavingNeighbor.type === "splitter"
    ) {
      functionsToConnectSource[entity.type]?.(
        entity,
        leavingNeighbor as EntityTransportType | EntitySplitterType,
      );
    }
    if (leavingNeighbor.type === "merger"){ //a logica deconnect source connect target quebrou aqui. rever
      leavingNeighbor.sources.push(entity.id);
    }
  }
}
