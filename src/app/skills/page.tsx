import type { Metadata } from "next";
import { getSkillsData } from "@/lib/skills/queries";
import { SkillsReport } from "./report";

export const metadata: Metadata = {
  title: "Skills — Career OS",
};

export default async function SkillsPage() {
  const data = await getSkillsData();
  return <SkillsReport data={data} />;
}
