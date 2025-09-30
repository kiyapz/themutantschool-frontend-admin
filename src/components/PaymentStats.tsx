interface StatCardProps {
  title: string;
  value: string;
  change?: string;
}

function StatCard({ title, value, change }: StatCardProps) {
  return (
    <div
      className="bg-[var(--bg-tertiary)] rounded-lg"
      style={{ padding: "var(--spacing-lg)" }}
    >
      <div>
        <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
          {title}
        </h3>
        <div
          className="flex items-center"
          style={{ gap: "var(--spacing-sm)", marginTop: "var(--spacing-sm)" }}
        >
          <p className="text-3xl font-bold text-[var(--text-primary)]">
            {value}
          </p>
          {change && (
            <span className="text-sm text-[var(--accent-red)]">{change}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentStats() {
  const stats = [
    {
      title: "Revenue this month",
      value: "$55,000",
      change: "-%",
    },
    {
      title: "Total Payout",
      value: "$5,000",
      change: "-%",
    },
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2"
      style={{ gap: "var(--spacing-lg)" }}
    >
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
        />
      ))}
    </div>
  );
}
