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
  );
}

export default function AffiliateStats() {
  const [affiliates, setAffiliates] = useState<
    {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      isActive: boolean;
      affiliateEarnings: number;
      earningsBalance: number;
      pendingBalance: number;
      walletBalance: number;
      level: number;
      createdAt: string;
      profile?: {
        avatar?: {
          url: string;
          key: string;
        };
        city?: string;
        country?: string;
      };
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchAffiliateStats = async () => {
      try {
        setLoading(true);
        console.log("=== FETCHING AFFILIATE STATS FROM BACKEND ===");
        console.log("Using endpoint: /api/admin/users/affiliates");
        console.log("Full URL will be: /api/admin/users/affiliates");
        console.log("Admin API base URL:", adminApi.defaults?.baseURL);
        console.log("Admin API headers:", adminApi.defaults?.headers);
        console.log(
          "Token from localStorage:",
          localStorage.getItem("login-accessToken")
        );

        console.log("Making API call for stats...");
        const response = await adminApi.get("/users/affiliates");
        console.log("=== STATS API CALL SUCCESSFUL ===");
        console.log("Response status:", response.status);
        console.log("Response status text:", response.statusText);
        console.log("Response headers:", response.headers);
        console.log("Response config:", response.config);
        console.log("Affiliate Stats API Response:", response.data);
        console.log("Response data type:", typeof response.data);
        console.log("Response data keys:", Object.keys(response.data));
        console.log("Response success:", response.data.success);
        console.log("Response message:", response.data.message);

        if (response.data.success) {
          const affiliatesData = response.data.data?.data;

          if (Array.isArray(affiliatesData)) {
            console.log("=== AFFILIATE STATS DATA PROCESSING ===");
            console.log("Affiliates for stats:", affiliatesData);
            console.log("Affiliates data type:", typeof affiliatesData);
            console.log("Affiliates is array:", Array.isArray(affiliatesData));
            console.log("Affiliates length:", affiliatesData.length);

            const totalAffiliates = affiliatesData.length;
            const activeAffiliates = affiliatesData.filter(
              (affiliate: {
                isActive: boolean;
                firstName: string;
                lastName: string;
              }) => {
                console.log(
                  `Checking affiliate ${affiliate.firstName} ${affiliate.lastName}: isActive = ${affiliate.isActive}`
                );
                return affiliate.isActive;
              }
            ).length;
            const inactiveAffiliates = totalAffiliates - activeAffiliates;
            const totalCommissions = affiliatesData.reduce(
              (
                sum: number,
                affiliate: { firstName: string; affiliateEarnings: number }
              ) => {
                console.log(
                  `Adding commissions for ${affiliate.firstName}: ${
                    affiliate.affiliateEarnings || 0
                  }`
                );
                return sum + (affiliate.affiliateEarnings || 0);
              },
              0
            );

            console.log("=== CALCULATED AFFILIATE STATS ===");
            console.log("Calculated affiliate stats:", {
              totalAffiliates,
              activeAffiliates,
              inactiveAffiliates,
              totalCommissions,
            });

            setAffiliates(affiliatesData);
          } else {
            console.error(
              "Affiliates data for stats is not an array:",
              affiliatesData
            );
          }
        } else {
          console.error("Failed to fetch affiliate stats - invalid response");
        }
      } catch (error) {
        console.error("=== AFFILIATE STATS FETCH ERROR ===");
        console.error("Error type:", typeof error);
        console.error("Error object:", error);

        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }

        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as {
            response?: { status?: number; data?: unknown; headers?: unknown };
          };
          console.error("Axios error response:", axiosError.response);
          console.error("Axios error status:", axiosError.response?.status);
          console.error("Axios error data:", axiosError.response?.data);
          console.error("Axios error headers:", axiosError.response?.headers);
        }

        if (error && typeof error === "object" && "request" in error) {
          const axiosError = error as { request?: unknown };
          console.error("Axios request error:", axiosError.request);
        }

        console.error("=== END AFFILIATE STATS FETCH ERROR ===");
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliateStats();
  }, []);

  if (!mounted) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        style={{ gap: "var(--spacing-lg)" }}
      >
        {[1, 2, 3, 4].map((index) => (
          <StatCard key={index} title="Loading..." value="..." loading={true} />
        ))}
      </div>
    );
  }

  const totalAffiliates = affiliates.length;
  const activeAffiliates = affiliates.filter(
    (affiliate: { isActive: boolean }) => affiliate.isActive
  ).length;
  const inactiveAffiliates = totalAffiliates - activeAffiliates;
  const totalCommissions = affiliates.reduce(
    (sum: number, affiliate: { affiliateEarnings: number }) =>
      sum + (affiliate.affiliateEarnings || 0),
    0
  );

  const stats = [
    {
      title: "All Affiliates",
      value: totalAffiliates.toString(),
    },
    {
      title: "Active",
      value: activeAffiliates.toString(),
    },
    {
      title: "Inactive",
      value: inactiveAffiliates.toString(),
    },
    {
      title: "Total Commissions",
      value: `$${totalCommissions.toFixed(2)}`,
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
