// app/dashboard/page.tsx
import Dashboard from "@/components/Dashboard";

export const dynamic = "force-dynamic"; // Always fetch fresh data

export default function DashboardPage() {
  return <Dashboard />;
}
