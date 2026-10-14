import type { SalesPoint } from "@/lib/services/dashboard";

export function SalesChart({ data }: { data: SalesPoint[] }) {
  const max = Math.max(...data.map((point) => point.revenue), 1);
  const width = 640;
  const height = 200;
  const padding = 8;
  const barWidth = (width - padding * 2) / Math.max(data.length, 1) - 6;

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-ink">Sales (last 14 days)</span>
        <span className="text-xs text-ink-soft">in Rs.</span>
      </div>
      {data.every((point) => point.revenue === 0) ? (
        <p className="py-10 text-center text-sm text-ink-soft">No sales yet.</p>
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-44 w-full overflow-visible sm:h-52"
          role="img"
          aria-label="Sales over the last 14 days"
        >
          {data.map((point, index) => {
            const h = (point.revenue / max) * (height - padding * 2);
            const x = padding + index * (barWidth + 6);
            const y = height - padding - h;
            return (
              <g key={point.date}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(h, 3)}
                  rx={6}
                  fill={point.orders > 0 ? "#DA74A3" : "#EEC3F4"}
                >
                  <title>{`${point.date}: Rs. ${point.revenue}`}</title>
                </rect>
                <text
                  x={x + barWidth / 2}
                  y={height - 2}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#5b5b6b"
                >
                  {point.date.slice(8)}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}