// Signature visual: clean node and line workflow diagram.
// Labeled pills with arrows. Middle node is the AI step in pine.
// Labels sit INSIDE nodes so nothing renders as empty boxes.
import { useId } from "react";

export default function WorkflowDiagram({
  steps,
  title,
  compact = false,
}: {
  steps: string[];
  title: string;
  compact?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const arrowId = `flow-arrow-${uid}`;
  const arrowDimId = `flow-arrow-dim-${uid}`;
  const w = 560;
  const nodeW = compact ? 104 : 112;  const nodeH = compact ? 52 : 60;
  const h = nodeH + 56;
  const cy = nodeH / 2 + 8;
  const gap = (w - nodeW * steps.length) / (steps.length - 1);
  const labelLen = compact ? 10 : 12;

  function short(label: string): string[] {
    if (label.length <= labelLen) return [label];
    const words = label.split(" ");
    if (words.length === 1) return [label.slice(0, labelLen)];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  }

  return (
    <figure
      role="img"
      aria-label={title + ". Steps: " + steps.join(", then ")}
      className="card w-full overflow-hidden p-4 md:p-5"
    >
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <marker
            id={arrowId}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke="#0e7c5b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
          <marker
            id={arrowDimId}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke="#9aa7a1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>
        {steps.map((_, i) => {
          if (i === steps.length - 1) return null;
          const x1 = i * (nodeW + gap) + nodeW + 3;
          const x2 = (i + 1) * (nodeW + gap) - 5;
          const active = i === 0;
          return (
            <line
              key={i}
              x1={x1}
              y1={cy}
              x2={x2}
              y2={cy}
              pathLength={1}
              className={active ? "flow-line-active" : "flow-line"}
              strokeLinecap="round"
              markerEnd={active ? `url(#${arrowId})` : `url(#${arrowDimId})`}
            />
          );
        })}
        {steps.map((s, i) => {
          const x = i * (nodeW + gap);
          const accent = i === 1;
          const lines = short(s);
          return (
            <g key={s + i}>
              <rect
                x={x}
                y={8}
                width={nodeW}
                height={nodeH}
                rx={14}
                className={accent ? "flow-node-accent" : "flow-node"}
              />
              <circle
                cx={x + 16}
                cy={8 + 14}
                r={8}
                fill={accent ? "rgb(255 255 255 / 0.25)" : "var(--wash)"}
              />
              <text
                x={x + 16}
                y={8 + 17.5}
                textAnchor="middle"
                fontSize={9}
                fontWeight={700}
                fill={accent ? "#fff" : "var(--pine)"}
              >
                {i + 1}
              </text>
              <text
                x={x + nodeW / 2 + 6}
                y={cy - (lines.length > 1 ? 2 : -4)}
                textAnchor="middle"
                className={accent ? "flow-label-accent" : "flow-label"}
              >
                {lines.map((ln, li) => (
                  <tspan key={li} x={x + nodeW / 2 + 6} dy={li === 0 ? 0 : 14}>
                    {ln}
                  </tspan>
                ))}
              </text>
              {accent && (
                <circle cx={x + nodeW - 12} cy={8 + 12} r={3.5} fill="#fff" />
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 border-t border-line pt-3 text-center text-xs leading-relaxed text-ink-soft">
        {title}
      </figcaption>
    </figure>
  );
}
