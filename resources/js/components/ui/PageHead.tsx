import type { ReactNode } from "react";

interface PageHeadProps {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}

function PageHead({ eyebrow, title, description, action }: PageHeadProps) {
  return (
    <div className="page-head">
      <div>
        {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
        <p className="page-description">{description}</p>
      </div>

      {action}
    </div>
  );
}

export default PageHead;