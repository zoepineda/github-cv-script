import type { Metadata } from "next";
import { getAnalyticsData } from "@/lib/analytics/queries";
import { AnalyticsReport } from "./report";

export const metadata: Metadata = {
  title: "Analytics — Career OS",
};

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();
  return <AnalyticsReport data={data} />;
}
