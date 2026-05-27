"use client";

import { useTransition } from "react";
import type { SkillsData } from "@/lib/skills/queries";
import { StackedBar, BarChart } from "@/components/analytics/bar-chart";
import { runSkillDetection } from "@/app/actions";

const DOMAIN_COLORS: Record<string, string> = {
  frontend: "#79c0ff",
  backend: "#d2a8ff",
  devops: "#f0883e",
  testing: "#7ee787",
  data: "#d29922",
  mobile: "#f778ba",
  general: "#7d8590",
};

export function SkillsReport({ data }: { data: SkillsData }) {
  const { skills, timeline, totalTagged, totalUntagged, domains } = data;
  const [isPending, startTransition] = useTransition();

  function handleDetect() {
    startTransition(async () => {
      const result = await runSkillDetection();
      alert(`Tagged ${result.tagged} PRs (${result.skipped} skipped). Reload to see results.`);
      window.location.reload();
    });
  }

  // Identify core skills (top 5 by count) and emerging (seen in last 3 months but not top 5)
  const coreSkills = skills.slice(0, 5);
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const coreNames = new Set(coreSkills.map((s) => s.skill));

  const emergingSkills = skills
    .filter((s) => {
      if (coreNames.has(s.skill)) return false;
      if (!s.lastSeen) return false;
      return new Date(s.lastSeen) >= threeMonthsAgo;
    })
    .slice(0, 5);

  // Skills not seen in last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const dormantSkills = skills.filter((s) => {
    if (!s.lastSeen) return false;
    return new Date(s.lastSeen) < sixMonthsAgo && s.count >= 3;
  });

  return (
    <main className="mx-auto max-w-[960px] px-6 py-12">
      <header className="mb-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg-default)]">
              Skills
            </h1>
            <p className="mt-2 max-w-[55ch] text-[var(--color-fg-muted)]">
              Technologies and tools detected from your pull request history.
            </p>
          </div>
          {totalUntagged > 0 && (
            <button
              onClick={handleDetect}
              disabled={isPending}
              className="shrink-0 cursor-pointer rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-3 py-2 text-sm text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-border-muted)] hover:text-[var(--color-fg-default)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Detecting..." : `Detect skills (${totalUntagged} untagged)`}
            </button>
          )}
        </div>
        <div className="mt-5 flex flex-wrap gap-5 text-sm text-[var(--color-fg-muted)]">
          <span>
            <strong className="font-semibold text-[var(--color-fg-default)]">
              {skills.length}
            </strong>{" "}
            skills detected
          </span>
          <span>
            from{" "}
            <strong className="font-semibold text-[var(--color-fg-default)]">
              {totalTagged}
            </strong>{" "}
            tagged PRs
          </span>
          {totalUntagged > 0 && (
            <span className="text-[var(--color-attention-fg)]">
              {totalUntagged} untagged
            </span>
          )}
        </div>
      </header>

      {skills.length === 0 ? (
        <div className="rounded-lg border border-[var(--color-border-muted)] px-6 py-16 text-center">
          <p className="text-sm text-[var(--color-fg-muted)]">
            No skills detected yet. Click &ldquo;Detect skills&rdquo; to analyze your PRs.
          </p>
        </div>
      ) : (
        <>
          {/* Domain Distribution */}
          <Section title="Domain Distribution">
            <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
              Where your skill usage concentrates across engineering domains.
            </p>
            <StackedBar
              segments={domains.map((d) => ({
                label: d.domain,
                value: d.count,
                color: d.color,
              }))}
            />
          </Section>

          {/* Core Skills */}
          <Section title="Core Skills">
            <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
              Your most-used technologies by PR count.
            </p>
            <BarChart
              bars={coreSkills.map((s) => ({
                label: s.skill,
                value: s.count,
                color: DOMAIN_COLORS[s.domain] ?? "#7d8590",
              }))}
            />
          </Section>

          {/* Emerging Skills */}
          {emergingSkills.length > 0 && (
            <Section title="Emerging Skills">
              <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
                Technologies you&apos;ve used recently that aren&apos;t yet in your top 5.
              </p>
              <div className="flex flex-wrap gap-2">
                {emergingSkills.map((s) => (
                  <span
                    key={s.skill}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-default)] px-3 py-1 text-sm"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: DOMAIN_COLORS[s.domain] ?? "#7d8590" }}
                    />
                    <span className="text-[var(--color-fg-default)]">{s.skill}</span>
                    <span className="text-xs text-[var(--color-fg-subtle)]">
                      {s.count} PRs
                    </span>
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Dormant Skills */}
          {dormantSkills.length > 0 && (
            <Section title="Dormant Skills">
              <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
                Skills you haven&apos;t used in 6+ months but have meaningful history with.
              </p>
              <div className="flex flex-wrap gap-2">
                {dormantSkills.map((s) => (
                  <span
                    key={s.skill}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-muted)] px-3 py-1 text-sm text-[var(--color-fg-subtle)]"
                  >
                    {s.skill}
                    <span className="text-xs">
                      last used{" "}
                      {s.lastSeen
                        ? new Date(s.lastSeen).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })
                        : "unknown"}
                    </span>
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* All Skills */}
          <Section title="All Skills">
            <div className="overflow-hidden rounded-lg border border-[var(--color-border-muted)]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border-muted)] bg-[var(--color-canvas-subtle)]">
                    <th className="px-4 py-2 text-xs font-medium text-[var(--color-fg-muted)]">
                      Skill
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-[var(--color-fg-muted)]">
                      Domain
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--color-fg-muted)]">
                      PRs
                    </th>
                    <th className="hidden px-4 py-2 text-right text-xs font-medium text-[var(--color-fg-muted)] sm:table-cell">
                      Lines
                    </th>
                    <th className="hidden px-4 py-2 text-xs font-medium text-[var(--color-fg-muted)] sm:table-cell">
                      Repos
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map((s) => (
                    <tr
                      key={s.skill}
                      className="border-b border-[var(--color-border-muted)] last:border-b-0"
                    >
                      <td className="px-4 py-2.5 font-medium text-[var(--color-fg-default)]">
                        <span className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{
                              backgroundColor:
                                DOMAIN_COLORS[s.domain] ?? "#7d8590",
                            }}
                          />
                          {s.skill}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[var(--color-fg-muted)]">
                        {s.domain}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-[var(--color-fg-default)]">
                        {s.count}
                      </td>
                      <td className="hidden px-4 py-2.5 text-right tabular-nums text-[var(--color-fg-subtle)] sm:table-cell">
                        {s.linesAdded.toLocaleString()}
                      </td>
                      <td className="hidden px-4 py-2.5 text-[var(--color-fg-subtle)] sm:table-cell">
                        {s.repos.map((r) => r.split("/").pop()).join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Skill Timeline */}
          {timeline.length > 0 && (
            <Section title="Skill Timeline">
              <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
                Top skills per month — how your technology usage has shifted over time.
              </p>
              <div className="space-y-3">
                {timeline
                  .slice()
                  .reverse()
                  .slice(0, 12)
                  .map((t) => {
                    const sorted = Object.entries(t.skills)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5);
                    const monthLabel = new Date(
                      t.month + "-01",
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    });

                    return (
                      <div
                        key={t.month}
                        className="flex items-center gap-3 text-sm"
                      >
                        <span className="w-16 shrink-0 text-right text-xs text-[var(--color-fg-subtle)]">
                          {monthLabel}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {sorted.map(([skill, count]) => (
                            <span
                              key={skill}
                              className="rounded bg-[var(--color-canvas-subtle)] px-2 py-0.5 text-xs text-[var(--color-fg-muted)]"
                            >
                              {skill}{" "}
                              <span className="text-[var(--color-fg-subtle)]">
                                {count}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Section>
          )}
        </>
      )}
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
