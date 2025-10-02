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
      className="bg-[#0C0C0C] rounded-lg"
      style={{ padding: "var(--spacing-lg)" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-[#898989] uppercase tracking-wider">
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

export default function StudentStats() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchStudentStats = async () => {
      try {
        setLoading(true);
        console.log("=== FETCHING STUDENT STATS FROM BACKEND ===");
        console.log("Using endpoint: /api/admin/users/students");
        console.log("Full URL will be: /api/admin/users/students");
        console.log("Admin API base URL:", adminApi.defaults?.baseURL);
        console.log("Admin API headers:", adminApi.defaults?.headers);
        console.log(
          "Token from localStorage:",
          localStorage.getItem("login-accessToken")
        );

        console.log("Making API call for stats...");
        const response = await adminApi.get("/users/students");
        console.log("=== STATS API CALL SUCCESSFUL ===");
        console.log("Response status:", response.status);
        console.log("Response status text:", response.statusText);
        console.log("Response headers:", response.headers);
        console.log("Response config:", response.config);
        console.log("Student Stats API Response:", response.data);
        console.log("Response data type:", typeof response.data);
        console.log("Response data keys:", Object.keys(response.data));
        console.log("Response success:", response.data.success);
        console.log("Response message:", response.data.message);

        if (response.data.success) {
          const studentsData = response.data.data?.data;

          if (Array.isArray(studentsData)) {
            console.log("=== STUDENT STATS DATA PROCESSING ===");
            console.log("Students for stats:", studentsData);
            console.log("Students data type:", typeof studentsData);
            console.log("Students is array:", Array.isArray(studentsData));
            console.log("Students length:", studentsData.length);

            const totalStudents = studentsData.length;
            const activeStudents = studentsData.filter((student: any) => {
              console.log(
                `Checking student ${student.firstName} ${student.lastName}: isActive = ${student.isActive}`
              );
              return student.isActive;
            }).length;
            const inactiveStudents = totalStudents - activeStudents;
            const totalCertificates = studentsData.reduce(
              (sum: number, student: any) => {
                console.log(
                  `Adding certificates for ${student.firstName}: ${
                    student.badges?.length || 0
                  }`
                );
                return sum + (student.badges?.length || 0);
              },
              0
            );

            console.log("=== CALCULATED STUDENT STATS ===");
            console.log("Calculated student stats:", {
              totalStudents,
              activeStudents,
              inactiveStudents,
              totalCertificates,
            });

            setStudents(studentsData);
          } else {
            console.error(
              "Students data for stats is not an array:",
              studentsData
            );
          }
        } else {
          console.error("Failed to fetch student stats - invalid response");
        }
      } catch (error) {
        console.error("=== STUDENT STATS FETCH ERROR ===");
        console.error("Error type:", typeof error);
        console.error("Error object:", error);

        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }

        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as any;
          console.error("Axios error response:", axiosError.response);
          console.error("Axios error status:", axiosError.response?.status);
          console.error("Axios error data:", axiosError.response?.data);
          console.error("Axios error headers:", axiosError.response?.headers);
        }

        if (error && typeof error === "object" && "request" in error) {
          const axiosError = error as any;
          console.error("Axios request error:", axiosError.request);
        }

        console.error("=== END STUDENT STATS FETCH ERROR ===");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentStats();
  }, []);

  if (!mounted) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        style={{ gap: "var(--spacing-lg)" }}
      >
        {[1, 2, 3].map((index) => (
          <StatCard key={index} title="Loading..." value="..." loading={true} />
        ))}
      </div>
    );
  }

  const totalStudents = students.length;
  const activeStudents = students.filter(
    (student: any) => student.isActive
  ).length;
  const inactiveStudents = totalStudents - activeStudents;
  const totalCertificates = students.reduce(
    (sum: number, student: any) => sum + (student.badges?.length || 0),
    0
  );

  const stats = [
    {
      title: "All Recruits",
      value: totalStudents.toString(),
    },
    {
      title: "Active",
      value: activeStudents.toString(),
    },
    {
      title: "Certificates",
      value: totalCertificates.toString(),
    },
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
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
