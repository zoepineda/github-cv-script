"use server";

import { prisma } from "@/lib/db";
import { getLLMProvider } from "@/lib/llm";
import {
  impactSummaryMessages,
  resumeBulletMessages,
} from "@/lib/generation/prompts";
import { revalidatePath } from "next/cache";

export async function generateImpactSummary(prId: string) {
  const pr = await prisma.pR.findUniqueOrThrow({
    where: { id: prId },
    include: { repository: true },
  });

  const llm = getLLMProvider();
  const messages = impactSummaryMessages({
    title: pr.title,
    repository: pr.repository.fullName,
    description: pr.description,
    category: pr.category,
    achievementType: pr.achievementType,
    linesAdded: pr.linesAdded,
    linesDeleted: pr.linesDeleted,
    summary: pr.summary,
  });

  const result = await llm.complete({ messages, temperature: 0.3 });

  await prisma.pR.update({
    where: { id: prId },
    data: { impactSummary: result.trim() },
  });

  revalidatePath("/");
  return result.trim();
}

export async function generateResumeBullet(prId: string) {
  const pr = await prisma.pR.findUniqueOrThrow({
    where: { id: prId },
    include: { repository: true },
  });

  const llm = getLLMProvider();
  const messages = resumeBulletMessages({
    title: pr.title,
    repository: pr.repository.fullName,
    description: pr.description,
    category: pr.category,
    achievementType: pr.achievementType,
    linesAdded: pr.linesAdded,
    linesDeleted: pr.linesDeleted,
    summary: pr.summary,
  });

  const result = await llm.complete({ messages, temperature: 0.3 });

  await prisma.pR.update({
    where: { id: prId },
    data: { resumeBullet: result.trim() },
  });

  revalidatePath("/");
  return result.trim();
}

export async function generateBatch(prIds: string[]) {
  const results: { id: string; impactSummary: string; resumeBullet: string }[] =
    [];

  for (const id of prIds) {
    const impact = await generateImpactSummary(id);
    const bullet = await generateResumeBullet(id);
    results.push({ id, impactSummary: impact, resumeBullet: bullet });
  }

  revalidatePath("/");
  return results;
}

export async function updateImpactSummary(prId: string, text: string) {
  await prisma.pR.update({
    where: { id: prId },
    data: { impactSummary: text.trim() },
  });
  revalidatePath("/");
}

export async function updateResumeBullet(prId: string, text: string) {
  await prisma.pR.update({
    where: { id: prId },
    data: { resumeBullet: text.trim() },
  });
  revalidatePath("/");
}
