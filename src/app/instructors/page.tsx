import InstructorStats from "@/components/InstructorStats";
import InstructorsList from "@/components/InstructorsList";

export default function InstructorsPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Statistics Cards */}
      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <InstructorStats />
      </div>

      {/* Instructors List */}
      <div className="flex-1">
        <InstructorsList />
      </div>
    </div>
  );
}
