/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { GameStatus, GameType } from "./types";
import type {
  EntityConsumerType,
  EntitySourceType,
  EntityStockType,
  EntityTransportType,
  EntityType,
  DirectionType,
  EntitySplitterType,
  EntityMergerType,
  MovingGoodType,
  GoodType,
} from "./entities/EntitiesTypes";
import { initialState } from "./data";
import {
  changeSourceGoodType,
  changeSourceLeavingDirection,
  createSource,
  deleteSource,
  type GameActionChangeSourceGoodType,
  type GameActionChangeSourceLeavingDirection,
  type GameActionCreateSource,
  type GameActionDeleteSource,
} from "./entities/Source/SourceActions";
import {
  changeStockDirection,
  createStock,
  deleteStock,
  type GameActionChangeStockDirection,
  type GameActionCreateStock,
  type GameActionDeleteStock,
} from "./entities/Stock/StockActions";
import {
  changeConsumerEntryDirection,
  createConsumer,
  deleteConsumer,
  type GameActionChangeConsumerEntryDirection,
  type GameActionCreateConsumer,
  type GameActionDeleteConsumer,
} from "./entities/Consumer/ConsumerActions";
import {
  changeTransportEntryDirection,
  changeTransportLeavingDirection,
  createTransport,
  deleteTransport,
  type GameActionChangeTransportEntryDirection,
  type GameActionChangeTransportLeavingDirection,
  type GameActionCreateTransport,
  type GameActionDeleteTransport,
} from "./entities/Transport/TransportActions";
import type {
  GameConsumerEditor,
  GameEditor,
  GameSourceEditor,
  GameStockEditor,
  GameTransporterEditor,
  GameSplitterEditor,
  GameMergerEditor,
} from "./Editor/EditorTypes";
import {
  type GameActionCreateSplitter,
  type GameActionDeleteSplitter,
  type GameActionChangeSplitterEntryDirection,
  createSplitter,
  deleteSplitter,
  changeSplitterEntryDirection,
} from "./entities/Splitter/SplitterActions";
import {
  changeMergerLeavingDirection,
  createMerger,
  deleteMerger,
  type GameActionChangeMergerLeavingDirection,
  type GameActionCreateMerger,
  type GameActionDeleteMerger,
} from "./entities/Merger/MergerActions";
import type {
  GameActionEditorChangeDirection,
  GameActionEditorChangeEntryDirection,
  GameActionEditorChangeGoodType,
  GameActionEditorChangeLeavingDirection,
  GameActionEditorChangeMax,
  GameActionEditorChangeRate,
  GameActionEditorChangeVal,
} from "./Editor/EditorActions";
type GameProviderProps = {
  children: ReactNode;
};
const GameContext = createContext<{
  game: GameType;
  dispatch: Dispatch<GameAction>;
} | null>(null);
export default function GameProvider({ children }: GameProviderProps) {
  const [game, dispatch] = useReducer(gameReducer, initialState);
  return <GameContext value={{ game, dispatch }}>{children}</GameContext>;
}
export function useGame() {
  return useContext(GameContext);
}

export function gameReducer(state: GameType, action: GameAction): GameType {
  switch (action.type) {
    case "create source":
      return createSource(
        state,
        action.max,
        action.x,
        action.y,
        action.leavingDirection,
        action.goodType,
      );
    case "delete source":
      return deleteSource(state, action.id);
    case "change source leaving direction":
      return changeSourceLeavingDirection(state, action.id, action.direction);
    case "change source good type":
      return changeSourceGoodType(state, action.id, action.goodType);
    case "create stock":
      return createStock(
        state,
        action.max,
        action.x,
        action.y,
        action.direction,
      );
    case "delete stock":
      return deleteStock(state, action.id);
    case "change stock direction":
      return changeStockDirection(state, action.id, action.direction);
    case "create consumer":
      return createConsumer(
        state,
        action.max,
        action.rate,
        action.x,
        action.y,
        action.entryDirection,
      );
    case "delete consumer":
      return deleteConsumer(state, action.id);
    case "change consumer entry direction":
      return changeConsumerEntryDirection(state, action.id, action.direction);
    case "create transport":
      return createTransport(
        state,
        action.max,
        action.rate,
        action.x,
        action.y,
        action.entryDirection,
        action.leavingDirection,
      );
    case "delete transport":
      return deleteTransport(state, action.id);
    case "change transport entry direction":
      return changeTransportEntryDirection(state, action.id, action.direction);
    case "change transport leaving direction":
      return changeTransportLeavingDirection(
        state,
        action.id,
        action.direction,
      );
    case "create splitter":
      return createSplitter(
        state,
        action.max,
        action.rate,
        action.x,
        action.y,
        action.entryDirection,
      );
    case "delete splitter":
      return deleteSplitter(state, action.id);
    case "change splitter entry direction":
      return changeSplitterEntryDirection(state, action.id, action.direction);
    case "create merger":
      return createMerger(
        state,
        action.max,
        action.rate,
        action.x,
        action.y,
        action.leavingDirection,
      );
    case "delete merger":
      return deleteMerger(state, action.id);
    case "change merger leaving direction":
      return changeMergerLeavingDirection(state, action.id, action.direction);
    case "game tick":
      return gameTick(state);
    case "select entity":
      return selectEntity(state, action.entityId);
    case "set status": {
      if (state.status === action.newStatus) {
        return { ...state, editor: null, status: "waiting" };
      } else {
        const newEditor = chooseNewEditor(action.newStatus);
        return { ...state, editor: newEditor, status: action.newStatus };
      }
    }
    case "pointing":
      return pointingAction(state, action);
    case "change game data":{
      return action.data
    }

    case "editor change max": {
      if (!state.editor) return state;
      return { ...state, editor: { ...state.editor, max: action.max } };
    }
    case "editor change rate": {
      if (
        !state.editor ||
        (state.editor.type !== "consumer" &&
          state.editor.type !== "source" &&
          state.editor.type !== "transporter" &&
          state.editor.type !== "splitter" &&
          state.editor.type !== "merger")
      )
        return state;

      return {
        ...state,
        editor: {
          ...state.editor,
          rate: action.rate,
        },
      };
    }
    case "editor change direction": {
      if (!state.editor || state.editor.type !== "stock") return state;
      return {
        ...state,
        editor: {
          ...state.editor,
          direction: action.direction as DirectionType,
        },
      };
    }
    case "editor change entry direction": {
      if (
        !state.editor ||
        (state.editor.type !== "consumer" &&
          state.editor.type !== "transporter" &&
          state.editor.type !== "splitter")
      )
        return state;
      const editor = state.editor as
        | GameConsumerEditor
        | GameTransporterEditor
        | GameSplitterEditor;
      return {
        ...state,
        editor: {
          ...editor,
          entryDirection: action.entryDirection as DirectionType,
        },
      };
    }
    case "editor change leaving direction": {
      if (
        !state.editor ||
        (state.editor.type !== "source" &&
          state.editor.type !== "transporter" &&
          state.editor.type !== "merger")
      )
        return state;
      return {
        ...state,
        editor: {
          ...state.editor,
          leavingDirection: action.leavingDirection as DirectionType,
        },
      };
    }
    case "editor change val": {
      if (!state.editor || state.editor.type !== "stock") return state;
      return { ...state, editor: { ...state.editor, val: action.value } };
    }
    case "editor change good type": {
      if (!state.editor || state.editor.type !== "source") return state;
      const editor = state.editor as GameSourceEditor;
      return {
        ...state,
        editor: { ...editor, goodType: action.goodType as GoodType },
      };
    }

    default:
      break;
  }
  return state;
}

export function gameTick(state: GameType) {
  const sources = new Map<string, EntitySourceType>();
  const consumers = new Map<string, EntityConsumerType>();
  const transports = new Map<string, EntityTransportType>();
  const stocks = new Map<string, EntityStockType>();
  const splitters = new Map<string, EntitySplitterType>();
  const mergers = new Map<string, EntityMergerType>();

  const newState = structuredClone(state);
  newState.time += 1;
  for (const [, node] of newState.entities.entries()) {
    switch (node.type) {
      case "source": {
        sources.set(node.id, node);
        break;
      }
      case "consumer": {
        consumers.set(node.id, node);
        break;
      }
      case "transport": {
        transports.set(node.id, node);
        break;
      }
      case "stock": {
        stocks.set(node.id, node);
        break;
      }
      case "splitter": {
        splitters.set(node.id, node);
        break;
      }
      case "merger": {
        mergers.set(node.id, node);
        break;
      }
    }
  }
  const all = new Map<string, EntityType>([
    ...sources.entries(),
    ...consumers.entries(),
    ...transports.entries(),
    ...stocks.entries(),
    ...splitters.entries(),
    ...mergers.entries(),
  ]);

  transports.forEach((transport) => {
    calculatePendingTransportMovingGoods(transport, all);
  });
  splitters.forEach((splitter) => {
    calculatePendingSplitterMovingGoods(splitter, all);
  });
  mergers.forEach((merger) => {
    calculatePendingMergerMovingGoods(merger, all);
  });
  transports.forEach((transport) => {
    transportMovingGoods(transport, newState);
  });
  splitters.forEach((splitter) => {
    transportMovingGoods(splitter, newState);
  });
  mergers.forEach((merger) => {
    transportMovingGoods(merger, newState);
  });
  consumers.forEach((consumer) => {
    gameConsumerTick(consumer);
  });
  sources.forEach((source) => {
    gameSourceTick(newState, source);
  });

  return newState;
}

export function gameSourceTick(state: GameType, node: EntitySourceType) {
  const dt = 1.0;
  node.cooldown -= dt;
  if (node.cooldown > 0) {
    return;
  }

  if (node.goods.length < node.max) {
    const newGood: MovingGoodType = {
      source: null,
      target: null,
      size: 1,
      time: state.time,
      goodType: node.goodType,
    };
    node.goods.push(newGood);
  }
  node.cooldown += 1 / node.rate;
}

export function gameConsumerTick(node: EntityConsumerType) {
  node.cooldown -= 1;
  if (node.cooldown > 0) {
    return;
  }
  if (node.goods.length > 0) {
    node.goods.shift();
  }
  node.cooldown += 1 / node.rate;
}

export function calculatePendingMergerMovingGoods(
  merger: EntityMergerType,
  all: Map<string, EntityType>,
) {
  merger.movingGoods = [];
  merger.cooldown -= 1;
  if (merger.cooldown > 0) {
    return merger.movingGoods;
  }
  merger.cooldown += 1 / merger.rate;

  const target = all.get(merger.target!);
  if (target && merger.goods.length > 0 && target.goods.length < target.max) {
    if ((target.type == "stock" && target.closed) || target.type === "merger") {
      return merger.movingGoods;
    }
    const good = merger.goods[0];
    if(!good){
      return merger.movingGoods
    }
    merger.movingGoods.push({ source:merger.id, target: target.id, size: good.size, time: good.time, goodType: good.goodType});
  }
  if (merger.goods.length === 0){
  for (let step = 0; step < merger.source.length; step++) {
    const index = (merger.nextSourceIndex + step) % merger.source.length;
    const sourceId = merger.source[index];
    const source = sourceId ? all.get(sourceId) : null;
    if (!source) continue;
    if (source.goods.length <= 0) {
      continue;
    }
    const good = source.goods[0];
    if (!good){
      return merger.movingGoods
    }
    merger.movingGoods.push({ source:source.id, target: merger.id, size: good.size, time: good.time, goodType: good.goodType});
    merger.nextSourceIndex = (index + 1) % merger.source.length;
    return merger.movingGoods;
    }
  }
  return merger.movingGoods;
}


export function calculatePendingSplitterMovingGoods(
  splitter: EntitySplitterType,
  all: Map<string, EntityType>,
) {
  const dt = 1.0
  splitter.movingGoods = [];
  splitter.cooldown = Math.max(0, splitter.cooldown - dt);
  if (splitter.cooldown > 0) {
    return splitter.movingGoods;
  }
  
  const source = all.get(splitter.source!);
  if (source && splitter.goods.length < splitter.max && source.goods.length > 0) {
    if (source.type === "transport" || (source.type === "splitter")){return splitter.movingGoods}
    const good = source.goods[0]
    if (!good){
      return splitter.movingGoods;
    }
    splitter.movingGoods.push({ source:source.id, target: splitter.id, size: good.size, time: good.time, goodType: good.goodType});
    splitter.cooldown += 1 / splitter.rate;
    return splitter.movingGoods;
  } 
  if (splitter.goods.length>0) {
    for (let step = 0; step < splitter.target.length; step++) {
      const index = (splitter.nextTargetIndex + step) % splitter.target.length;
      const targetId = splitter.target[index];
      const target = targetId ? all.get(targetId) : null;
      if (!target) continue;
      if (
        target.goods.length >= target.max ||
        (target.type === "stock" && target.closed) ||
        target.type === "merger" 
      ) {
        continue;
      }
      const good = splitter.goods[0]
      if(!good){
        return splitter.movingGoods
      }
      splitter.movingGoods.push({ source:splitter.id, target: target.id, size: good.size, time: good.time, goodType: good.goodType});
      splitter.nextTargetIndex = (index + 1) % splitter.target.length;
      splitter.cooldown += 1 / splitter.rate;
      return splitter.movingGoods;
    }
  }
  return splitter.movingGoods;
}

export function calculatePendingTransportMovingGoods(
  transport: EntityTransportType,
  all: Map<string, EntityType>,
) {
  const dt = 1.0;
  transport.movingGoods = [];

  transport.cooldown = Math.max(0, transport.cooldown - dt);
  if (transport.cooldown > 0) return transport.movingGoods;

  const source = all.get(transport.source!);
  const target = all.get(transport.target!);
  if (
    transport.goods.length > 0 &&
    target &&
    target.goods.length < target.max
  ) {
    if (
      (target.type === "stock" && target.closed) ||
      target.type === "merger"
    ) {
      return transport.movingGoods;
    }
    const good = transport.goods[0];
    if (!good) {
      return transport.movingGoods;
    }

    transport.movingGoods.push({
      source: transport.id,
      target: target.id,
      size: good.size,
      time: good.time,
      goodType: good.goodType,
    });
    transport.cooldown += 1 / transport.rate;
    return transport.movingGoods;
  }
  //puxa
  if (transport.goods.length == 0 && source && source.goods.length > 0) {
    if (source.type === "transport" || source.type === "splitter"){
      return transport.movingGoods
    }
    let size = 1;
    const good = source.goods[0];
    if (!good) return transport.movingGoods;
    size = good.size;
    const time = good.time;
    const type = good.goodType;

    transport.movingGoods.push({
      source: source.id,
      target: transport.id,
      size,
      time,
      goodType: type,
    });

    transport.cooldown += 1 / transport.rate;
    return transport.movingGoods;
  }

  return transport.movingGoods;
}

export function transportMovingGoods(
  transport: EntityTransportType | EntitySplitterType | EntityMergerType,
  state: GameType,
) {
  transport.movingGoods.forEach((movingGood) => {
    if (!movingGood.source || !movingGood.target) return;
    const source = state.entities.get(movingGood.source);
    const target = state.entities.get(movingGood.target);

    if (!source || !target) return;
    if (!source.goods.length) return;
    if (target.goods.length >= target.max) return;

    const good = source.goods.shift();
    if (!good) return;
    good.source = source.id;
    good.target = target.id;
    target.goods.push(good);
  });
}

export function selectEntity(state: GameType, entityId: string | null) {
  const newState = structuredClone(state);
  newState.selected = entityId ? newState.entities.get(entityId) || null : null;
  return newState;
}


type GameActionTick = {
  type: "game tick";
};

type GameActionSelectEntity = {
  type: "select entity";
  entityId: string | null;
};

type GameActionSetStatus = {
  type: "set status";
  newStatus: GameStatus;
};

type GameActionPointing = {
  type: "pointing";
  x: number;
  y: number;
};

type GameActionChangeData = {
  type: "change game data";
  data: GameType;
}
export type GameAction =
  | GameActionCreateSource
  | GameActionDeleteSource
  | GameActionChangeSourceLeavingDirection
  | GameActionCreateStock
  | GameActionDeleteStock
  | GameActionChangeSourceGoodType
  | GameActionChangeStockDirection
  | GameActionCreateConsumer
  | GameActionDeleteConsumer
  | GameActionChangeConsumerEntryDirection
  | GameActionCreateTransport
  | GameActionDeleteTransport
  | GameActionChangeTransportEntryDirection
  | GameActionChangeTransportLeavingDirection
  | GameActionCreateSplitter
  | GameActionDeleteSplitter
  | GameActionChangeSplitterEntryDirection
  | GameActionCreateMerger
  | GameActionDeleteMerger
  | GameActionChangeMergerLeavingDirection
  | GameActionTick
  | GameActionSelectEntity
  | GameActionSetStatus
  | GameActionPointing
  | GameActionChangeData
  | GameActionEditorChangeMax
  | GameActionEditorChangeRate
  | GameActionEditorChangeDirection
  | GameActionEditorChangeEntryDirection
  | GameActionEditorChangeLeavingDirection
  | GameActionEditorChangeVal
  | GameActionEditorChangeGoodType;

export function pointingAction(
  state: GameType,
  action: GameActionPointing,
): GameType {
  const { x, y } = action;
  const newState = structuredClone(state);
  const entity = Array.from(state.entities.values()).find(
    (e) => e.x === x && e.y === y,
  );
  switch (state.status) {
    case "stock": {
      if (entity || !state.editor || state.editor.type !== "stock")
        return state;
      const action: GameActionCreateStock = {
        type: "create stock",
        max: state.editor.max,
        val: state.editor.val,
        x: x,
        y: y,
        direction: state.editor.direction,
      };
      newState.status = "waiting";
      newState.editor = null;
      return gameReducer(newState, action);
    }
    case "source": {
      if (entity || !state.editor || state.editor.type !== "source")
        return state;
      const action: GameActionCreateSource = {
        type: "create source",
        max: state.editor.max,
        x: x,
        y: y,
        leavingDirection: state.editor.leavingDirection,
        goodType: state.editor.goodType,
      };
      newState.status = "waiting";
      newState.editor = null;
      return gameReducer(newState, action);
    }
    case "consumer": {
      if (entity || !state.editor || state.editor.type !== "consumer")
        return state;
      const action: GameActionCreateConsumer = {
        type: "create consumer",
        max: state.editor.max,
        rate: state.editor.rate,
        x: x,
        y: y,
        entryDirection: state.editor.entryDirection,
      };
      newState.status = "waiting";
      newState.editor = null;
      return gameReducer(newState, action);
    }
    case "transport": {
      if (entity || !state.editor || state.editor.type !== "transporter")
        return state;
      const action: GameActionCreateTransport = {
        type: "create transport",
        max: state.editor.max,
        rate: state.editor.rate,
        x: x,
        y: y,
        entryDirection: state.editor.entryDirection,
        leavingDirection: state.editor.leavingDirection,
      };
      newState.status = "waiting";
      newState.editor = null;
      return gameReducer(newState, action);
    }
    case "splitter": {
      if (entity || !state.editor || state.editor.type !== "splitter")
        return state;
      const action: GameActionCreateSplitter = {
        type: "create splitter",
        max: state.editor.max,
        rate: state.editor.rate,
        x: x,
        y: y,
        entryDirection: state.editor.entryDirection,
      };
      newState.status = "waiting";
      newState.editor = null;
      return gameReducer(newState, action);
    }
    case "merger": {
      if (entity || !state.editor || state.editor.type !== "merger")
        return state;
      const action: GameActionCreateMerger = {
        type: "create merger",
        max: state.editor.max,
        rate: state.editor.rate,
        x: x,
        y: y,
        leavingDirection: state.editor.leavingDirection,
      };
      newState.status = "waiting";
      newState.editor = null;
      return gameReducer(newState, action);
    }
    case "delete": {
      if (!entity) return state;
      switch (entity.type) {
        case "source": {
          const deleteSourceAction: GameActionDeleteSource = {
            type: "delete source",
            id: entity.id,
          };
          newState.status = "waiting";
          newState.editor = null;
          return gameReducer(newState, deleteSourceAction);
        }
        case "stock": {
          const deleteStockAction: GameActionDeleteStock = {
            type: "delete stock",
            id: entity.id,
          };
          newState.status = "waiting";
          newState.editor = null;
          return gameReducer(newState, deleteStockAction);
        }
        case "consumer": {
          const deleteConsumerAction: GameActionDeleteConsumer = {
            type: "delete consumer",
            id: entity.id,
          };
          newState.status = "waiting";
          newState.editor = null;
          return gameReducer(newState, deleteConsumerAction);
        }
        case "transport": {
          const deleteTransportAction: GameActionDeleteTransport = {
            type: "delete transport",
            id: entity.id,
          };
          newState.status = "waiting";
          newState.editor = null;
          return gameReducer(newState, deleteTransportAction);
        }
        case "splitter": {
          const deleteSplitterAction: GameActionDeleteSplitter = {
            type: "delete splitter",
            id: entity.id,
          };
          newState.status = "waiting";
          newState.editor = null;
          return gameReducer(newState, deleteSplitterAction);
        }
        case "merger": {
          const deleteMergerAction: GameActionDeleteMerger = {
            type: "delete merger",
            id: entity.id,
          };
          newState.status = "waiting";
          newState.editor = null;
          return gameReducer(newState, deleteMergerAction);
        }
        default:
          return state;
      }
    }

    default:
      return state;
  }
  return state;
}

function chooseNewEditor(status: GameStatus): GameEditor {
  switch (status) {
    case "consumer": {
      const newEditor: GameConsumerEditor = {
        type: "consumer",
        max: 1,
        rate: 1,
        entryDirection: "right",
      };
      return newEditor;
    }
    case "stock": {
      const newEditor: GameStockEditor = {
        type: "stock",
        max: 1,
        val: 1,
        direction: "right",
      };
      return newEditor;
    }
    case "source": {
      const newEditor: GameSourceEditor = {
        type: "source",
        max: 1,
        rate: 1,
        leavingDirection: "right",
        goodType: "red",
      };
      return newEditor;
    }
    case "transport": {
      const newEditor: GameTransporterEditor = {
        type: "transporter",
        max: 1,
        rate: 1,
        entryDirection: "left",
        leavingDirection: "right",
      };
      return newEditor;
    }
    case "splitter": {
      const newEditor: GameSplitterEditor = {
        type: "splitter",
        max: 1,
        rate: 1,
        entryDirection: "left",
      };
      return newEditor;
    }
    case "merger": {
      const newEditor: GameMergerEditor = {
        type: "merger",
        max: 1,
        rate: 1,
        leavingDirection: "left",
      };
      return newEditor;
    }
    default: {
      return null;
    }
  }
}
