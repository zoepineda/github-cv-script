"use client";

import { useState, useMemo } from "react";

type PR = {
  id: string;
  number: number;
  title: string;
  url: string;
  mergedAt: string | null;
  linesAdded: number;
  linesDeleted: number;
  category: string;
  achievementType: string;
  summary: string | null;
  repository: { fullName: string };
};

type Props = {
  prs: PR[];
  repos: string[];
  stats: { totalPRs: number; totalRepos: number; totalLines: number };
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getMonthGroup(dateStr: string | null) {
  if (!dateStr) return "Unknown";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

const categoryColors: Record<string, string> = {
  frontend:
    "bg-[var(--color-label-blue-bg)] text-[var(--color-label-blue-fg)] border-[var(--color-label-blue-fg)]",
  backend:
    "bg-[var(--color-label-purple-bg)] text-[var(--color-label-purple-fg)] border-[var(--color-label-purple-fg)]",
  fullstack:
    "bg-[var(--color-label-green-bg)] text-[var(--color-label-green-fg)] border-[var(--color-label-green-fg)]",
  other:
    "bg-[var(--color-label-orange-bg)] text-[var(--color-label-orange-fg)] border-[var(--color-label-orange-fg)]",
};

const typeColors: Record<string, string> = {
  feature:
    "bg-[var(--color-label-green-bg)] text-[var(--color-label-green-fg)]",
  fix: "bg-[var(--color-label-purple-bg)] text-[var(--color-label-purple-fg)]",
  refactor:
    "bg-[var(--color-label-blue-bg)] text-[var(--color-label-blue-fg)]",
  other: "bg-[var(--color-label-gray-bg)] text-[var(--color-label-gray-fg)]",
};

export function PRDashboard({ prs, repos, stats }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [achievement, setAchievement] = useState("");
  const [repository, setRepository] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filtered = useMemo(() => {
    return prs.filter((pr) => {
      if (
        search &&
        !pr.title.toLowerCase().includes(search.toLowerCase()) &&
        !(pr.summary || "").toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (category && pr.category !== category) return false;
      if (achievement && pr.achievementType !== achievement) return false;
      if (repository && pr.repository.fullName !== repository) return false;
      if (startDate || endDate) {
        const prDate = (pr.mergedAt || "").substring(0, 7);
        if (startDate && prDate < startDate) return false;
        if (endDate && prDate > endDate) return false;
      }
      return true;
    });
  }, [prs, search, category, achievement, repository, startDate, endDate]);

  // Group by month
  const grouped = useMemo(() => {
    const groups: { label: string; prs: PR[] }[] = [];
    let currentMonth = "";
    for (const pr of filtered) {
      const month = getMonthGroup(pr.mergedAt);
      if (month !== currentMonth) {
        groups.push({ label: month, prs: [] });
        currentMonth = month;
      }
      groups[groups.length - 1].prs.push(pr);
    }
    return groups;
  }, [filtered]);

  const hasFilters =
    search || category || achievement || repository || startDate || endDate;

  function clearFilters() {
    setSearch("");
    setCategory("");
    setAchievement("");
    setRepository("");
    setStartDate("");
    setEndDate("");
  }

  return (
    <main className="mx-auto max-w-[960px] px-6 py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg-default)]">
          Pull Requests
        </h1>
        <p className="mt-2 max-w-[55ch] text-[var(--color-fg-muted)]">
          A record of merged contributions across repositories, filterable by
          category, type, and date.
        </p>
        <div className="mt-5 flex flex-wrap gap-5 text-sm text-[var(--color-fg-muted)]">
          <span>
            <strong className="font-semibold text-[var(--color-fg-default)]">
              {stats.totalPRs}
            </strong>{" "}
            merged PRs
          </span>
          <span>
            across{" "}
            <strong className="font-semibold text-[var(--color-fg-default)]">
              {stats.totalRepos}
            </strong>{" "}
            repositories
          </span>
          <span>
            <strong className="font-semibold text-[var(--color-fg-default)]">
              {stats.totalLines.toLocaleString()}
            </strong>{" "}
            lines added total
          </span>
        </div>
      </header>

      {/* Filters */}
      <nav
        className="mb-4 flex flex-wrap items-end gap-3 border-b border-[var(--color-border-muted)] pb-6"
        aria-label="Filter pull requests"
      >
        <FilterField label="Search">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by title..."
            className="min-w-[220px] rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-inset)] px-3 py-2 text-sm text-[var(--color-fg-default)] transition-colors focus:border-[var(--color-accent-fg)] focus:outline-2 focus:outline-[var(--color-accent-fg)]"
          />
        </FilterField>
        <FilterField label="Category">
          <FilterSelect
            value={category}
            onChange={setCategory}
            options={["frontend", "backend", "fullstack", "other"]}
          />
        </FilterField>
        <FilterField label="Type">
          <FilterSelect
            value={achievement}
            onChange={setAchievement}
            options={["feature", "fix", "refactor", "other"]}
          />
        </FilterField>
        <FilterField label="Repository">
          <FilterSelect
            value={repository}
            onChange={setRepository}
            options={repos}
            labels={repos.map((r) => r.split("/").pop()!)}
          />
        </FilterField>
        <FilterField label="From">
          <input
            type="month"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-inset)] px-3 py-2 text-sm text-[var(--color-fg-default)] transition-colors focus:border-[var(--color-accent-fg)] focus:outline-2 focus:outline-[var(--color-accent-fg)]"
          />
        </FilterField>
        <FilterField label="To">
          <input
            type="month"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-inset)] px-3 py-2 text-sm text-[var(--color-fg-default)] transition-colors focus:border-[var(--color-accent-fg)] focus:outline-2 focus:outline-[var(--color-accent-fg)]"
          />
        </FilterField>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto cursor-pointer rounded-md border border-[var(--color-border-default)] bg-transparent px-3 py-2 text-sm text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-canvas-subtle)] hover:text-[var(--color-fg-default)]"
          >
            Clear
          </button>
        )}
      </nav>

      {/* Results count */}
      <p className="pb-3 text-sm text-[var(--color-fg-subtle)]" aria-live="polite">
        {filtered.length} pull request{filtered.length === 1 ? "" : "s"}
      </p>

      {/* PR list */}
      <div
        className="overflow-hidden rounded-lg border border-[var(--color-border-muted)]"
        role="list"
      >
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-[var(--color-fg-subtle)]">
            No pull requests match these filters.
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.label}>
              <div className="border-b border-[var(--color-border-muted)] bg-[var(--color-canvas-subtle)] px-5 py-2 text-xs font-medium text-[var(--color-fg-muted)]">
                {group.label}
              </div>
              {group.prs.map((pr) => (
                <div
                  key={pr.id}
                  role="listitem"
                  className="grid grid-cols-[1fr_auto] gap-x-5 gap-y-1 border-b border-[var(--color-border-muted)] px-5 py-4 transition-colors last:border-b-0 hover:bg-[var(--color-canvas-subtle)]"
                >
                  <div className="flex flex-wrap items-baseline gap-3">
                    <svg
                      className="h-4 w-4 shrink-0 translate-y-[2px] text-[var(--color-done-fg)]"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8-9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM4.25 5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                    </svg>
                    <a
                      href={pr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[var(--color-fg-default)] no-underline hover:text-[var(--color-accent-fg)]"
                    >
                      {pr.title}
                    </a>
                    <span
                      className={`inline-block rounded-full border px-2 py-px text-xs font-medium ${categoryColors[pr.category] || categoryColors.other}`}
                    >
                      {pr.category}
                    </span>
                    <span
                      className={`inline-block rounded-full px-2 py-px text-xs font-medium ${typeColors[pr.achievementType] || typeColors.other}`}
                    >
                      {pr.achievementType}
                    </span>
                  </div>
                  <div className="pt-0.5 text-right text-xs text-[var(--color-fg-subtle)]">
                    <time dateTime={pr.mergedAt || ""}>
                      {formatDate(pr.mergedAt)}
                    </time>
                  </div>
                  <div className="col-span-full flex items-center gap-3 text-xs text-[var(--color-fg-subtle)]">
                    <span className="font-mono text-[var(--color-fg-muted)]">
                      {pr.repository.fullName}
                    </span>
                    <span className="flex gap-2">
                      <span className="text-[var(--color-success-fg)]">
                        +{pr.linesAdded.toLocaleString()}
                      </span>
                      <span className="text-[var(--color-danger-fg)]">
                        &minus;{pr.linesDeleted.toLocaleString()}
                      </span>
                    </span>
                  </div>
                  {pr.summary && (
                    <p className="col-span-full max-w-[70ch] text-sm text-[var(--color-fg-muted)]">
                      {pr.summary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </main>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-fg-subtle)]">
        {label}
      </label>
      {children}
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
  labels,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labels?: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-w-[140px] rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-inset)] px-3 py-2 text-sm text-[var(--color-fg-default)] transition-colors focus:border-[var(--color-accent-fg)] focus:outline-2 focus:outline-[var(--color-accent-fg)]"
    >
      <option value="">All</option>
      {options.map((opt, i) => (
        <option key={opt} value={opt}>
          {labels ? labels[i] : opt}
        </option>
      ))}
    </select>
  );
}
