import { FaTrashAlt } from "react-icons/fa";
import { EntityIcons } from "../entities/Icons";
import { useGame } from "../Provider";
import "./ToolBar.css";
import { TiCancel } from "react-icons/ti";
import type { GameStatus } from "../GameTypes";
import type {
  EntityConsumerType,
  EntityExchangerType,
  EntityMergerType,
  EntitySourceType,
  EntitySplitterType,
  EntityStockType,
  EntityTransportType,
} from "../entities/EntitiesTypes";
import { SourceSprite } from "../assets/source/SourceSprite";
import { ExchangerSprite } from "../assets/exchanger/ExchangerSprite";
import ConsumerSprite from "../assets/consumer/ConsumerSprite";
import StockSprite from "../assets/stock/StockSprite";
import { TransportSprite } from "../assets/transport/TransportSprite";
import SplitterSprite from "../assets/splitter/SplitterSprite";
import MergerSprite from "../assets/merger/MergerSprite";

export type ToolCategory = "factory" | "transport";

const categoryTools: Record<
  ToolCategory,
  { status: GameStatus; label: string }[]
> = {
  factory: [
    { status: "source", label: "Criar fonte" },
    { status: "exchanger", label: "Criar trocador" },
    { status: "recipe", label: "Criar receita" },
    { status: "consumer", label: "Criar consumidor" },
    { status: "stock", label: "Criar estoque" },
  ],
  transport: [
    { status: "transport", label: "Criar transporte" },
    { status: "splitter", label: "Criar divisor" },
    { status: "merger", label: "Criar mesclador" },
  ],
};

const previewEntities = {
  source: {
    id: "preview-source",
    name: "Source preview",
    type: "source",
    goodType: "red",
    max: 1,
    rate: 1,
    cooldown: 0,
    leavingDirection: "right",
    x: 0,
    y: 0,
    goods: [],
  } satisfies EntitySourceType,
  exchanger: {
    id: "preview-exchanger",
    name: "Exchanger preview",
    type: "exchanger",
    recipe: { name: "preview", input: [], output: [] },
    direction: "right",
    source: null,
    target: null,
    x: 0,
    y: 0,
    inputGoods: [],
    outputGoods: [],
    movingGoods: [],
  } satisfies EntityExchangerType,
  consumer: {
    id: "preview-consumer",
    name: "Consumer preview",
    type: "consumer",
    max: 1,
    rate: 1,
    cooldown: 0,
    goods: [],
    entryDirection: "left",
    x: 0,
    y: 0,
  } satisfies EntityConsumerType,
  stock: {
    id: "preview-stock",
    name: "Stock preview",
    type: "stock",
    max: 10,
    closed: false,
    goods: [],
    direction: "down",
    x: 0,
    y: 0,
  } satisfies EntityStockType,
  transport: {
    id: "preview-transport",
    name: "Transport preview",
    type: "transport",
    max: 1,
    rate: 1,
    cooldown: 0,
    source: null,
    target: null,
    x: 0,
    y: 0,
    entryDirection: "left",
    leavingDirection: "right",
    movingGoods: [],
    goods: [],
  } satisfies EntityTransportType,
  splitter: {
    id: "preview-splitter",
    name: "Splitter preview",
    type: "splitter",
    max: 1,
    rate: 1,
    cooldown: 0,
    entryDirection: "left",
    x: 0,
    y: 0,
    source: null,
    targets: [],
    nextTargetIndex: 0,
    movingGoods: [],
    goods: [],
  } satisfies EntitySplitterType,
  merger: {
    id: "preview-merger",
    name: "Merger preview",
    type: "merger",
    max: 1,
    rate: 1,
    cooldown: 0,
    leavingDirection: "right",
    x: 0,
    y: 0,
    target: null,
    sources: [],
    nextSourceIndex: 0,
    movingGoods: [],
    goods: [],
  } satisfies EntityMergerType,
};

function renderToolIcon(status: GameStatus) {
  switch (status) {
    case "source":
      return <SourceSprite entity={previewEntities.source} />;
    case "exchanger":
      return <ExchangerSprite entity={previewEntities.exchanger} />;
    case "consumer":
      return <ConsumerSprite />;
    case "stock":
      return <StockSprite entity={previewEntities.stock} />;
    case "transport":
      return <TransportSprite entity={previewEntities.transport} />;
    case "splitter":
      return <SplitterSprite entity={previewEntities.splitter} />;
    case "merger":
      return <MergerSprite entity={previewEntities.merger} />;
    case "recipe":
      return EntityIcons.recipe;
    default:
      return null;
  }
}

export default function ToolBar({ category }: { category: ToolCategory }) {
  const { game, dispatch } = useGame()!;

  return (
    <div className="tool-selector">
      <div className="tile-list">
        {categoryTools[category].map(({ status, label }) => (
          <button
            key={status}
            className={game.status === status ? "selected" : ""}
            onClick={() => dispatch({ type: "set status", newStatus: status })}
            title={label}
            aria-label={label}
          >
            <span className="tool-sprite-preview" data-status={status}>
              {renderToolIcon(status)}
            </span>
          </button>
        ))}
        <button
          className={
            game.status === "delete" ? "selected delete-tool" : "delete-tool"
          }
          onClick={() => dispatch({ type: "set status", newStatus: "delete" })}
          title="Ativar modo de exclusão"
          aria-label="Ativar modo de exclusão"
        >
          <FaTrashAlt size="20px" />
        </button>
        <button
          onClick={() => dispatch({ type: "set status", newStatus: "waiting" })}
          title="Sair do modo de criação"
          aria-label="Sair do modo de criação"
        >
          <TiCancel size="20px" />
        </button>
      </div>
    </div>
  );
}
