import Source from "./Source/SourceTile";
import type { GameType } from "../GameTypes";
import Stock from "./Stock/StockTile";
import ConsumerTile from "./Consumer/ConsumerTile";
import Transport from "./Transport/TransporterTile";
import "./EntitiesProgress.css";
import type {
  EntitySourceType,
  EntityStockType,
  EntityTransportType,
} from "./EntitiesTypes";

export default function EntitiesProgress({ game }: { game: GameType }) {
  return (
    <div className="EntitiesProgress">
      {game.sources.map((source) => {
        return (
          <Source
            key={game.entities.get(source)!.id}
            entity={game.entities.get(source) as EntitySourceType}
          />
        );
      })}
      {game.stocks.map((stock) => {
        return (
          <Stock
            key={game.entities.get(stock)!.id}
            entity={game.entities.get(stock) as EntityStockType}
          />
        );
      })}
      {game.consumers.map((consumers) => {
        return (
          <ConsumerTile
            key={game.entities.get(consumers)!.id}
          />
        );
      })}
      {game.transports.map((transports) => {
        return (
          <Transport
            key={game.entities.get(transports)!.id}
            entity={game.entities.get(transports) as EntityTransportType}
          />
        );
      })}
    </div>
  );
}
