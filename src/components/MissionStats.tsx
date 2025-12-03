"use client";

import { useState, useEffect } from "react";
import adminApi from "@/utils/api";

interface Mission {
  _id: string;
  title: string;
  instructor: string;
  category: string;
  skillLevel: string;
  estimatedDuration: string;
  price: number;
  isFree: boolean;
  isPublished: boolean;
  status: string;
  averageRating: number;
  reviews: unknown[];
  description?: string;
  shortDescription?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  thumbnail?: {
    url: string;
    key: string;
  };
  video?: {
    url: string;
    key: string;
    type: string;
  };
  certificateAvailable?: boolean;
  tags?: string[];
  levels?: unknown[];
  validCoupons?: unknown[];
}

interface StatCardProps {
  title: string;
  value: string;
  loading?: boolean;
}

function StatCard({ title, value, loading = false }: StatCardProps) {
  return (
    <div
      className="bg-[#0C0C0C] rounded-lg"
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
            {loading ? "..." : value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MissionStats() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [totalMissions, setTotalMissions] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      console.log("=== FETCHING MISSIONS FROM BACKEND ===");
      console.log("Using endpoint: /api/admin/missions");

      const response = await adminApi.get("/missions");
      console.log("Missions API Response:", response.data);
      console.log("Response data type:", typeof response.data);
      console.log("Response data keys:", Object.keys(response.data));
      console.log("Response success:", response.data.success);
      console.log("Response message:", response.data.message);

      // The array is nested in response.data.data.data
      const missionsArray = response?.data?.data?.data;
      const pagination = response?.data?.data?.pagination;

      if (pagination) {
        console.log(`Total missions in database: ${pagination.totalItems}`);
        setTotalMissions(pagination.totalItems);
      }

      if (missionsArray && Array.isArray(missionsArray)) {
        console.log(`✅ Success! Found ${missionsArray.length} missions.`);
        setMissions(missionsArray);
      } else {
        const errorMsg =
          "Data received, but it is not in the expected format (array missing).";
        console.error("❌", errorMsg, response.data);
      }
    } catch (err) {
      console.error("Error fetching missions for stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from the actual data
  console.log("=== MISSION STATS DEBUG ===");
  console.log(
    "All missions for stats:",
    missions.map((m) => ({
      title: m.title,
      isPublished: m.isPublished,
      status: m.status,
      _id: m._id,
    }))
  );

  const publishedMissions = missions.filter((mission) => {
    const isPublishedBool = mission.isPublished === true;
    const isPublishedString =
      mission.status && mission.status.toLowerCase() === "published";
    const result = isPublishedBool || isPublishedString;
    console.log(
      `Published check - ${mission.title}: isPublished=${mission.isPublished}, status=${mission.status}, result=${result}`
    );
    return result;
  }).length;

  const draftMissions = missions.filter((mission) => {
    const isDraftBool = mission.isPublished === false;
    const isDraftString =
      mission.status && mission.status.toLowerCase() === "draft";
    const result = isDraftBool || isDraftString;
    console.log(
      `Draft check - ${mission.title}: isPublished=${mission.isPublished}, status=${mission.status}, result=${result}`
    );
    return result;
  }).length;

  console.log(
    `Published count: ${publishedMissions}, Draft count: ${draftMissions}`
  );
  console.log("=== END MISSION STATS DEBUG ===");
  const freeMissions = missions.filter(
    (mission) => mission.isFree === true
  ).length;
  const paidMissions = missions.filter(
    (mission) => mission.isFree === false
  ).length;

  console.log("=== CALCULATED STATISTICS ===");
  console.log("Total missions:", totalMissions);
  console.log("Published missions:", publishedMissions);
  console.log("Draft missions:", draftMissions);
  console.log("Free missions:", freeMissions);
  console.log("Paid missions:", paidMissions);

  const stats = [
    {
      title: "Published Missions",
      value: publishedMissions.toString(),
    },
    {
      title: "Draft Missions",
      value: draftMissions.toString(),
    },
    {
      title: "Free Missions",
      value: freeMissions.toString(),
    },
    {
      title: "Paid Missions",
      value: paidMissions.toString(),
    },
    {
      title: "Total Missions",
      value: totalMissions.toString(),
    },
  ];

  if (!mounted) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
        style={{ gap: "var(--spacing-lg)" }}
      >
        {[1, 2, 3, 4, 5].map((index) => (
          <StatCard key={index} title="Loading..." value="..." loading={true} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
      style={{ gap: "var(--spacing-lg)" }}
    >
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          loading={loading}
        />
      ))}
    </div>
  );
}
