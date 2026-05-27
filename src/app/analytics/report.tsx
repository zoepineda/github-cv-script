"use client";

import type { AnalyticsData } from "@/lib/analytics/queries";
import {
  TimelineChart,
  StackedBar,
  BarChart,
} from "@/components/analytics/bar-chart";

const CATEGORY_COLORS: Record<string, string> = {
  frontend: "#79c0ff",
  backend: "#d2a8ff",
  fullstack: "#7ee787",
  other: "#d29922",
};

const TYPE_COLORS: Record<string, string> = {
  feature: "#7ee787",
  fix: "#d2a8ff",
  refactor: "#79c0ff",
  other: "#7d8590",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function AnalyticsReport({ data }: { data: AnalyticsData }) {
  const { monthly, repos, quarters, totals } = data;

  // Aggregate overall categories
  const overallCategories: Record<string, number> = {};
  const overallTypes: Record<string, number> = {};
  for (const m of monthly) {
    for (const [k, v] of Object.entries(m.categories)) {
      overallCategories[k] = (overallCategories[k] || 0) + v;
    }
    for (const [k, v] of Object.entries(m.types)) {
      overallTypes[k] = (overallTypes[k] || 0) + v;
    }
  }

  return (
    <main className="mx-auto max-w-[960px] px-6 py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg-default)]">
          Analytics
        </h1>
        <p className="mt-2 max-w-[55ch] text-[var(--color-fg-muted)]">
          Contribution patterns and engineering activity over time.
        </p>
        <div className="mt-5 flex flex-wrap gap-5 text-sm text-[var(--color-fg-muted)]">
          <span>
            <strong className="font-semibold text-[var(--color-fg-default)]">
              {totals.prs}
            </strong>{" "}
            merged PRs
          </span>
          <span>
            <strong className="font-semibold text-[var(--color-fg-default)]">
              {totals.linesAdded.toLocaleString()}
            </strong>{" "}
            lines added
          </span>
          <span>
            {formatDate(totals.firstPR)} — {formatDate(totals.lastPR)}
          </span>
        </div>
      </header>

      {/* --- Timeline --- */}
      <Section title="Contribution Timeline">
        <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
          Merged pull requests per month.
        </p>
        <TimelineChart
          bars={monthly.map((m) => ({
            label: m.label,
            value: m.count,
            sublabel: m.month.split("-").map((p, i) =>
              i === 1
                ? new Date(2000, parseInt(p) - 1).toLocaleDateString("en-US", {
                    month: "short",
                  })
                : p.slice(2),
            ).join(" "),
          }))}
        />
      </Section>

      {/* --- Category Distribution --- */}
      <Section title="Category Distribution">
        <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
          How your work splits across frontend, backend, and fullstack.
        </p>
        <StackedBar
          segments={Object.entries(overallCategories).map(([label, value]) => ({
            label,
            value,
            color: CATEGORY_COLORS[label] ?? "#7d8590",
          }))}
        />
      </Section>

      {/* --- Work Type --- */}
      <Section title="Work Type">
        <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
          Features vs fixes vs refactors.
        </p>
        <StackedBar
          segments={Object.entries(overallTypes).map(([label, value]) => ({
            label,
            value,
            color: TYPE_COLORS[label] ?? "#7d8590",
          }))}
        />
      </Section>

      {/* --- Repository Activity --- */}
      <Section title="Repository Activity">
        <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
          PRs merged per repository.
        </p>
        <BarChart
          bars={repos.slice(0, 10).map((r) => ({
            label: r.fullName.split("/").pop() ?? r.fullName,
            value: r.count,
          }))}
        />
      </Section>

      {/* --- Lines of Code --- */}
      <Section title="Lines Changed">
        <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
          Lines added per month.
        </p>
        <BarChart
          bars={monthly.map((m) => ({
            label: m.month.split("-")[1] + "/" + m.month.split("-")[0].slice(2),
            value: m.linesAdded,
            color: "var(--color-success-fg)",
          }))}
        />
      </Section>

      {/* --- Quarterly Summaries --- */}
      <Section title="Quarterly Summaries">
        <div className="space-y-8">
          {quarters
            .slice()
            .reverse()
            .map((q) => (
              <div
                key={q.quarter}
                className="rounded-lg border border-[var(--color-border-muted)] px-5 py-4"
              >
                <h3 className="mb-3 text-lg font-semibold text-[var(--color-fg-default)]">
                  {q.quarter}
                </h3>
                <p className="mb-3 text-sm text-[var(--color-fg-muted)]">
                  You merged{" "}
                  <strong className="text-[var(--color-fg-default)]">
                    {q.totalPRs}
                  </strong>{" "}
                  pull requests, adding{" "}
                  <strong className="text-[var(--color-fg-default)]">
                    {q.totalLinesAdded.toLocaleString()}
                  </strong>{" "}
                  lines across{" "}
                  <strong className="text-[var(--color-fg-default)]">
                    {q.topRepos.length}
                  </strong>{" "}
                  repositories.
                </p>

                {/* Category breakdown */}
                <div className="mb-3">
                  <StackedBar
                    segments={q.categoryShift.map((c) => ({
                      label: c.category,
                      value: c.percentage,
                      color: CATEGORY_COLORS[c.category] ?? "#7d8590",
                    }))}
                  />
                </div>

                {/* Top repos */}
                <div className="flex flex-wrap gap-3 text-xs text-[var(--color-fg-muted)]">
                  {q.topRepos.map((r) => (
                    <span key={r.name}>
                      <span className="font-mono text-[var(--color-fg-default)]">
                        {r.name.split("/").pop()}
                      </span>{" "}
                      ({r.count})
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </Section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12 border-b border-[var(--color-border-muted)] pb-12 last:border-b-0">
      <h2 className="mb-4 text-xl font-semibold text-[var(--color-fg-default)]">
        {title}
      </h2>
      {children}
    </section>
  );
}
