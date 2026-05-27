import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = join(fileURLToPath(import.meta.url), "..");

const adapter = new PrismaBetterSqlite3({
  url: `file:${join(__dirname, "..", "dev.db")}`,
});
const prisma = new PrismaClient({ adapter });

interface RawPR {
  title: string;
  number: number;
  url: string;
  merged_at: string | null;
  lines_added: number;
  lines_deleted: number;
  description: string | null;
  summary: string | null;
  category: string;
  achievement_type: string;
  repository: string;
}

interface PRsData {
  total_prs: number;
  by_category: Record<string, Record<string, RawPR[]>>;
}

async function main() {
  const dataPath = join(__dirname, "..", "prs.json");
  const raw = readFileSync(dataPath, "utf-8");
  const data: PRsData = JSON.parse(raw);

  // Flatten all PRs
  const allPRs: RawPR[] = [];
  for (const category of Object.values(data.by_category)) {
    for (const prs of Object.values(category)) {
      allPRs.push(...prs);
    }
  }

  console.log(`Found ${allPRs.length} PRs to seed`);

  // Deduplicate by repo+number
  const seen = new Set<string>();
  const uniquePRs = allPRs.filter((pr) => {
    const key = `${pr.repository}#${pr.number}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`${uniquePRs.length} unique PRs after dedup`);

  // Upsert repositories
  const repoNames = [...new Set(uniquePRs.map((pr) => pr.repository))];
  const repoMap = new Map<string, string>();

  for (const fullName of repoNames) {
    const [owner, name] = fullName.split("/");
    const repo = await prisma.repository.upsert({
      where: { fullName },
      update: {},
      create: { owner, name, fullName },
    });
    repoMap.set(fullName, repo.id);
  }

  console.log(`Upserted ${repoMap.size} repositories`);

  // Upsert PRs
  let created = 0;
  let skipped = 0;

  for (const pr of uniquePRs) {
    const repositoryId = repoMap.get(pr.repository)!;

    try {
      await prisma.pR.upsert({
        where: {
          repositoryId_number: { repositoryId, number: pr.number },
        },
        update: {
          title: pr.title,
          linesAdded: pr.lines_added || 0,
          linesDeleted: pr.lines_deleted || 0,
          summary: pr.summary || null,
        },
        create: {
          number: pr.number,
          title: pr.title,
          url: pr.url,
          description: pr.description || null,
          mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
          linesAdded: pr.lines_added || 0,
          linesDeleted: pr.lines_deleted || 0,
          category: pr.category,
          achievementType: pr.achievement_type,
          summary: pr.summary || null,
          repositoryId,
        },
      });
      created++;
    } catch (e) {
      skipped++;
    }
  }

  console.log(`Seeded ${created} PRs (${skipped} skipped)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
