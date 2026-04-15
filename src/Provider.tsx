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
  EntityTransportType,
  EntityType,
  DirectionType,
  EntitySplitterType,
  EntityMergerType,
  MovingGoodType,
  GoodType,
  EntityExchangerType,
} from "./entities/EntitiesTypes";
import { initialState } from "./datas/initialState";
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
  GameExchangerEditor,
  GameRecipeEditor,
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
  GameActionEditorChangeRecipe,
  GameActionEditorChangeRecipeInput,
  GameActionEditorChangeRecipeOutput,
  GameActionEditorChangeVal,
} from "./Editor/EditorActions";
import {
  changeExchangerDirection,
  changeRecipeEntirely,
  changeRecipeInput,
  changeRecipeOutput,
  createExchanger,
  deleteExchanger,
  type GameActionChangeExchangerDirection,
  type GameActionChangeRecipe,
  type GameActionChangeRecipeInput,
  type GameActionChangeRecipeOutput,
  type GameActionCreateExchanger,
  type GameActionDeleteExchanger,
} from "./entities/Exchanger/ExchangerActions";
import { GameDatas } from "./datas/DatasRecord";
import { recipe1 } from "./entities/Exchanger/recipes";
type GameProviderProps = {
  children: ReactNode;
};
const GameContext = createContext<{
  game: GameType;
  dispatch: Dispatch<GameAction>;
} | null>(null);
export default function GameProvider({ children }: GameProviderProps) {
  const [game, dispatch] = useReducer(gameReducer, getInitialState());
  return <GameContext value={{ game, dispatch }}>{children}</GameContext>;
}
export function useGame() {
  return useContext(GameContext);
}

function getInitialState(): GameType {
  //carrega jogo inicial da memoria se achar
  const data = localStorage.getItem("game");
  if (data) {
    const parsed = JSON.parse(data);
    const entityMap: Map<string, EntityType> = new Map(parsed.entities);
    for (const [, entity] of parsed.entities) {
      //garante que a key tenha o id certo
      const newKey = entity.id;
      entityMap.set(newKey, entity);
    }
    return {
      ...parsed,
      entities: entityMap,
    };
  }
  return initialState;
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
    case "create exchanger":
      return createExchanger(
        state,
        action.x,
        action.y,
        action.direction,
        action.input,
        action.output,
      );
    case "delete exchanger":
      return deleteExchanger(state, action.id);
    case "change exchanger direction":
      return changeExchangerDirection(state, action.id, action.direction);
    case "change recipe input":
      return changeRecipeInput(
        state,
        action.id,
        action.goodType,
        action.quantity,
      );
    case "change recipe output":
      return changeRecipeOutput(
        state,
        action.id,
        action.goodType,
        action.quantity,
      );
    case "change entire recipe":
      return changeRecipeEntirely(state, action.id, action.recipe);
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
    case "change game data": {
      return action.data;
    }
    case "reset game": {
      const selectedData = GameDatas[state.data];
      console.log(state.data);
      if (!selectedData) {
        return state;
      }
      return gameReducer(state, {
        type: "change game data",
        data: selectedData,
      });
    }

    case "editor change max": {
      if (!state.editor || state.editor.type === "exchanger") return state;
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
      if (
        !state.editor ||
        (state.editor.type !== "stock" && state.editor.type !== "exchanger")
      )
        return state;
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
    case "editor change recipe input": {
      if (!state.editor || state.editor.type !== "recipe") return state;
      const editor = state.editor as GameRecipeEditor;
      const newInput = editor.input;
      for (const i in editor.input) {
        if (editor.input[i][0] === action.entry[0]) {
          if (action.entry[1] <= 0) {
            newInput[i][1] = 0;
          } else {
            newInput[i][1] = action.entry[1];
          }
        }
      }
      return {
        ...state,
        editor: { ...editor, input: newInput },
      };
    }
    case "editor change recipe output": {
      if (!state.editor || state.editor.type !== "exchanger") return state;
      const editor = state.editor as GameExchangerEditor;
      const newOutput = editor.output;
      for (const i in editor.output) {
        if (editor.output[i][0] === action.entry[0]) {
          if (action.entry[1] <= 0) {
            newOutput[i][1] = 0;
          } else {
            newOutput[i][1] = action.entry[1];
          }
        }
      }
      return {
        ...state,
        editor: { ...editor, output: newOutput },
      };
    }
    case "editor change recipe": {
      if (!state.editor || state.editor.type !== "exchanger") return state;
      const editor = state.editor as GameExchangerEditor;
      return {
        ...state,
        editor: {
          ...editor,
          input: action.recipe.input,
          output: action.recipe.output,
          baseRecipe: action.name,
        },
      };
    }
    default:
      break;
  }
  return state;
}

export function findEntity(id: string, state: GameType): EntityType | null {
  const entity = state.entities.get(id);
  return entity ? entity : null;
}

export function gameTick(state: GameType) {
  const newState = structuredClone(state);
  newState.time += 1;
  newState.transports.forEach((transport) => {
    const transportEntity = findEntity(
      transport,
      newState,
    ) as EntityTransportType;
    calculatePendingTransportMovingGoods(transportEntity, newState.entities);
  });
  newState.splitters.forEach((splitter) => {
    const splitterEntity = findEntity(splitter, newState) as EntitySplitterType;
    calculatePendingSplitterMovingGoods(splitterEntity, newState.entities);
  });
  newState.mergers.forEach((merger) => {
    const mergerEntity = findEntity(merger, newState) as EntityMergerType;
    calculatePendingMergerMovingGoods(mergerEntity, newState.entities);
  });
  newState.exchangers.forEach((exchanger) => {
    const exchangerEntity = findEntity(
      exchanger,
      newState,
    ) as EntityExchangerType;
    calculatePendingExchangerMovingGoods(exchangerEntity, newState);
  });
  newState.transports.forEach((transport) => {
    const transportEntity = findEntity(
      transport,
      newState,
    ) as EntityTransportType;
    transportMovingGoods(transportEntity, newState);
  });
  newState.splitters.forEach((splitter) => {
    const splitterEntity = findEntity(splitter, newState) as EntitySplitterType;
    transportMovingGoods(splitterEntity, newState);
  });
  newState.mergers.forEach((merger) => {
    const mergerEntity = findEntity(merger, newState) as EntityMergerType;
    transportMovingGoods(mergerEntity, newState);
  });
  newState.exchangers.forEach((exchanger) => {
    const exchangerEntity = findEntity(
      exchanger,
      newState,
    ) as EntityExchangerType;
    transportExchangerMovingGoods(exchangerEntity, newState);
  });
  newState.consumers.forEach((consumer) => {
    const consumerEntity = findEntity(consumer, newState) as EntityConsumerType;
    gameConsumerTick(consumerEntity);
  });
  newState.sources.forEach((source) => {
    const sourceEntity = findEntity(source, newState) as EntitySourceType;
    gameSourceTick(newState, sourceEntity);
  });

  return newState;
}

function countCooldown(entity: EntityType) {
  if (entity.type === "stock" || entity.type === "exchanger") {
    return;
  }
  const dt = 1.0;
  entity.cooldown = Math.max(0, entity.cooldown - dt);
}

function canIPull(source: EntityType, entity: EntityType): boolean {
  if (entity.type === "exchanger") {
    return false;
  }
  if (
    entity.type !== "merger" &&
    (source.type === "transport" || source.type === "splitter")
  ) {
    //nao puxar dos que ja fazem entrega
    return false;
  }

  if (source.type === "exchanger" && source.outputGoods.length > 0 && entity.goods.length < entity.max) {
    return true;
  }

  if (source.type !=="exchanger" && source.goods.length > 0 && entity.goods.length < entity.max) {
    return true;
  }

  return false;
}

function pullMovingGood(
  source: EntityType,
  entity: EntityTransportType | EntityMergerType | EntitySplitterType,
) {
  let good: MovingGoodType;
  if (source.type === "exchanger") {
    good = source.outputGoods[0];
  }
  else{
    good = source.goods[0];
  }
  if (!good) {
    return;
  }
  entity.movingGoods.push({
    source: source.id,
    target: entity.id,
    size: good.size,
    time: good.time,
    goodType: good.goodType,
  });
}

function canIPush(entity: EntityType, target: EntityType): boolean {
  if (
    entity.type === "exchanger" ||
    target.type === "merger" ||
    (target.type == "stock" && target.closed)
  ) {
    return false;
  }

  if (
    target.type !== "exchanger" &&
    target.goods.length < target.max &&
    entity.goods.length > 0
  ) {
    return true;
  }

  if (target.type === "exchanger" && entity.goods.length > 0) {
    const good = entity.goods[0];
    for (const [requiredGoodType, requiredAmount] of target.recipe.input) {
      if (
        good.goodType === requiredGoodType &&
        target.inputGoods.filter((g) => g.goodType === requiredGoodType)
          .length < requiredAmount
      ) {
        return true;
      }
    }
  }

  return false;
}

function pushMovingGood(
  entity: EntityTransportType | EntityMergerType | EntitySplitterType,
  target: EntityType,
) {
  const good = entity.goods[0];
  if (!good) {
    return;
  }
  entity.movingGoods.push({
    source: entity.id,
    target: target.id,
    size: good.size,
    time: good.time,
    goodType: good.goodType,
  });
}

export function gameSourceTick(state: GameType, node: EntitySourceType) {
  countCooldown(node);
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
  countCooldown(node);
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
  countCooldown(merger);
  if (merger.cooldown > 0) {
    return merger.movingGoods;
  }

  const target = all.get(merger.target!);
  if (target && canIPush(merger, target)) {
    pushMovingGood(merger, target);
  }
  if (merger.goods.length === 0) {
    for (let step = 0; step < merger.sources.length; step++) {
      const index = (merger.nextSourceIndex + step) % merger.sources.length;
      const sourceId = merger.sources[index];
      const source = sourceId ? all.get(sourceId) : null;
      if (!source || (source && !canIPull(source, merger))) {
        continue;
      }
      pullMovingGood(source, merger);
      merger.nextSourceIndex = (index + 1) % merger.sources.length;
      return merger.movingGoods;
    }
  }
  return merger.movingGoods;
}

export function calculatePendingSplitterMovingGoods(
  splitter: EntitySplitterType,
  all: Map<string, EntityType>,
) {
  splitter.movingGoods = [];
  countCooldown(splitter);
  if (splitter.cooldown > 0) {
    return splitter.movingGoods;
  }

  const source = all.get(splitter.source!);
  if (source && canIPull(source, splitter)) {
    pullMovingGood(source, splitter);
    return splitter.movingGoods;
  }
  if (splitter.goods.length > 0) {
    for (let step = 0; step < splitter.targets.length; step++) {
      const index = (splitter.nextTargetIndex + step) % splitter.targets.length;
      const targetId = splitter.targets[index];
      const target = targetId ? all.get(targetId) : null;
      if (!target || (target && !canIPush(splitter, target))) {
        continue;
      }
      pushMovingGood(splitter, target);
      splitter.nextTargetIndex = (index + 1) % splitter.targets.length;
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
  countCooldown(transport);
  if (transport.cooldown > 0) return transport.movingGoods;

  const source = all.get(transport.source!);
  const target = all.get(transport.target!);
  if (target && canIPush(transport, target)) {
    pushMovingGood(transport, target);
    return transport.movingGoods;
  }
  //puxa
  if (source && canIPull(source, transport)) {
    pullMovingGood(source, transport);
    return transport.movingGoods;
  }

  return transport.movingGoods;
}

function canIProcess(
  exchanger: EntityExchangerType,
): boolean {
  for (const [requiredGoodType, requiredAmount] of exchanger.recipe.input) {
    //verifica se pra cada item do input tem a quantidade requerida
    const avaiableAmount = exchanger.inputGoods.filter(
      (good) => good.goodType === requiredGoodType,
    ).length;
    if (avaiableAmount < requiredAmount) {
      return false;
    }
  }
  
  return true;
}

function processExchangeItems(
  exchanger: EntityExchangerType,
  time: number,
) {
  for (const [resultGoodType] of exchanger.recipe.output) {
    const movingGood: MovingGoodType = {
      source: exchanger.id,
      target: exchanger.id,
      size: 1,
      time,
      goodType: resultGoodType,
    };
    exchanger.movingGoods.push(movingGood);
  }
}

function transportExchangerMovingGoods(
  exchanger: EntityExchangerType,
  state: GameType,
) {
  if (exchanger.movingGoods.length > 0) {
    exchanger.recipe.input.forEach(([requiredGoodType, requiredAmount]) => {
      let itemsLeftToRemove = requiredAmount;

      exchanger.inputGoods = exchanger.inputGoods.filter((good) => {
        if (good.goodType === requiredGoodType && itemsLeftToRemove > 0) {
          itemsLeftToRemove--;
          return false; // Remove do array
        }
        return true; // Mantém no array
      });
    });
    exchanger.recipe.output.forEach(([producedGoodType, producedAmount]) => {
      for (let i = 0; i < producedAmount; i++) {
        const newGood = {
          source: null,
          target: null,
          size: 1,
          time: state.time,
          goodType: producedGoodType,
        };
        exchanger.outputGoods.push(newGood);
      }
    });
  }
}

function calculatePendingExchangerMovingGoods(
  exchanger: EntityExchangerType,
  state: GameType,
) {
  exchanger.movingGoods = [];
  if (canIProcess(exchanger)) {
    processExchangeItems(exchanger, state.time);
  }
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

    if (target.type === "exchanger") {
      //exchanger tem inputGoods entao precisa ser diferente
      if (source.type === "exchanger") {
        //nao acontece de ser os dois, tive que fazer pra nao dar erro
        return;
      }
      const good = source.goods.shift();
      if (!good) return;
      good.source = source.id;
      good.target = target.id;
      target.inputGoods.push(good);
      transport.cooldown += 1 / transport.rate;
      return;
    } else if (source.type === "exchanger") {
      //exchanger tem outputGoods entao precisa ser diferente
      const good = source.outputGoods.shift();
      if (!good) return;
      good.source = source.id;
      good.target = target.id;
      target.goods.push(good);
      transport.cooldown += 1 / transport.rate;
      return;
    } else {
      if (!source.goods.length) return;
      if (target.goods.length >= target.max) return;

      const good = source.goods.shift();
      if (!good) return;
      good.source = source.id;
      good.target = target.id;
      target.goods.push(good);
      transport.cooldown += 1 / transport.rate;
    }
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
};

type GameActionResetGame = {
  type: "reset game";
};

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
  | GameActionCreateExchanger
  | GameActionDeleteExchanger
  | GameActionChangeExchangerDirection
  | GameActionChangeRecipeInput
  | GameActionChangeRecipeOutput
  | GameActionChangeRecipe
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
  | GameActionEditorChangeGoodType
  | GameActionEditorChangeRecipeInput
  | GameActionEditorChangeRecipeOutput
  | GameActionEditorChangeRecipe
  | GameActionResetGame;

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
    case "exchanger": {
      if (entity || !state.editor || state.editor.type !== "exchanger")
        return state;
      const action: GameActionCreateExchanger = {
        type: "create exchanger",
        x: x,
        y: y,
        input: state.editor.input,
        output: state.editor.output,
        direction: state.editor.direction,
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
        case "exchanger": {
          const deleteExchangerAction: GameActionDeleteExchanger = {
            type: "delete exchanger",
            id: entity.id,
          };
          newState.status = "waiting";
          newState.editor = null;
          return gameReducer(newState, deleteExchangerAction);
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
    case "exchanger": {
      const newEditor: GameExchangerEditor = {
        type: "exchanger",
        baseRecipe: "recipe1",
        direction: "right",
      };
      return newEditor;
    }
    case "recipe": {
      const newEditor: GameRecipeEditor ={
        type: "recipe",
        input: [["red",0],["blue",0],["green",0]],
        output: [["red",0],["blue",0],["green",0]],
      }
      return newEditor;
    }
    default: {
      return null;
    }
  }
}
