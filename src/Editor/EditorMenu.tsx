import { DirectionIcons, RotationIcons } from "../entities/Icons";
import "./EditorMenu.css";
import type { GameEditor } from "./EditorTypes";
import { useGame } from "../Provider";
import type { DirectionType } from "../entities/EntitiesTypes";

export default function EditorMenu({ editor }: { editor: GameEditor }) {
  const { dispatch } = useGame() || { dispatch: undefined };

  const rotateCounterClockwiseDirection = (
    direction: DirectionType,
  ): DirectionType => {
    switch (direction) {
      case "right":
        return "up" as DirectionType;
      case "up":
        return "left" as DirectionType;
      case "left":
        return "down" as DirectionType;
      case "down":
        return "right" as DirectionType;
      default:
        return direction;
    }
  };

  const rotateClockwiseDirection = (
    direction: DirectionType,
  ): DirectionType => {
    switch (direction) {
      case "right":
        return "down" as DirectionType;
      case "down":
        return "left" as DirectionType;
      case "left":
        return "up" as DirectionType;
      case "up":
        return "right" as DirectionType;
      default:
        return direction;
    }
  };

  if (!editor || !dispatch) {
    return <></>;
  }
  return (
    <div className={"EditorMenu"}>
      <p>Properties</p>
      {editor.type === "consumer" && (
        <div>
          <div className={"EditorProp"}>
            Max: {editor.max}
            <div>
              <button
                onClick={() =>
                  dispatch({ type: "editor change max", max: editor.max + 1 })
                }
              >
                {" "}
                +{" "}
              </button>
              <button
                onClick={() =>
                  dispatch({ type: "editor change max", max: editor.max - 1 })
                }
              >
                {" "}
                -{" "}
              </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Rate: {editor.rate}
            <div>
              <button
                onClick={() => {
                  if (editor.rate >= 1) {
                    dispatch({ type: "editor change rate", rate: 1 });
                    return;
                  } else {
                    dispatch({
                      type: "editor change rate",
                      rate: editor.rate + 0.1,
                    });
                  }
                }}
              >
                {" "}
                +{" "}
              </button>
              <button
                onClick={() => {
                  if (editor.rate <= 0) {
                    dispatch({ type: "editor change rate", rate: 0 });
                    return;
                  } else {
                    dispatch({
                      type: "editor change rate",
                      rate: editor.rate - 0.1,
                    });
                  }
                }}
              >
                {" "}
                -{" "}
              </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Entry Direction: {editor.entryDirection}
            <div>
              <button
                onClick={() => {
                  dispatch({
                    type: "editor change entry direction",
                    entryDirection: rotateCounterClockwiseDirection(
                      editor.entryDirection,
                    ),
                  });
                }}
              >
                {RotationIcons["counterclockwise"]}
              </button>
              <button
                onClick={() => {
                  dispatch({
                    type: "editor change entry direction",
                    entryDirection: rotateClockwiseDirection(
                      editor.entryDirection,
                    ),
                  });
                }}
              >
                {RotationIcons["clockwise"]}
              </button>
            </div>
          </div>
        </div>
      )}
      {editor.type === "stock" && (
        <div>
          <div className={"EditorProp"}>
            Max: {editor.max}
            <div>
              <button
                onClick={() =>
                  dispatch({ type: "editor change max", max: editor.max + 1 })
                }
              >
                {" "}
                +{" "}
              </button>
              <button
                onClick={() =>
                  dispatch({ type: "editor change max", max: editor.max - 1 })
                }
              >
                {" "}
                -{" "}
              </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Val: {editor.val}
            <div>
              <button
                onClick={() =>
                  dispatch({ type: "editor change val", value: editor.val + 1 })
                }
              >
                {" "}
                +{" "}
              </button>
              <button
                onClick={() =>
                  dispatch({ type: "editor change val", value: editor.val - 1 })
                }
              >
                {" "}
                -{" "}
              </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Direction: {DirectionIcons[editor.direction]}
            <div>
              <button
                onClick={() => {
                  dispatch({
                    type: "editor change direction",
                    direction: rotateCounterClockwiseDirection(
                      editor.direction,
                    ),
                  });
                }}
              >
                {RotationIcons["counterclockwise"]}
              </button>
              <button
                onClick={() => {
                  dispatch({
                    type: "editor change direction",
                    direction: rotateClockwiseDirection(
                      editor.direction,
                    ),
                  });
                }}
              >
                {RotationIcons["clockwise"]}
              </button>
            </div>
          </div>
        </div>
      )}
      {editor.type === "source" && (
        <div>
          <div className={"EditorProp"}>
            Max: {editor.max}
            <div>
              <button
                onClick={() =>
                  dispatch({ type: "editor change max", max: editor.max + 1 })
                }
              >
                {" "}
                +{" "}
              </button>
              <button
                onClick={() =>
                  dispatch({ type: "editor change max", max: editor.max - 1 })
                }
              >
                {" "}
                -{" "}
              </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Rate: {editor.rate}
            <div>
              <button
                onClick={() => {
                  if (editor.rate >= 1) {
                    dispatch({ type: "editor change rate", rate: 1 });
                    return;
                  } else {
                    dispatch({
                      type: "editor change rate",
                      rate: editor.rate + 0.1,
                    });
                  }
                }}
              >
                {" "}
                +{" "}
              </button>
              <button
                onClick={() => {
                  if (editor.rate <= 0) {
                    dispatch({ type: "editor change rate", rate: 0 });
                    return;
                  } else {
                    dispatch({
                      type: "editor change rate",
                      rate: editor.rate - 0.1,
                    });
                  }
                }}
              >
                {" "}
                -{" "}
              </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Direction: {DirectionIcons[editor.leavingDirection]}
            <div>
              <button
                onClick={() => {
                  dispatch({
                    type: "editor change leaving direction",
                    leavingDirection: rotateCounterClockwiseDirection(
                      editor.leavingDirection,
                    ),
                  });
                }}
              >
                {RotationIcons["counterclockwise"]}
              </button>
              <button
                onClick={() => {
                  dispatch({
                    type: "editor change leaving direction",
                    leavingDirection: rotateClockwiseDirection(
                      editor.leavingDirection,
                    ),
                  });
                }}
              >
                {RotationIcons["clockwise"]}
              </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Good Type:{" "}
            <span className={`good ${editor.goodType}`} aria-hidden="true" />
            <div>
              <button
                onClick={() => {
                  dispatch({
                    type: "editor change good type",
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
                    type: "editor change good type",
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
                    type: "editor change good type",
                    goodType: "green",
                  });
                }}
                style={{ padding: "4px 6px", fontSize: "12px" }}
              >
                <span className={"good green"} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
      {editor.type === "transporter" && (
        <div>
          <div className={"EditorProp"}>
            Max: {editor.max}
            <div>
              <button
                onClick={() =>
                  dispatch({ type: "editor change max", max: editor.max + 1 })
                }
              >
                {" "}
                +{" "}
              </button>
              <button
                onClick={() =>
                  dispatch({ type: "editor change max", max: editor.max - 1 })
                }
              >
                {" "}
                -{" "}
              </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Rate: {editor.rate}
            <div>
              <button
                onClick={() => {
                  if (editor.rate >= 1) {
                    dispatch({ type: "editor change rate", rate: 1 });
                    return;
                  } else {
                    dispatch({
                      type: "editor change rate",
                      rate: editor.rate + 0.1,
                    });
                  }
                }}
              >
                {" "}
                +{" "}
              </button>
              <button
                onClick={() => {
                  if (editor.rate <= 0) {
                    dispatch({ type: "editor change rate", rate: 0 });
                    return;
                  } else {
                    dispatch({
                      type: "editor change rate",
                      rate: editor.rate - 0.1,
                    });
                  }
                }}
              >
                {" "}
                -{" "}
              </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Entry Direction: {editor.entryDirection}
            <div>
              <button
                onClick={() => {
                  if (
                    editor.entryDirection === "right" &&
                    editor.leavingDirection !== "down"
                  ) {
                    dispatch({
                      type: "editor change entry direction",
                      entryDirection: "up",
                    });
                  } else if (
                    editor.entryDirection === "up" &&
                    editor.leavingDirection !== "left"
                  ) {
                    dispatch({
                      type: "editor change entry direction",
                      entryDirection: "left",
                    });
                  } else if (
                    editor.entryDirection === "left" &&
                    editor.leavingDirection !== "up"
                  ) {
                    dispatch({
                      type: "editor change entry direction",
                      entryDirection: "down",
                    });
                  } else if (
                    editor.entryDirection === "down" &&
                    editor.leavingDirection !== "right"
                  ) {
                    dispatch({
                      type: "editor change entry direction",
                      entryDirection: "right",
                    });
                  }
                }}
              >
                {RotationIcons["counterclockwise"]}
              </button>
              <button
                onClick={() => {
                  if (
                    editor.entryDirection === "right" &&
                    editor.leavingDirection !== "down"
                  ) {
                    dispatch({
                      type: "editor change entry direction",
                      entryDirection: "down",
                    });
                  } else if (
                    editor.entryDirection === "down" &&
                    editor.leavingDirection !== "left"
                  ) {
                    dispatch({
                      type: "editor change entry direction",
                      entryDirection: "left",
                    });
                  } else if (
                    editor.entryDirection === "left" &&
                    editor.leavingDirection !== "up"
                  ) {
                    dispatch({
                      type: "editor change entry direction",
                      entryDirection: "up",
                    });
                  } else if (
                    editor.entryDirection === "up" &&
                    editor.leavingDirection !== "right"
                  ) {
                    dispatch({
                      type: "editor change entry direction",
                      entryDirection: "right",
                    });
                  }
                }}
              >
                {RotationIcons["clockwise"]}
              </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Leaving Direction: {editor.leavingDirection}
            <div>
              <button
                onClick={() => {
                  if (
                    editor.leavingDirection === "right" &&
                    editor.entryDirection !== "up"
                  ) {
                    dispatch({
                      type: "editor change leaving direction",
                      leavingDirection: "up",
                    });
                  } else if (
                    editor.leavingDirection === "up" &&
                    editor.entryDirection !== "left"
                  ) {
                    dispatch({
                      type: "editor change leaving direction",
                      leavingDirection: "left",
                    });
                  } else if (
                    editor.leavingDirection === "left" &&
                    editor.entryDirection !== "down"
                  ) {
                    dispatch({
                      type: "editor change leaving direction",
                      leavingDirection: "down",
                    });
                  } else if (
                    editor.leavingDirection === "down" &&
                    editor.entryDirection !== "right"
                  ) {
                    dispatch({
                      type: "editor change leaving direction",
                      leavingDirection: "right",
                    });
                  }
                }}
              >
                {RotationIcons["counterclockwise"]}
              </button>
              <button
                onClick={() => {
                  if (
                    editor.leavingDirection === "right" &&
                    editor.entryDirection !== "down"
                  ) {
                    dispatch({
                      type: "editor change leaving direction",
                      leavingDirection: "down",
                    });
                  } else if (
                    editor.leavingDirection === "down" &&
                    editor.entryDirection !== "left"
                  ) {
                    dispatch({
                      type: "editor change leaving direction",
                      leavingDirection: "left",
                    });
                  } else if (
                    editor.leavingDirection === "left" &&
                    editor.entryDirection !== "up"
                  ) {
                    dispatch({
                      type: "editor change leaving direction",
                      leavingDirection: "up",
                    });
                  } else if (
                    editor.leavingDirection === "up" &&
                    editor.entryDirection !== "right"
                  ) {
                    dispatch({
                      type: "editor change leaving direction",
                      leavingDirection: "right",
                    });
                  }
                }}
              >
                {RotationIcons["clockwise"]}
              </button>
            </div>
          </div>
        </div>
      )}
      {editor.type === "splitter" && (
        <div>
          <div className={"EditorProp"}>
            Max: {editor.max}
            <div>
              <button
                onClick={() =>
                  dispatch({ type: "editor change max", max: editor.max + 1 })
                }
              >
                {" "}
                +{" "}
              </button>
              <button
                onClick={() =>
                  dispatch({ type: "editor change max", max: editor.max - 1 })
                }
              >
                {" "}
                -{" "}
              </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Rate: {editor.rate}
            <div>
              <button
                onClick={() => {
                  if (editor.rate >= 1) {
                    dispatch({ type: "editor change rate", rate: 1 });
                    return;
                  } else {
                    dispatch({
                      type: "editor change rate",
                      rate: editor.rate + 0.1,
                    });
                  }
                }}
              >
                {" "}
                +{" "}
              </button>
              <button
                onClick={() => {
                  if (editor.rate <= 0) {
                    dispatch({ type: "editor change rate", rate: 0 });
                    return;
                  } else {
                    dispatch({
                      type: "editor change rate",
                      rate: editor.rate - 0.1,
                    });
                  }
                }}
              >
                {" "}
                -{" "}
              </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Entry Direction: {editor.entryDirection}
            <div>
              <button
                onClick={() => {
                  dispatch({
                    type: "editor change entry direction",
                    entryDirection: rotateCounterClockwiseDirection(
                      editor.entryDirection,
                    ),
                  });
                }}
              >
                {RotationIcons["counterclockwise"]}
              </button>

              <button
                onClick={() => {
                  dispatch({
                    type: "editor change entry direction",
                    entryDirection: rotateClockwiseDirection(
                      editor.entryDirection,
                    ),
                  });
                }}
              >
                {RotationIcons["clockwise"]}
              </button>
            </div>
          </div>
        </div>
      )}
      {editor.type === "merger" && (
        <div>
          <div className={"EditorProp"}>
            Max: {editor.max}
            <div>
              <button
                onClick={() =>
                  dispatch({ type: "editor change max", max: editor.max + 1 })
                }
              >
                {" "}
                +{" "}
              </button>
              <button
                onClick={() =>
                  dispatch({ type: "editor change max", max: editor.max - 1 })
                }
              >
                {" "}
                -{" "}
              </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Rate: {editor.rate}
            <div>
              <button
                onClick={() => {
                  if (editor.rate >= 1) {
                    dispatch({ type: "editor change rate", rate: 1 });
                    return;
                  } else {
                    dispatch({
                      type: "editor change rate",
                      rate: editor.rate + 0.1,
                    });
                  }
                }}
              >
                {" "}
                +{" "}
              </button>
              <button
                onClick={() => {
                  if (editor.rate <= 0) {
                    dispatch({ type: "editor change rate", rate: 0 });
                    return;
                  } else {
                    dispatch({
                      type: "editor change rate",
                      rate: editor.rate - 0.1,
                    });
                  }
                }}
              >
                {" "}
                -{" "}
              </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Leaving Direction: {editor.leavingDirection}
            <div>
              <button
                onClick={() => {
                  dispatch({
                    type: "editor change leaving direction",
                    leavingDirection: rotateCounterClockwiseDirection(
                      editor.leavingDirection,
                    ),
                  });
                }}
              >
                {RotationIcons["counterclockwise"]}
              </button>
              <button
                onClick={() => {
                  dispatch({
                    type: "editor change leaving direction",
                    leavingDirection: rotateClockwiseDirection(
                      editor.leavingDirection,
                    ),
                  });
                }}
              >
                {RotationIcons["clockwise"]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
