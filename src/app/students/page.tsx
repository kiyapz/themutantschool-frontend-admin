import StudentStats from "@/components/StudentStats";
import StudentsList from "@/components/StudentsList";

export default function StudentsPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Statistics Cards */}
      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <StudentStats />
      </div>

      {/* Students List */}
      <div className="flex-1">
        <StudentsList />
      </div>
    </div>
  );
}
