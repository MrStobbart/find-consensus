import { PropsWithChildren } from "react";

export function ItemsDisplay({ children }: PropsWithChildren) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "fit-content" }}>{children}</div>
    </div>
  );
}
