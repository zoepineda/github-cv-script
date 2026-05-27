"use client";

/**
 * Simple horizontal bar chart built with plain divs.
 * No chart library needed for this.
 */

type Bar = {
  label: string;
  value: number;
  color?: string;
};

export function BarChart({
  bars,
  maxValue,
  unit,
}: {
  bars: Bar[];
  maxValue?: number;
  unit?: string;
}) {
  const max = maxValue ?? Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="space-y-2">
      {bars.map((bar) => (
        <div key={bar.label} className="flex items-center gap-3">
          <span className="w-20 shrink-0 truncate text-right text-xs text-[var(--color-fg-muted)]">
            {bar.label}
          </span>
          <div className="relative h-5 flex-1 overflow-hidden rounded-sm bg-[var(--color-canvas-subtle)]">
            <div
              className="absolute inset-y-0 left-0 rounded-sm transition-all duration-300"
              style={{
                width: `${Math.max((bar.value / max) * 100, 0.5)}%`,
                backgroundColor: bar.color ?? "var(--color-accent-fg)",
              }}
            />
          </div>
          <span className="w-12 shrink-0 text-right text-xs tabular-nums text-[var(--color-fg-subtle)]">
            {bar.value}
            {unit ? ` ${unit}` : ""}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Vertical bar chart for the monthly timeline.
 */
export function TimelineChart({
  bars,
}: {
  bars: { label: string; value: number; sublabel?: string }[];
}) {
  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="flex items-end gap-[3px] overflow-x-auto pb-6 pt-2">
      {bars.map((bar, i) => (
        <div
          key={`${bar.label}-${i}`}
          className="group relative flex flex-col items-center"
          style={{ minWidth: "20px", flex: "1 1 20px" }}
        >
          {/* Tooltip */}
          <div className="pointer-events-none absolute bottom-full mb-2 hidden rounded bg-[var(--color-canvas-subtle)] px-2 py-1 text-xs text-[var(--color-fg-default)] shadow-lg group-hover:block">
            <div className="font-medium">{bar.value} PRs</div>
            <div className="text-[var(--color-fg-muted)]">{bar.label}</div>
          </div>
          {/* Bar */}
          <div
            className="w-full rounded-t-sm bg-[var(--color-accent-fg)] transition-all duration-300 hover:opacity-80"
            style={{
              height: `${Math.max((bar.value / max) * 160, 2)}px`,
            }}
          />
          {/* Label — show every 3rd month or first/last */}
          {(i === 0 ||
            i === bars.length - 1 ||
            i % 3 === 0) && (
            <span className="absolute -bottom-5 text-[9px] text-[var(--color-fg-subtle)]">
              {bar.sublabel || bar.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Stacked percentage bar for category distribution.
 */
export function StackedBar({
  segments,
}: {
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex h-3 overflow-hidden rounded-full">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className="transition-all duration-300"
            style={{
              width: `${(seg.value / total) * 100}%`,
              backgroundColor: seg.color,
            }}
            title={`${seg.label}: ${Math.round((seg.value / total) * 100)}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5 text-xs">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-[var(--color-fg-muted)]">
              {seg.label}{" "}
              <span className="tabular-nums text-[var(--color-fg-subtle)]">
                {Math.round((seg.value / total) * 100)}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
