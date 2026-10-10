import type { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
}

function Panel({ children, className = "" }: PanelProps) {
  return <section className={`panel ${className}`}>{children}</section>;
}

export default Panel;
