import type { ReactNode } from "react";
import "./advanced-form-docs.css";
export function RuleScene({
  slug,
  title,
  note,
  children,
  result,
}: {
  slug: string;
  title: string;
  note: string;
  children: ReactNode;
  result: ReactNode;
}) {
  return (
    <div className="rule-doc-scene" data-doc-preview={slug}>
      <header>
        <div>
          <span>RULE STUDIO</span>
          <strong>{title}</strong>
        </div>
        <small>{note}</small>
      </header>
      <div className="rule-doc-scene__canvas">{children}</div>
      <div className="rule-doc-scene__result" role="status">
        {result}
      </div>
    </div>
  );
}
