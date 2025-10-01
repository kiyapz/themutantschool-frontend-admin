"use client";

import { useState, useEffect } from "react";
import adminApi from "@/utils/api";

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

export default function InstructorStats() {
  const [stats, setStats] = useState({
    totalInstructors: 0,
    activeInstructors: 0,
    inactiveInstructors: 0,
    verifiedInstructors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructorStats();
  }, []);

  const fetchInstructorStats = async () => {
    try {
      setLoading(true);
      console.log("=== FETCHING INSTRUCTOR STATS FROM BACKEND ===");

      const response = await adminApi.get("/users/instructors");
      console.log("Instructor Stats API Response:", response.data);

      const instructors = response.data?.data?.data; // Correctly access nested data

      if (instructors && Array.isArray(instructors)) {
        console.log("Instructors for stats:", instructors);

        const totalInstructors = instructors.length;
        const activeInstructors = instructors.filter(
          (instructor: any) => instructor.isActive
        ).length;
        const inactiveInstructors = totalInstructors - activeInstructors;
        const verifiedInstructors = instructors.filter(
          (instructor: any) => instructor.isVerified
        ).length;

        console.log("Calculated stats:", {
          totalInstructors,
          activeInstructors,
          inactiveInstructors,
          verifiedInstructors,
        });

        setStats({
          totalInstructors,
          activeInstructors,
          inactiveInstructors,
          verifiedInstructors,
        });
      } else {
        console.error(
          "Failed to fetch instructor stats - invalid response or data format"
        );
      }
    } catch (error) {
      console.error("Error fetching instructor stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: "All Instructors",
      value: stats.totalInstructors.toString(),
    },
    {
      title: "Active",
      value: stats.activeInstructors.toString(),
    },
    {
      title: "Inactive",
      value: stats.inactiveInstructors.toString(),
    },
    {
      title: "Verified",
      value: stats.verifiedInstructors.toString(),
    },
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      style={{ gap: "var(--spacing-lg)" }}
    >
      {statsData.map((stat, index) => (
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
