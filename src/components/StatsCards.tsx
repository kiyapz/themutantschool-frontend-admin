interface StatCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
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
        {icon && <div className="text-[var(--accent-purple)]">{icon}</div>}
      </div>
    </div>
  );
}

export default function StatsCards() {
  const stats = [
    {
      title: "Total Recruits",
      value: "105",
    },
    {
      title: "Total Instructors",
      value: "21",
    },
    {
      title: "Total Affiliates",
      value: "21",
    },
    {
      title: "Revenue This Month",
      value: "$55,120",
    },
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      style={{ gap: "var(--spacing-lg)" }}
    >
      {stats.map((stat, index) => (
        <StatCard key={index} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
}
