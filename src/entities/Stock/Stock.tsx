import type { EntityStockType } from "../../types";

export default function Stock({ entity }: { entity: EntityStockType }) {
  return (
    <div
      key={entity.id}
      style={{
        background: "rgba(0, 0, 0, 0.1)",
        minWidth: "120px",
      }}
    >
      <div style={{ marginBottom: "5px" }}>{entity.id}</div>
      <progress value={entity.val} max={entity.max} style={{ width: "100%" }} />
      <div style={{ marginTop: "5px", textAlign: "center" }}>
        {entity.val} / {entity.max}
      </div>
    </div>
  );
}
