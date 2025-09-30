"use client";

import { useState, useEffect } from "react";
import adminApi from "@/utils/api";

interface Mission {
  _id: string;
  title: string;
  instructor: string;
  category: "Coding" | "Design" | "Growth";
  levels: number;
  capsules: number;
  recruits: number;
  price: number;
  priceType: "Lifetime" | "Limited offer" | "Free";
  status: "Active" | "Pending";
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface StatCardProps {
  title: string;
  value: string;
  loading?: boolean;
}

function StatCard({ title, value, loading = false }: StatCardProps) {
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
            {loading ? "..." : value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MissionStats() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get("/missions");

      if (response.data.success) {
        setMissions(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching missions for stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from the actual data
  const activeMissions = missions.filter(
    (mission) => mission.status === "Active"
  ).length;
  const pendingMissions = missions.filter(
    (mission) => mission.status === "Pending"
  ).length;
  const totalMissions = missions.length;
  const publishedMissions = missions.filter(
    (mission) => mission.status === "Active"
  ).length; // Assuming Active = Published

  const stats = [
    {
      title: "Active Missions",
      value: activeMissions.toString(),
    },
    {
      title: "Published Missions",
      value: publishedMissions.toString(),
    },
    {
      title: "Missions Pending Review",
      value: pendingMissions.toString(),
    },
    {
      title: "Total Missions",
      value: totalMissions.toString(),
    },
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
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
