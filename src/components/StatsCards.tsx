"use client";

import { useState, useEffect } from "react";
import {
  fetchInstructors,
  fetchAffiliates,
  fetchStudents,
  fetchPlatformEarnings,
} from "@/utils/api";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  loading?: boolean;
}

function StatCard({ title, value, icon, loading }: StatCardProps) {
  return (
    <div
      className="bg-[#0C0C0C] rounded-lg"
      style={{ padding: "var(--spacing-lg)" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-[#595959] uppercase tracking-wider">
            {title}
          </h3>
          <p
            className="text-3xl font-bold text-[var(--text-primary)]"
            style={{ marginTop: "var(--spacing-sm)" }}
          >
            {loading ? "..." : value}
          </p>
        </div>
        {icon && <div className="text-[var(--accent-purple)]">{icon}</div>}
      </div>
    </div>
  );
}

export default function StatsCards() {
  const [instructorCount, setInstructorCount] = useState<number>(0);
  const [affiliateCount, setAffiliateCount] = useState<number>(0);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<string>("$0");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [
          instructorsResponse,
          affiliatesResponse,
          studentsResponse,
          earningsResponse,
        ] = await Promise.all([
          fetchInstructors(),
          fetchAffiliates(),
          fetchStudents(),
          fetchPlatformEarnings(),
        ]);

        // Log all responses for debugging
        console.log("=== API RESPONSES ===");
        console.log("Instructors Response:", instructorsResponse);
        console.log("Affiliates Response:", affiliatesResponse);
        console.log("Students Response:", studentsResponse);
        console.log("Earnings Response:", earningsResponse);
        console.log("===================");

        setInstructorCount(
          instructorsResponse.data?.data?.length ||
            instructorsResponse.total ||
            instructorsResponse.data?.length ||
            0
        );
        setAffiliateCount(
          affiliatesResponse.data?.data?.length ||
            affiliatesResponse.total ||
            affiliatesResponse.data?.length ||
            0
        );
        setStudentCount(
          studentsResponse.data?.data?.length ||
            studentsResponse.total ||
            studentsResponse.data?.length ||
            0
        );

        // Calculate total payout (sum of all balances)
        const earningsData = earningsResponse.data;
        const totalPayout =
          (earningsData?.balances?.affiliates?.total || 0) +
          (earningsData?.balances?.instructors?.total || 0) +
          (earningsData?.balances?.platform?.total || 0);

        setMonthlyRevenue(`$${totalPayout.toLocaleString()}`);

        console.log("Processed values:", {
          instructorCount:
            instructorsResponse.data?.data?.length ||
            instructorsResponse.total ||
            instructorsResponse.data?.length ||
            0,
          affiliateCount:
            affiliatesResponse.data?.data?.length ||
            affiliatesResponse.total ||
            affiliatesResponse.data?.length ||
            0,
          studentCount:
            studentsResponse.data?.data?.length ||
            studentsResponse.total ||
            studentsResponse.data?.length ||
            0,
          totalPayout: `$${totalPayout.toLocaleString()}`,
          earningsBreakdown: {
            affiliates: earningsData?.balances?.affiliates?.total || 0,
            instructors: earningsData?.balances?.instructors?.total || 0,
            platform: earningsData?.balances?.platform?.total || 0,
          },
        });

        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data");
        // Fallback to static values on error
        setInstructorCount(21);
        setAffiliateCount(21);
        setStudentCount(105);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = [
    {
      title: "Total Recruits",
      value: studentCount,
      loading: loading,
    },
    {
      title: "Total Instructors",
      value: instructorCount,
      loading: loading,
    },
    {
      title: "Total Affiliates",
      value: affiliateCount,
      loading: loading,
    },
    {
      title: "Total Payout",
      value: monthlyRevenue,
      loading: loading,
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
          loading={stat.loading}
        />
      ))}
      {error && (
        <div className="col-span-full text-center text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
