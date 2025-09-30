interface StatCardProps {
  title: string;
  value: string;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div
      className="bg-[var(--bg-tertiary)] rounded-lg"
      style={{ padding: "var(--spacing-lg)" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
            {title}
          </h3>
          <p
            className="text-3xl font-bold text-[var(--text-primary)]"
            style={{ marginTop: "var(--spacing-sm)" }}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function StudentStats() {
  const stats = [
    {
      title: "All Recruits",
      value: "105",
    },
    {
      title: "Enrolled",
      value: "15",
    },
    {
      title: "Certificates",
      value: "6",
    },
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      style={{ gap: "var(--spacing-lg)" }}
    >
      {stats.map((stat, index) => (
        <StatCard key={index} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
}
