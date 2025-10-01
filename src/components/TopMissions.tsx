"use client";

import { useState, useEffect } from "react";
import { fetchTopMissions } from "@/utils/api";

interface Mission {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  bio: string;
  category: string;
  skillLevel: string;
  estimatedDuration: string;
  price: number;
  isFree: boolean;
  isPublished: boolean;
  status: string;
  certificateAvailable: boolean;
  averageRating: number;
  instructor: string;
  thumbnail: {
    url: string;
    key: string;
  };
  video: {
    url: string;
    key: string;
    type: string;
  };
  tags: string[];
  levels: any[];
  reviews: any[];
  validCoupons: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
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
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-red-500 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
          {mission.thumbnail?.url ? (
            <img
              src={mission.thumbnail.url}
              alt={mission.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-md"></div>
          )}
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
            {mission.category} • {mission.skillLevel}
          </p>
          <div
            className="flex flex-wrap"
            style={{ gap: "var(--spacing-sm)", marginTop: "var(--spacing-sm)" }}
          >
            <span className="text-sm font-medium text-[var(--accent-yellow)]">
              {mission.estimatedDuration}
            </span>
            <span className="text-sm font-medium text-[var(--accent-green)]">
              {mission.isFree ? "Free" : `$${mission.price}`}
            </span>
            <span className="text-sm font-medium text-[var(--accent-purple)]">
              ⭐ {mission.averageRating || "No rating"}
            </span>
            <span
              className={`text-sm font-medium px-2 py-1 rounded ${
                mission.status === "published"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {mission.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TopMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTopMissions = async () => {
      try {
        setLoading(true);
        console.log("Fetching top performing missions...");

        const response = await fetchTopMissions();

        console.log("=== TOP MISSIONS RESPONSE ===");
        console.log("Response:", response);
        console.log("Missions data:", response.data);
        console.log("===========================");

        // Handle the correct data structure from your backend
        console.log("Response structure:", response);
        console.log("Response.data:", response.data);
        console.log("Response.data.data:", response.data?.data);
        console.log("Type of response.data.data:", typeof response.data?.data);
        console.log("Is array:", Array.isArray(response.data?.data));

        // Access the nested data structure: response.data.data
        const allMissions = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        console.log("All missions from backend:", allMissions);

        // Filter to only show published missions
        const publishedMissions = allMissions.filter(
          (mission: Mission) => mission.isPublished === true
        );
        console.log("Published missions only:", publishedMissions);
        console.log("Total missions:", allMissions.length);
        console.log("Published missions count:", publishedMissions.length);

        setMissions(publishedMissions);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch top missions:", err);
        setError("Failed to load top missions");
      } finally {
        setLoading(false);
      }
    };

    loadTopMissions();
  }, []);

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
        {loading ? (
          <div className="text-center text-[var(--text-secondary)] py-8">
            Loading top missions...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : !Array.isArray(missions) || missions.length === 0 ? (
          <div className="text-center text-[var(--text-secondary)] py-8">
            No missions found
          </div>
        ) : (
          missions.map((mission) => (
            <MissionCard key={mission._id} mission={mission} />
          ))
        )}
      </div>
    </div>
  );
}
