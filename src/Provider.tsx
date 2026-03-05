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
} from "./entities/EntitiesTypes";
import { initialState } from "./data";
import {
  changeSourceLeavingDirection,
  createSource,
  deleteSource,
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
import { changeMergerLeavingDirection, createMerger, deleteMerger, type GameActionChangeMergerLeavingDirection, type GameActionCreateMerger, type GameActionDeleteMerger } from "./entities/Merger/MergerActions";
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
      );
    case "delete source":
      return deleteSource(state, action.id);
    case "change source leaving direction":
      return changeSourceLeavingDirection(state, action.id, action.direction);
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
    case "set node value":
      return setNodeVal(state, action.id, action.value);
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
    case "editor change max": {
      if (!state.editor) return state;
      return { ...state, editor: { ...state.editor, max: action.value } };
    }
    case "editor change rate": {
      if (
        !state.editor ||
        (state.editor.type !== "consumer" &&
          state.editor.type !== "source" &&
          state.editor.type !== "transporter" &&
          state.editor.type !== "splitter")
      )
        return state;

      return {
        ...state,
        editor: {
          ...state.editor,
          rate: action.value,
        },
      };
    }
    case "editor change direction": {
      if (!state.editor || state.editor.type !== "stock") return state;
      return {
        ...state,
        editor: { ...state.editor, direction: action.value as DirectionType },
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
        editor: { ...editor, entryDirection: action.value as DirectionType },
      };
    }
    case "editor change leaving direction": {
      if (
        !state.editor ||
        (state.editor.type !== "source" && state.editor.type !== "transporter")
      )
        return state;
      return {
        ...state,
        editor: {
          ...state.editor,
          leavingDirection: action.value as DirectionType,
        },
      };
    }
    case "editor change val": {
      if (!state.editor || state.editor.type !== "stock") return state;
      return { ...state, editor: { ...state.editor, val: action.value } };
    }

    default:
      break;
  }
  return state;
}

function setNodeVal(state: GameType, nodeID: string, value: number) {
  const newState = structuredClone(state);
  const node = newState.entities.get(nodeID);
  if (!node) {
    return state;
  }
  node.val = value;
  return newState;
}

export function gameTick(state: GameType) {
  const sources = new Map<string, EntitySourceType>();
  const consumers = new Map<string, EntityConsumerType>();
  const transports = new Map<string, EntityTransportType>();
  const stocks = new Map<string, EntityStockType>();
  const splitters = new Map<string, EntitySplitterType>();

  const newState = structuredClone(state);
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
    }
  }
  const all = new Map<string, EntityType>([
    ...sources.entries(),
    ...consumers.entries(),
    ...transports.entries(),
    ...stocks.entries(),
    ...splitters.entries(),
  ]);

  transports.forEach((transport) => {
    calculatePendingTransportMovingGoods(transport, all);
  });
  splitters.forEach((splitter) => {
    calculatePendingSplitterMovingGoods(splitter, all);
  });
  transports.forEach((transport) => {
    transportMovingGoods(transport);
  });
   splitters.forEach((splitter) => {
    transportMovingGoods(splitter);
  });
  consumers.forEach((consumer) => {
    gameConsumerTick(consumer);
  });
  sources.forEach((source) => {
    gameSourceTick(source);
  });
  
 
  return newState;
}

export function gameSourceTick(node: EntitySourceType) {
  node.cooldown -= 1;
  if (node.cooldown > 0) {
    return;
  }

  if (node.val < node.max) {
    node.val += node.rate;
  }
  node.cooldown += 1 / node.rate;
}

export function gameConsumerTick(node: EntityConsumerType) {
  node.cooldown -= 1;
  if (node.cooldown > 0) {
    return;
  }
  if (node.val > 0) {
    node.val--;
  }
  node.cooldown += 1 / node.rate;
}

export function calculatePendingSplitterMovingGoods(
  splitter: EntitySplitterType,
  all: Map<string, EntityType>,
) {
  splitter.movingGoods = [];
  splitter.cooldown -= 1;
  if (splitter.cooldown > 0) {
    return splitter.movingGoods;
  }
  splitter.cooldown += 1 / splitter.rate;

  const source = all.get(splitter.source!);
  if (source && splitter.val < splitter.max && source.val > 0) {
    if (source.type == "transport") {
      return splitter.movingGoods;
    }
    splitter.movingGoods.push({ source, target: splitter, val: 1 });
    return splitter.movingGoods;
  }
  else
  {
  for (let step = 0; step < splitter.target.length; step++) {
    const index = (splitter.nextTargetIndex + step) % splitter.target.length;
    const targetId = splitter.target[index];
    const target = targetId ? all.get(targetId) : null;
    if (!target) continue;
    if (
      target.val >= target.max ||
      (target.type === "stock" && target.closed)
    ) {
      continue;
    }
    if(splitter.val<1){
      continue;
    }
    splitter.movingGoods.push({ source: splitter, target, val: 1 });
    splitter.nextTargetIndex = (index + 1) % splitter.target.length;
    return splitter.movingGoods;
  }
}
  return splitter.movingGoods;
}

export function calculatePendingTransportMovingGoods(
  transport: EntityTransportType,
  all: Map<string, EntityType>,
) {
  transport.movingGoods = [];
  transport.cooldown -= 1;
  if (transport.cooldown > 0) {
    return transport.movingGoods;
  }
  transport.cooldown += 1 / transport.rate;

  const source = all.get(transport.source!);
  const target = all.get(transport.target!);
  if (target && transport.val === 1 && target.val < target.max) {
    if (target.type == "stock" && target.closed) {
      return transport.movingGoods;
    }
    transport.movingGoods.push({ source: transport, target, val: 1 });
  }
  if (source && transport.val === 0 && source.val > 0) {
    if (source.type == "splitter") {
      return transport.movingGoods;
    }
    transport.movingGoods.push({ source, target: transport, val: 1 });
  }
  return transport.movingGoods;
}

export function transportMovingGoods(
  transport: EntityTransportType | EntitySplitterType,
) {
  transport.movingGoods.forEach((movingGood) => {
    const source = movingGood.source;
    const target = movingGood.target;
    if (source && source.val > 0) {
      source.val -= movingGood.val;
    }
    if (target && target.val < target.max) {
      target.val += movingGood.val;
    }
  });
}

export function selectEntity(state: GameType, entityId: string | null) {
  const newState = structuredClone(state);
  newState.selected = entityId ? newState.entities.get(entityId) || null : null;
  return newState;
}

type GameActionSetNodeValue = {
  type: "set node value";
  id: string;
  value: number;
};

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

type GameActionEditorChangeMax = {
  type: "editor change max";
  value: number;
};

type GameActionEditorChangeRate = {
  type: "editor change rate";
  value: number;
};

type GameActionEditorChangeDirection = {
  type: "editor change direction";
  value: string;
};

type GameActionEditorChangeEntryDirection = {
  type: "editor change entry direction";
  value: string;
};

type GameActionEditorChangeLeavingDirection = {
  type: "editor change leaving direction";
  value: string;
};

type GameActionEditorChangeVal = {
  type: "editor change val";
  value: number;
};

export type GameAction =
  | GameActionCreateSource
  | GameActionDeleteSource
  | GameActionChangeSourceLeavingDirection
  | GameActionCreateStock
  | GameActionDeleteStock
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
  | GameActionSetNodeValue
  | GameActionTick
  | GameActionSelectEntity
  | GameActionSetStatus
  | GameActionPointing
  | GameActionEditorChangeMax
  | GameActionEditorChangeRate
  | GameActionEditorChangeDirection
  | GameActionEditorChangeEntryDirection
  | GameActionEditorChangeLeavingDirection
  | GameActionEditorChangeVal;

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
