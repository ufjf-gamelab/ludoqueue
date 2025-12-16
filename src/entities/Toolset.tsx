import type { EntityType } from "./EntitiesTypes";
import type { AnchorStyle } from "./Tile";
import { RotationIcons, TransportIcons } from "./Icons";
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
          Direction: {TransportIcons[entity.direction]}
          {TransportIcons[entity.direction]}
          {TransportIcons[entity.direction]}
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
          <p style={{ margin: 0, fontSize: "12px" }}>Change Leaving Direction</p>
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
    </div>
  );
}
