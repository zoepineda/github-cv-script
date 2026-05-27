import { prisma } from "@/lib/db";

export type MonthlyBucket = {
  month: string; // "2026-01"
  label: string; // "January 2026"
  count: number;
  linesAdded: number;
  linesDeleted: number;
  categories: Record<string, number>;
  types: Record<string, number>;
};

export type RepoBreakdown = {
  fullName: string;
  count: number;
  linesAdded: number;
  linesDeleted: number;
  categories: Record<string, number>;
};

export type QuarterSummary = {
  quarter: string; // "Q1 2026"
  months: MonthlyBucket[];
  totalPRs: number;
  totalLinesAdded: number;
  topRepos: { name: string; count: number }[];
  categoryShift: { category: string; percentage: number }[];
};

export type AnalyticsData = {
  monthly: MonthlyBucket[];
  repos: RepoBreakdown[];
  quarters: QuarterSummary[];
  totals: {
    prs: number;
    repos: number;
    linesAdded: number;
    linesDeleted: number;
    firstPR: string | null;
    lastPR: string | null;
  };
};

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const prs = await prisma.pR.findMany({
    orderBy: { mergedAt: "desc" },
    include: { repository: true },
  });

  // --- Monthly buckets ---
  const monthMap = new Map<string, MonthlyBucket>();

  for (const pr of prs) {
    if (!pr.mergedAt) continue;
    const d = pr.mergedAt;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    if (!monthMap.has(key)) {
      monthMap.set(key, {
        month: key,
        label,
        count: 0,
        linesAdded: 0,
        linesDeleted: 0,
        categories: {},
        types: {},
      });
    }

    const bucket = monthMap.get(key)!;
    bucket.count++;
    bucket.linesAdded += pr.linesAdded;
    bucket.linesDeleted += pr.linesDeleted;
    bucket.categories[pr.category] =
      (bucket.categories[pr.category] || 0) + 1;
    bucket.types[pr.achievementType] =
      (bucket.types[pr.achievementType] || 0) + 1;
  }

  const monthly = [...monthMap.values()].sort((a, b) =>
    a.month.localeCompare(b.month),
  );

  // --- Repo breakdown ---
  const repoMap = new Map<string, RepoBreakdown>();

  for (const pr of prs) {
    const name = pr.repository.fullName;
    if (!repoMap.has(name)) {
      repoMap.set(name, {
        fullName: name,
        count: 0,
        linesAdded: 0,
        linesDeleted: 0,
        categories: {},
      });
    }
    const repo = repoMap.get(name)!;
    repo.count++;
    repo.linesAdded += pr.linesAdded;
    repo.linesDeleted += pr.linesDeleted;
    repo.categories[pr.category] = (repo.categories[pr.category] || 0) + 1;
  }

  const repos = [...repoMap.values()].sort((a, b) => b.count - a.count);

  // --- Quarterly rollups ---
  const quarterMap = new Map<string, MonthlyBucket[]>();

  for (const bucket of monthly) {
    const [year, monthStr] = bucket.month.split("-");
    const monthNum = parseInt(monthStr);
    const q = Math.ceil(monthNum / 3);
    const key = `Q${q} ${year}`;
    if (!quarterMap.has(key)) quarterMap.set(key, []);
    quarterMap.get(key)!.push(bucket);
  }

  const quarters: QuarterSummary[] = [...quarterMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([quarter, months]) => {
      const totalPRs = months.reduce((s, m) => s + m.count, 0);
      const totalLinesAdded = months.reduce((s, m) => s + m.linesAdded, 0);

      // Aggregate categories across quarter
      const catCounts: Record<string, number> = {};
      for (const m of months) {
        for (const [cat, count] of Object.entries(m.categories)) {
          catCounts[cat] = (catCounts[cat] || 0) + count;
        }
      }

      const categoryShift = Object.entries(catCounts)
        .map(([category, count]) => ({
          category,
          percentage: totalPRs > 0 ? Math.round((count / totalPRs) * 100) : 0,
        }))
        .sort((a, b) => b.percentage - a.percentage);

      // Top repos this quarter (from the PRs in these months)
      const repoCountsQ: Record<string, number> = {};
      for (const pr of prs) {
        if (!pr.mergedAt) continue;
        const d = pr.mergedAt;
        const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (months.some((m) => m.month === mKey)) {
          repoCountsQ[pr.repository.fullName] =
            (repoCountsQ[pr.repository.fullName] || 0) + 1;
        }
      }

      const topRepos = Object.entries(repoCountsQ)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      return { quarter, months, totalPRs, totalLinesAdded, topRepos, categoryShift };
    });

  // --- Totals ---
  const dates = prs
    .map((p) => p.mergedAt)
    .filter((d): d is Date => d !== null)
    .sort((a, b) => a.getTime() - b.getTime());

  const totals = {
    prs: prs.length,
    repos: new Set(prs.map((p) => p.repository.fullName)).size,
    linesAdded: prs.reduce((s, p) => s + p.linesAdded, 0),
    linesDeleted: prs.reduce((s, p) => s + p.linesDeleted, 0),
    firstPR: dates[0]?.toISOString() ?? null,
    lastPR: dates[dates.length - 1]?.toISOString() ?? null,
  };

  return { monthly, repos, quarters, totals };
}
