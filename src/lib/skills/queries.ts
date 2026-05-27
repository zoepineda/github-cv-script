import { prisma } from "@/lib/db";
import { getSkillDomain } from "./detector";

export type SkillSummary = {
  skill: string;
  domain: string;
  count: number; // PRs that used this skill
  linesAdded: number;
  firstSeen: string | null; // ISO date
  lastSeen: string | null;
  repos: string[];
};

export type SkillTimeline = {
  month: string;
  skills: Record<string, number>;
};

export type SkillsData = {
  skills: SkillSummary[];
  timeline: SkillTimeline[];
  totalTagged: number;
  totalUntagged: number;
  domains: { domain: string; count: number; color: string }[];
};

export async function getSkillsData(): Promise<SkillsData> {
  const prs = await prisma.pR.findMany({
    include: { repository: true },
    orderBy: { mergedAt: "desc" },
  });

  const tagged = prs.filter((pr) => pr.skillTags);
  const untagged = prs.filter((pr) => !pr.skillTags);

  // Aggregate skills
  const skillMap = new Map<string, SkillSummary>();

  for (const pr of tagged) {
    const skills: string[] = JSON.parse(pr.skillTags!);
    for (const skill of skills) {
      if (!skillMap.has(skill)) {
        skillMap.set(skill, {
          skill,
          domain: getSkillDomain(skill),
          count: 0,
          linesAdded: 0,
          firstSeen: null,
          lastSeen: null,
          repos: [],
        });
      }
      const s = skillMap.get(skill)!;
      s.count++;
      s.linesAdded += pr.linesAdded;

      const date = pr.mergedAt?.toISOString() ?? null;
      if (date) {
        if (!s.firstSeen || date < s.firstSeen) s.firstSeen = date;
        if (!s.lastSeen || date > s.lastSeen) s.lastSeen = date;
      }

      const repo = pr.repository.fullName;
      if (!s.repos.includes(repo)) s.repos.push(repo);
    }
  }

  const skills = [...skillMap.values()].sort((a, b) => b.count - a.count);

  // Domain aggregation
  const domainMap = new Map<string, number>();
  for (const s of skills) {
    domainMap.set(s.domain, (domainMap.get(s.domain) || 0) + s.count);
  }

  const { DOMAIN_COLORS } = await import("./detector");
  const domains = [...domainMap.entries()]
    .map(([domain, count]) => ({
      domain,
      count,
      color: DOMAIN_COLORS[domain] ?? "#7d8590",
    }))
    .sort((a, b) => b.count - a.count);

  // Monthly skill timeline
  const monthSkills = new Map<string, Record<string, number>>();

  for (const pr of tagged) {
    if (!pr.mergedAt) continue;
    const d = pr.mergedAt;
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!monthSkills.has(month)) monthSkills.set(month, {});
    const bucket = monthSkills.get(month)!;

    const prSkills: string[] = JSON.parse(pr.skillTags!);
    for (const skill of prSkills) {
      bucket[skill] = (bucket[skill] || 0) + 1;
    }
  }

  const timeline = [...monthSkills.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, skills]) => ({ month, skills }));

  return {
    skills,
    timeline,
    totalTagged: tagged.length,
    totalUntagged: untagged.length,
    domains,
  };
}
