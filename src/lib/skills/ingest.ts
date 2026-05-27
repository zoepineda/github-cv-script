import { prisma } from "@/lib/db";
import { detectSkills, detectSkillsFromMetadata } from "./detector";

/**
 * Fetch file list for a PR from GitHub API.
 * Returns null if the request fails (rate limit, auth, etc.)
 */
async function fetchPRFiles(
  owner: string,
  repo: string,
  prNumber: number,
): Promise<string[] | null> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "career-os",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files?per_page=100`,
      { headers },
    );

    if (!res.ok) return null;

    const files = (await res.json()) as { filename: string }[];
    return files.map((f) => f.filename);
  } catch {
    return null;
  }
}

/**
 * Run skill detection on a single PR.
 * Tries to fetch files from GitHub; falls back to metadata detection.
 */
export async function detectSkillsForPR(prId: string): Promise<string[]> {
  const pr = await prisma.pR.findUniqueOrThrow({
    where: { id: prId },
    include: { repository: true },
  });

  let skills: string[];

  // Try fetching files from GitHub
  const files = await fetchPRFiles(
    pr.repository.owner,
    pr.repository.name,
    pr.number,
  );

  if (files && files.length > 0) {
    skills = detectSkills(files);
  } else {
    // Fallback to metadata-based detection
    skills = detectSkillsFromMetadata(
      pr.title,
      pr.category,
      pr.description,
    );
  }

  // Persist
  await prisma.pR.update({
    where: { id: prId },
    data: { skillTags: JSON.stringify(skills) },
  });

  return skills;
}

/**
 * Run skill detection on all PRs that haven't been tagged yet.
 * Includes a delay between GitHub API calls to respect rate limits.
 */
export async function detectSkillsForAll(
  onProgress?: (done: number, total: number) => void,
): Promise<{ tagged: number; skipped: number }> {
  const prs = await prisma.pR.findMany({
    where: { skillTags: null },
    include: { repository: true },
    orderBy: { mergedAt: "desc" },
  });

  let tagged = 0;
  let skipped = 0;

  for (let i = 0; i < prs.length; i++) {
    const pr = prs[i];

    try {
      const files = await fetchPRFiles(
        pr.repository.owner,
        pr.repository.name,
        pr.number,
      );

      let skills: string[];
      if (files && files.length > 0) {
        skills = detectSkills(files);
      } else {
        skills = detectSkillsFromMetadata(
          pr.title,
          pr.category,
          pr.description,
        );
      }

      await prisma.pR.update({
        where: { id: pr.id },
        data: { skillTags: JSON.stringify(skills) },
      });

      tagged++;
    } catch {
      skipped++;
    }

    onProgress?.(i + 1, prs.length);

    // Rate limit: ~1 req/sec for unauthenticated, faster with token
    if (i < prs.length - 1) {
      const delay = process.env.GITHUB_TOKEN ? 100 : 800;
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  return { tagged, skipped };
}
