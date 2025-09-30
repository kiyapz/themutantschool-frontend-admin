interface Mission {
  id: string;
  title: string;
  instructor: string;
  recruits: number;
  certificates: number;
  thumbnail: string;
}

interface MissionCardProps {
  mission: Mission;
}

function MissionCard({ mission }: MissionCardProps) {
  return (
    <div
      className="bg-[var(--bg-card)] rounded-lg transition-colors"
      style={{ padding: "var(--spacing-md)" }}
    >
      <div className="flex items-center" style={{ gap: "var(--spacing-md)" }}>
        {/* Thumbnail */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-red-500 rounded-lg flex-shrink-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-md"></div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--text-primary)] truncate">
            {mission.title}
          </h3>
          <p
            className="text-sm text-[var(--text-secondary)]"
            style={{ marginTop: "var(--spacing-xs)" }}
          >
            {mission.instructor}
          </p>
          <div
            className="flex"
            style={{ gap: "var(--spacing-md)", marginTop: "var(--spacing-sm)" }}
          >
            <span className="text-sm font-medium text-[var(--accent-yellow)]">
              {mission.recruits} Recruits
            </span>
            <span className="text-sm font-medium text-[var(--accent-yellow)]">
              {mission.certificates} Certificates
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TopMissions() {
  const missions: Mission[] = [
    {
      id: "1",
      title: "Javascript Fundamental",
      instructor: "Abdulrahman Assan",
      recruits: 71,
      certificates: 50,
      thumbnail: "/mission-thumb.jpg",
    },
    {
      id: "2",
      title: "Mobile App Design",
      instructor: "Shaibu Mohammed",
      recruits: 50,
      certificates: 20,
      thumbnail: "/mission-thumb.jpg",
    },
    {
      id: "3",
      title: "Flutter+ Masterclass",
      instructor: "Abdulrahman Assan",
      recruits: 43,
      certificates: 21,
      thumbnail: "/mission-thumb.jpg",
    },
  ];

  return (
    <div className="bg-[var(--bg-card)] rounded-lg">
      <div style={{ padding: "var(--spacing-lg)" }}>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Top Performing Missions
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
        {missions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>
    </div>
  );
}
