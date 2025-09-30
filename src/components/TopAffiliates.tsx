interface Affiliate {
  id: string;
  name: string;
  enrolments: number;
  avatar: string;
}

interface AffiliateCardProps {
  affiliate: Affiliate;
}

function AffiliateCard({ affiliate }: AffiliateCardProps) {
  return (
    <div
      className="bg-[var(--bg-card)] rounded-lg transition-colors"
      style={{ padding: "var(--spacing-md)" }}
    >
      <div className="flex items-center" style={{ gap: "var(--spacing-md)" }}>
        {/* Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-red-500 rounded-full flex-shrink-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--text-primary)] truncate">
            {affiliate.name}
          </h3>
          <span className="text-sm font-medium text-[var(--accent-purple)]">
            {affiliate.enrolments} Enrolments
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TopAffiliates() {
  const affiliates: Affiliate[] = [
    {
      id: "1",
      name: "Abdulrahman Assan",
      enrolments: 30,
      avatar: "/avatar.jpg",
    },
    {
      id: "2",
      name: "Abdulrahman Assan",
      enrolments: 30,
      avatar: "/avatar.jpg",
    },
    {
      id: "3",
      name: "Abdulrahman Assan",
      enrolments: 30,
      avatar: "/avatar.jpg",
    },
    {
      id: "4",
      name: "Abdulrahman Assan",
      enrolments: 30,
      avatar: "/avatar.jpg",
    },
  ];

  return (
    <div className="bg-[var(--bg-card)] rounded-lg">
      <div style={{ padding: "var(--spacing-lg)" }}>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Top Performing Affiliates
        </h2>
      </div>
      <div
        style={{
          padding: "var(--spacing-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-md)",
        }}
      >
        {affiliates.map((affiliate) => (
          <AffiliateCard key={affiliate.id} affiliate={affiliate} />
        ))}
      </div>
    </div>
  );
}
