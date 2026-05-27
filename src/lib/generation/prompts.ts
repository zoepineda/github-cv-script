import type { LLMMessage } from "@/lib/llm";

type PRContext = {
  title: string;
  repository: string;
  description: string | null;
  category: string;
  achievementType: string;
  linesAdded: number;
  linesDeleted: number;
  summary: string | null;
};

const SYSTEM_PROMPT = `You are an engineering career coach helping a software engineer document their work.
You write concise, specific, jargon-appropriate impact statements grounded in the actual PR data provided.
Never invent details not present in the input. Never use buzzwords or filler.
If the PR data is sparse, keep the output short rather than padding it.`;

export function impactSummaryMessages(pr: PRContext): LLMMessage[] {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Write a 1-2 sentence impact summary for this PR. Focus on what was built and why it matters.

Title: ${pr.title}
Repository: ${pr.repository}
Description: ${pr.description || "No description provided"}
Category: ${pr.category}
Type: ${pr.achievementType}
Lines added: ${pr.linesAdded}
Lines deleted: ${pr.linesDeleted}
Summary: ${pr.summary || "None"}

Impact summary:`,
    },
  ];
}

export function resumeBulletMessages(pr: PRContext): LLMMessage[] {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Write a single resume bullet point for this PR. Start with a strong past-tense verb. Be specific about the technical work, not vague about impact.

Title: ${pr.title}
Repository: ${pr.repository}
Description: ${pr.description || "No description provided"}
Category: ${pr.category}
Type: ${pr.achievementType}
Lines added: ${pr.linesAdded}
Lines deleted: ${pr.linesDeleted}
Summary: ${pr.summary || "None"}

Resume bullet:`,
    },
  ];
}
