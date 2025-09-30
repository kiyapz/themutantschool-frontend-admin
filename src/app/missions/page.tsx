import MissionStats from "@/components/MissionStats";
import MissionsList from "@/components/MissionsList";

export default function MissionsPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Statistics Cards */}
      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <MissionStats />
      </div>

      {/* Missions List */}
      <div className="flex-1">
        <MissionsList />
      </div>
    </div>
  );
}
