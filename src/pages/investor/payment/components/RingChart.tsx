interface Segment {
  pct: number;
  color: string;
}

interface RingChartProps {
  pct: number;
  segments?: Segment[];
  color?: string;
  strokeWidth?: number;
  centerLabel?: string;
}
export function RingChart({
  pct,
  segments,
  color = "var(--color-olive)",
  strokeWidth = 10,
  centerLabel,
}: RingChartProps) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const gap = 1.5;

  if (segments && segments.length > 1) {
    const total = segments.reduce((s, seg) => s + seg.pct, 0);
    const gapFraction = gap / 360;

    type ArcData = {
      arcLen: number;
      dashOffset: number;
      color: string;
      delay: string;
    };
    const arcs: ArcData[] = [];
    let cumulativeFrac = 0;
    segments.forEach((seg, i) => {
      const segFrac = seg.pct / Math.max(total, 1);
      const arcLen = Math.max(0, segFrac * circ - gapFraction * circ * 2);
      arcs.push({
        arcLen,
        dashOffset: circ - cumulativeFrac * circ,
        color: seg.color,
        delay: `${i * 0.12}s`,
      });
      cumulativeFrac += segFrac;
    });

    return (
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        <style>{`
          @keyframes ringIn {
            from { stroke-dashoffset: var(--circ); opacity: 0; }
            to   { stroke-dashoffset: var(--offset); opacity: 1; }
          }
          .ring-seg {
            animation: ringIn 0.9s cubic-bezier(.45,0,.55,1) both;
          }
        `}</style>
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--bg-surface)"
          strokeWidth={strokeWidth}
        />
        {arcs.map((arc, i) => (
          <circle
            key={i}
            className="ring-seg"
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            strokeDasharray={`${arc.arcLen} ${circ - arc.arcLen}`}
            strokeDashoffset={arc.dashOffset}
            transform="rotate(-90 50 50)"
            style={{
              animationDelay: arc.delay,
              filter: `drop-shadow(0 0 4px ${arc.color}88)`,
            }}
          />
        ))}
        <text
          x="50"
          y="46"
          textAnchor="middle"
          fill="var(--text-primary)"
          fontSize="14"
          fontWeight="700"
          fontFamily="Inter"
        >
          {centerLabel ?? `${Math.round(pct)}%`}
        </text>
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize="7"
          fontFamily="Inter"
        >
          Completed
        </text>
      </svg>
    );
  }

  const dashLen = (pct / 100) * circ;
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      style={{ overflow: "visible" }}
    >
      <style>{`
        @keyframes ringFill {
          from { stroke-dasharray: 0 ${circ}; opacity: 0; }
          to   { stroke-dasharray: var(--fill) ${circ}; opacity: 1; }
        }
        .ring-fill { animation: ringFill 1s cubic-bezier(.45,0,.55,1) both; }
      `}</style>
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="var(--bg-surface)"
        strokeWidth={strokeWidth}
      />
      <circle
        className="ring-fill"
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${dashLen} ${circ}`}
        transform="rotate(-90 50 50)"
        style={
          {
            "--fill": dashLen,
            filter: `drop-shadow(0 0 6px ${color}99)`,
          } as React.CSSProperties
        }
      />

      <text
        x="50"
        y="47"
        textAnchor="middle"
        fill="var(--text-primary)"
        fontSize={centerLabel ? "8" : "14"}
        fontWeight="700"
        fontFamily="Inter"
      >
        {centerLabel ?? `${pct}%`}
      </text>
      {!centerLabel && (
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize="7"
          fontFamily="Inter"
        >
          Completed
        </text>
      )}
      {centerLabel && (
        <text
          x="50"
          y="57"
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize="6.5"
          fontFamily="Inter"
        >
          {pct}% paid
        </text>
      )}
    </svg>
  );
}
