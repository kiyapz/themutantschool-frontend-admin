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
  );
}

export default function AffiliateStats() {
  const stats = [
    {
      title: "All Affiliates",
      value: "21",
    },
    {
      title: "Active",
      value: "19",
    },
    {
      title: "Inactive",
      value: "2",
    },
    {
      title: "Total Commissions",
      value: "$1,250.22",
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
