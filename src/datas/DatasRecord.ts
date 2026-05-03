import type { GameType } from "../GameTypes";
import { exchangerConsumerData } from "./exchangerConsumer";
import { initialState } from "./initialState";
import { mergerComplexoData } from "./mergerComplexo";
import { mergerSimplesData } from "./mergerSimples";
import { splitterComplexoData } from "./splitterComplexo";
import { splitterSimplesData } from "./splitterSimples";

export const GameDatas: Record<string, GameType> = {
  "initial state": initialState,
  "splitter simples": splitterSimplesData,
  "splitter complexo": splitterComplexoData,
  "merger simples": mergerSimplesData,
  "merger complexo": mergerComplexoData,
  "exchanger consumer": exchangerConsumerData,
};
