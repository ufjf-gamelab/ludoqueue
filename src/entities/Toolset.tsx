import type { EntityType } from "./EntitiesTypes";
import type { AnchorStyle } from "./Tile";
import { RotationIcons, DirectionIcons } from "./Icons";
import "./Toolset.css";
import { useGame } from "../Provider";
import { recipe1, recipe2 } from "./Exchanger/recipes";

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
      onPointerDown={(event) => event.stopPropagation()}
      onPointerUp={(event) => event.stopPropagation()}
    >
      {entity.type !== "exchanger" && (
        <div>
          <div className="ToolsetTitle">{entity.id}</div>
          <progress
            value={entity.goods.length}
            max={entity.max}
            style={{ width: "100%" }}
          />
          <div className="ToolsetSubtitle">
            {entity.goods.length} / {entity.max}
          </div>
        </div>
      )}

      {entity.type === "stock" || entity.type === "exchanger" ? (
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
          <p style={{ margin: 0, fontSize: "12px" }}>
            Change Leaving Direction
          </p>
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
      {entity.type === "source" && (
        <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
          <p style={{ margin: 0, fontSize: "12px" }}>Change Good Type</p>
          <button
            onClick={() => {
              dispatch({
                type: "change source good type",
                id: entity.id,
                goodType: "red",
              });
            }}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            <span className={"good red"} aria-hidden="true" />
          </button>
          <button
            onClick={() => {
              dispatch({
                type: "change source good type",
                id: entity.id,
                goodType: "blue",
              });
            }}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            <span className={"good blue"} aria-hidden="true" />
          </button>
          <button
            onClick={() => {
              dispatch({
                type: "change source good type",
                id: entity.id,
                goodType: "green",
              });
            }}
            style={{ padding: "4px 6px", fontSize: "12px" }}
          >
            <span className={"good green"} aria-hidden="true" />
          </button>
        </div>
      )}
      {(entity.type === "source" ||
        entity.type === "stock" ||
        entity.type === "consumer") && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginTop: "8px",
            flexWrap: "wrap",
          }}
        >
          <p style={{ margin: 0, fontSize: "12px" }}>Queue:</p>
          {Array.from(entity.goods).map((good, index) => (
            <span
              key={index}
              className={`good ${good.goodType}`}
              title={`Good Type: ${good.goodType}, Size: ${good.size}, Creation Time: ${good.time}`}
              aria-hidden="true"
            />
          ))}
        </div>
      )}
      {entity.type === "exchanger" && (
        <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
          <p style={{ margin: 0, fontSize: "12px" }}>Change Direction</p>
          <button
            onClick={() => {
              switch (entity.direction) {
                case "up":
                  return dispatch({
                    type: "change exchanger direction",
                    id: entity.id,
                    direction: "left",
                  });
                case "left":
                  return dispatch({
                    type: "change exchanger direction",
                    id: entity.id,
                    direction: "down",
                  });
                case "down":
                  return dispatch({
                    type: "change exchanger direction",
                    id: entity.id,
                    direction: "right",
                  });
                case "right":
                  return dispatch({
                    type: "change exchanger direction",
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
                    type: "change exchanger direction",
                    id: entity.id,
                    direction: "right",
                  });
                case "right":
                  return dispatch({
                    type: "change exchanger direction",
                    id: entity.id,
                    direction: "down",
                  });
                case "down":
                  return dispatch({
                    type: "change exchanger direction",
                    id: entity.id,
                    direction: "left",
                  });
                case "left":
                  return dispatch({
                    type: "change exchanger direction",
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
        )
        }
        {entity.type === "exchanger" && (
          <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
            <div><p>Input:</p>
            <p>
              Red: {entity.recipe.input[0][1]}
              <button style={{ padding: "4px 8px", marginLeft: "4px" }} onClick={() => {dispatch({ type: "change recipe input", id: entity.id, goodType: "red", quantity: entity.recipe.input[0][1]+1 })}}>+</button>  
              <button style={{ padding: "4px 8px", marginLeft: "4px" }} onClick={() => {dispatch({ type: "change recipe input", id: entity.id, goodType: "red", quantity: entity.recipe.input[0][1]-1 })}}>-</button>  
            </p>
            <p>
              Blue: {entity.recipe.input[1][1]}
              <button style={{ padding: "4px 8px", marginLeft: "4px" }} onClick={() => {dispatch({ type: "change recipe input", id: entity.id, goodType: "blue", quantity: entity.recipe.input[1][1]+1 })}}>+</button>  
              <button style={{ padding: "4px 8px", marginLeft: "4px" }} onClick={() => {dispatch({ type: "change recipe input", id: entity.id, goodType: "blue", quantity: entity.recipe.input[1][1]-1 })}}>-</button>  
            </p>
            <p>
              Green: {entity.recipe.input[2][1]}
              <button style={{ padding: "4px 8px", marginLeft: "4px" }} onClick={() => {dispatch({ type: "change recipe input", id: entity.id, goodType: "green", quantity: entity.recipe.input[2][1]+1 })}}>+</button>  
              <button style={{ padding: "4px 8px", marginLeft: "4px" }} onClick={() => {dispatch({ type: "change recipe input", id: entity.id, goodType: "green", quantity: entity.recipe.input[2][1]-1 })}}>-</button>  
            </p>
            </div>
            
          </div>
        )}
        {entity.type === "exchanger" && (
          <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
            <div><p>Output:</p>
            <p>
              Red: {entity.recipe.output[0][1]}
              <button style={{ padding: "4px 8px", marginLeft: "4px" }} onClick={() => {dispatch({ type: "change recipe output", id: entity.id, goodType: "red", quantity: entity.recipe.output[0][1]+1 })}}>+</button>  
              <button style={{ padding: "4px 8px", marginLeft: "4px" }} onClick={() => {dispatch({ type: "change recipe output", id: entity.id, goodType: "red", quantity: entity.recipe.output[0][1]-1 })}}>-</button>  
            </p>
            <p>
              Blue: {entity.recipe.output[1][1]}
              <button style={{ padding: "4px 8px", marginLeft: "4px" }} onClick={() => {dispatch({ type: "change recipe output", id: entity.id, goodType: "blue", quantity: entity.recipe.output[1][1]+1 })}}>+</button>  
              <button style={{ padding: "4px 8px", marginLeft: "4px" }} onClick={() => {dispatch({ type: "change recipe output", id: entity.id, goodType: "blue", quantity: entity.recipe.output[1][1]-1 })}}>-</button>  
            </p>
            <p>
              Green: {entity.recipe.output[2][1]}
              <button style={{ padding: "4px 8px", marginLeft: "4px" }} onClick={() => {dispatch({ type: "change recipe output", id: entity.id, goodType: "green", quantity: entity.recipe.output[2][1]+1 })}}>+</button>  
              <button style={{ padding: "4px 8px", marginLeft: "4px" }} onClick={() => {dispatch({ type: "change recipe output", id: entity.id, goodType: "green", quantity: entity.recipe.output[2][1]-1 })}}>-</button>  
            </p>
            </div>
            
          </div>
        )}
        {entity.type === "exchanger" && (
          <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
            <div>Select ready-made recipe:
              <select
              onPointerDownCapture={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
                onChange={(e) => { switch(e.target.value) {
                  case "recipe1":
                    dispatch({ type: "change entire recipe", id: entity.id, recipe:recipe1 });
                    break;
                  case "recipe2":
                    dispatch({ type: "change entire recipe", id: entity.id, recipe:recipe2 });
                    break;
                }
                }}>
                <option value="recipe1">Recipe 1</option>
                <option value="recipe2">Recipe 2</option> 
                </select>
            </div>
          </div>
        )}
      </div>
    );
  }
