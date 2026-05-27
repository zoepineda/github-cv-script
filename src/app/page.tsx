import { prisma } from "@/lib/db";
import { PRDashboard } from "@/components/pr-dashboard";

export default async function Home() {
  const prs = await prisma.pR.findMany({
    orderBy: { mergedAt: "desc" },
    include: { repository: true },
  });

  const repos = [...new Set(prs.map((pr) => pr.repository.fullName))].sort();

  const totalLines = prs.reduce((sum, pr) => sum + pr.linesAdded, 0);

  // Serialize dates for client component
  const serialized = prs.map((pr) => ({
    ...pr,
    mergedAt: pr.mergedAt?.toISOString() ?? null,
    syncedAt: pr.syncedAt.toISOString(),
    createdAt: pr.createdAt.toISOString(),
    repository: {
      ...pr.repository,
      createdAt: pr.repository.createdAt.toISOString(),
    },
  }));

  return (
    <PRDashboard
      prs={serialized}
      repos={repos}
      stats={{
        totalPRs: prs.length,
        totalRepos: repos.length,
        totalLines,
      }}
    />
  );
}
