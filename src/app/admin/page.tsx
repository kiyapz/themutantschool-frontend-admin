import StatsCards from "@/components/StatsCards";
import TopMissions from "@/components/TopMissions";
import TopAffiliates from "@/components/TopAffiliates";
import Inbox from "@/components/Inbox";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col lg:flex-row"
        style={{ gap: "var(--spacing-lg)", marginTop: "var(--spacing-lg)" }}
      >
        {/* Left Column - Top Performing Missions and Affiliates */}
        <div
          className="flex-1 flex flex-col"
          style={{ gap: "var(--spacing-lg)" }}
        >
          <TopMissions />
          <TopAffiliates />
        </div>

        {/* Right Column - Inbox */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <Inbox />
        </div>
      </div>
    </div>
  );
}
