import type { EntityType } from "./EntitiesTypes";
import type { AnchorStyle } from "./Tile";
import { RotationIcons, DirectionIcons } from "./Icons";
import "./Toolset.css";
import { useGame } from "../Provider";

export default function Toolset({ entity }: { entity: EntityType }) {
  const { dispatch } = useGame()!;

  return (
    <div
      key={entity.id}
      className="Toolset"
      style={
        {
          position: "absolute",
          positionAnchor: `${"--anchor-" + entity.id}`,
          positionArea: "end end",
          positionTry: "end start, start start, start end",
        } as AnchorStyle
      }
    >
      <div className="ToolsetTitle">{entity.id}</div>
      <progress value={entity.val} max={entity.max} style={{ width: "100%" }} />
      <div className="ToolsetSubtitle">
        {entity.val} / {entity.max}
      </div>

      {entity.type === "stock" ? (
        <div className="ToolsetWarning">Doesnt have cooldown</div>
      ) : (
        <>
          <progress value={entity.cooldown} style={{ width: "100%" }} />
          <div className="ToolsetSubtitle">
            Cooldown: {entity.cooldown} / Rate: {entity.rate}
          </div>
        </>
      )}

      {entity.type === "transport" && (
        <div className="CardSubtitle">
          Entry Direction: {DirectionIcons[entity.entryDirection]}
          {DirectionIcons[entity.entryDirection]}
          {DirectionIcons[entity.entryDirection]}
          Leaving Direction: {DirectionIcons[entity.leavingDirection]}
          {DirectionIcons[entity.leavingDirection]}
          {DirectionIcons[entity.leavingDirection]}
        </div>
      )}
      {entity.type === "stock" && (
        <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
          <p style={{ margin: 0, fontSize: "12px" }}>Change Direction</p>
          <button
            onClick={() => {
              switch (entity.direction) {
                case "up":
                  return dispatch({
                    type: "change stock direction",
                    id: entity.id,
                    direction: "left",
                  });
                case "left":
                  return dispatch({
                    type: "change stock direction",
                    id: entity.id,
                    direction: "down",
                  });
                case "down":
                  return dispatch({
                    type: "change stock direction",
                    id: entity.id,
                    direction: "right",
                  });
                case "right":
                  return dispatch({
                    type: "change stock direction",
                    id: entity.id,
                    direction: "up",
                  });
              }
            }}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            {RotationIcons["counterclockwise"]}
          </button>
          <button
            onClick={() => {
              switch (entity.direction) {
                case "up":
                  return dispatch({
                    type: "change stock direction",
                    id: entity.id,
                    direction: "right",
                  });
                case "right":
                  return dispatch({
                    type: "change stock direction",
                    id: entity.id,
                    direction: "down",
                  });
                case "down":
                  return dispatch({
                    type: "change stock direction",
                    id: entity.id,
                    direction: "left",
                  });
                case "left":
                  return dispatch({
                    type: "change stock direction",
                    id: entity.id,
                    direction: "up",
                  });
              }
            }}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            {RotationIcons["clockwise"]}
          </button>
        </div>
      )}
      {entity.type === "consumer" && (
        <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
          <p style={{ margin: 0, fontSize: "12px" }}>Change Entry Direction</p>
          <button
            onClick={() => {
              switch (entity.entryDirection) {
                case "up":
                  return dispatch({
                    type: "change consumer entry direction",
                    id: entity.id,
                    direction: "left",
                  });
                case "left":
                  return dispatch({
                    type: "change consumer entry direction",
                    id: entity.id,
                    direction: "down",
                  });
                case "down":
                  return dispatch({
                    type: "change consumer entry direction",
                    id: entity.id,
                    direction: "right",
                  });
                case "right":
                  return dispatch({
                    type: "change consumer entry direction",
                    id: entity.id,
                    direction: "up",
                  });
              }
            }}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            {RotationIcons["counterclockwise"]}
          </button>
          <button
            onClick={() => {
              switch (entity.entryDirection) {
                case "up":
                  return dispatch({
                    type: "change consumer entry direction",
                    id: entity.id,
                    direction: "right",
                  });
                case "right":
                  return dispatch({
                    type: "change consumer entry direction",
                    id: entity.id,
                    direction: "down",
                  });
                case "down":
                  return dispatch({
                    type: "change consumer entry direction",
                    id: entity.id,
                    direction: "left",
                  });
                case "left":
                  return dispatch({
                    type: "change consumer entry direction",
                    id: entity.id,
                    direction: "up",
                  });
              }
            }}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            {RotationIcons["clockwise"]}
          </button>
        </div>
      )}
      {entity.type === "source" && (
        <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
          <p style={{ margin: 0, fontSize: "12px" }}>
            Change Leaving Direction
          </p>
          <button
            onClick={() => {
              switch (entity.leavingDirection) {
                case "up":
                  return dispatch({
                    type: "change source leaving direction",
                    id: entity.id,
                    direction: "left",
                  });
                case "left":
                  return dispatch({
                    type: "change source leaving direction",
                    id: entity.id,
                    direction: "down",
                  });
                case "down":
                  return dispatch({
                    type: "change source leaving direction",
                    id: entity.id,
                    direction: "right",
                  });
                case "right":
                  return dispatch({
                    type: "change source leaving direction",
                    id: entity.id,
                    direction: "up",
                  });
              }
            }}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            {RotationIcons["counterclockwise"]}
          </button>
          <button
            onClick={() => {
              switch (entity.leavingDirection) {
                case "up":
                  return dispatch({
                    type: "change source leaving direction",
                    id: entity.id,
                    direction: "right",
                  });
                case "right":
                  return dispatch({
                    type: "change source leaving direction",
                    id: entity.id,
                    direction: "down",
                  });
                case "down":
                  return dispatch({
                    type: "change source leaving direction",
                    id: entity.id,
                    direction: "left",
                  });
                case "left":
                  return dispatch({
                    type: "change source leaving direction",
                    id: entity.id,
                    direction: "up",
                  });
              }
            }}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            {RotationIcons["clockwise"]}
          </button>
        </div>
      )}
      {entity.type === "transport" && (
        <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
          <p style={{ margin: 0, fontSize: "12px" }}>Change Entry Direction</p>
          <button
            onClick={() => {
              switch (entity.entryDirection) {
                case "up":
                  return dispatch({
                    type: "change transport entry direction",
                    id: entity.id,
                    direction: "left",
                  });
                case "left":
                  return dispatch({
                    type: "change transport entry direction",
                    id: entity.id,
                    direction: "down",
                  });
                case "down":
                  return dispatch({
                    type: "change transport entry direction",
                    id: entity.id,
                    direction: "right",
                  });
                case "right":
                  return dispatch({
                    type: "change transport entry direction",
                    id: entity.id,
                    direction: "up",
                  });
              }
            }}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            {RotationIcons["counterclockwise"]}
          </button>
          <button
            onClick={() => {
              switch (entity.entryDirection) {
                case "up":
                  return dispatch({
                    type: "change transport entry direction",
                    id: entity.id,
                    direction: "right",
                  });
                case "right":
                  return dispatch({
                    type: "change transport entry direction",
                    id: entity.id,
                    direction: "down",
                  });
                case "down":
                  return dispatch({
                    type: "change transport entry direction",
                    id: entity.id,
                    direction: "left",
                  });
                case "left":
                  return dispatch({
                    type: "change transport entry direction",
                    id: entity.id,
                    direction: "up",
                  });
              }
            }}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            {RotationIcons["clockwise"]}
          </button>
        </div>
      )}
      {entity.type === "transport" && (
        <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
          <p style={{ margin: 0, fontSize: "12px" }}>
            Change Leaving Direction
          </p>
          <button
            onClick={() => {
              switch (entity.leavingDirection) {
                case "up":
                  return dispatch({
                    type: "change transport leaving direction",
                    id: entity.id,
                    direction: "left",
                  });
                case "left":
                  return dispatch({
                    type: "change transport leaving direction",
                    id: entity.id,
                    direction: "down",
                  });
                case "down":
                  return dispatch({
                    type: "change transport leaving direction",
                    id: entity.id,
                    direction: "right",
                  });
                case "right":
                  return dispatch({
                    type: "change transport leaving direction",
                    id: entity.id,
                    direction: "up",
                  });
              }
            }}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            {RotationIcons["counterclockwise"]}
          </button>
          <button
            onClick={() => {
              switch (entity.leavingDirection) {
                case "up":
                  return dispatch({
                    type: "change transport leaving direction",
                    id: entity.id,
                    direction: "right",
                  });
                case "right":
                  return dispatch({
                    type: "change transport leaving direction",
                    id: entity.id,
                    direction: "down",
                  });
                case "down":
                  return dispatch({
                    type: "change transport leaving direction",
                    id: entity.id,
                    direction: "left",
                  });
                case "left":
                  return dispatch({
                    type: "change transport leaving direction",
                    id: entity.id,
                    direction: "up",
                  });
              }
            }}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            {RotationIcons["clockwise"]}
          </button>
        </div>
      )}
      {entity.type === "splitter" && (
        <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
          <p style={{ margin: 0, fontSize: "12px" }}>Change Entry Direction</p>
          <button
            onClick={() => {
              switch (entity.entryDirection) {
                case "up":
                  return dispatch({
                    type: "change splitter entry direction",
                    id: entity.id,
                    direction: "left",
                  });
                case "left":
                  return dispatch({
                    type: "change splitter entry direction",
                    id: entity.id,
                    direction: "down",
                  });
                case "down":
                  return dispatch({
                    type: "change splitter entry direction",
                    id: entity.id,
                    direction: "right",
                  });
                case "right":
                  return dispatch({
                    type: "change splitter entry direction",
                    id: entity.id,
                    direction: "up",
                  });
              }
            }}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            {RotationIcons["counterclockwise"]}
          </button>
          <button
            onClick={() => {
              switch (entity.entryDirection) {
                case "up":
                  return dispatch({
                    type: "change splitter entry direction",
                    id: entity.id,
                    direction: "right",
                  });
                case "right":
                  return dispatch({
                    type: "change splitter entry direction",
                    id: entity.id,
                    direction: "down",
                  });
                case "down":
                  return dispatch({
                    type: "change splitter entry direction",
                    id: entity.id,
                    direction: "left",
                  });
                case "left":
                  return dispatch({
                    type: "change splitter entry direction",
                    id: entity.id,
                    direction: "up",
                  });
              }
            }}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            {RotationIcons["clockwise"]}
          </button>
        </div>
      )}
      {entity.type === "merger" && (
        <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
          <p style={{ margin: 0, fontSize: "12px" }}>Change Leaving Direction</p>
          <button
            onClick={() => {
              switch (entity.leavingDirection) {
                case "up":
                  return dispatch({
                    type: "change merger leaving direction",
                    id: entity.id,
                    direction: "left",
                  });
                case "left":
                  return dispatch({
                    type: "change merger leaving direction",
                    id: entity.id,
                    direction: "down",
                  });
                case "down":
                  return dispatch({
                    type: "change merger leaving direction",
                    id: entity.id,
                    direction: "right",
                  });
                case "right":
                  return dispatch({
                    type: "change merger leaving direction",
                    id: entity.id,
                    direction: "up",
                  });
              }
            }}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            {RotationIcons["counterclockwise"]}
          </button>
          <button
            onClick={() => {
              switch (entity.leavingDirection) {
                case "up":
                  return dispatch({
                    type: "change merger leaving direction",
                    id: entity.id,
                    direction: "right",
                  });
                case "right":
                  return dispatch({
                    type: "change merger leaving direction",
                    id: entity.id,
                    direction: "down",
                  });
                case "down":
                  return dispatch({
                    type: "change merger leaving direction",
                    id: entity.id,
                    direction: "left",
                  });
                case "left":
                  return dispatch({
                    type: "change merger leaving direction",
                    id: entity.id,
                    direction: "up",
                  });
              }
            }}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            {RotationIcons["clockwise"]}
          </button>
        </div>
      )}
      {entity.type === "source" && (<div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
          <p style={{ margin: 0, fontSize: "12px" }}>Change Good Type</p>
          <button
            onClick={() => {dispatch({
              type: "change source good type",
              id: entity.id,
              goodType: "red",
            })}}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            <span
                      className={"good red"}
                    aria-hidden="true"
                  />
          </button>
          <button
            onClick={() => {dispatch({
              type: "change source good type",
              id: entity.id,
              goodType: "blue",
            })}}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            <span
                      className={"good blue"}
                    aria-hidden="true"
                  />
          </button>
          <button
            onClick={() => {dispatch({
              type: "change source good type",
              id: entity.id,
              goodType: "green",
            })}}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            <span
                      className={"good green"}
                    aria-hidden="true"
                  />
          </button>
        </div>)}
      {(entity.type ==="source" || entity.type === "stock" || entity.type === "consumer") && (
      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "8px", flexWrap: "wrap" }}>
          <p style={{ margin: 0, fontSize: "12px" }}>Queue:</p>
          {Array.from(entity.goods).map((good, index) => (
            <span
                      key={index}
                      className={`good ${good.goodType}`}
                      title={`Good Type: ${good.goodType}, Size: ${good.size}, Creation Time: ${good.time}`}
                    aria-hidden="true"
                  />
                  
                ))}</div>)}
                
    </div>
  );
}
