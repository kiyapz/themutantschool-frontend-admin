"use client";

import { useState, useEffect } from "react";
import adminApi from "@/utils/api";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  loading?: boolean;
}

function StatCard({ title, value, change, loading = false }: StatCardProps) {
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
            {loading ? "..." : value}
          </p>
          {change && !loading && (
            <span className="text-sm text-[var(--accent-red)]">{change}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentStats() {
  const [stats, setStats] = useState({
    revenueThisMonth: 0,
    totalPayout: 0,
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchPaymentStats = async () => {
      try {
        setLoading(true);
        console.log("--- Fetching Platform Earnings ---");
        const response = await adminApi.get("/earnings/platform");
        console.log("Platform Earnings API Response:", response.data);

        if (response.data.success) {
          const earningsData = response.data.data;
          console.log("Earnings Data:", earningsData);

          const affiliatesTotal = earningsData.balances?.affiliates?.total || 0;
          const instructorsTotal =
            earningsData.balances?.instructors?.total || 0;
          const platformTotal = earningsData.balances?.platform?.total || 0;
          const totalPayout =
            affiliatesTotal + instructorsTotal + platformTotal;

          console.log("Calculated Total Payout:", totalPayout);

          setStats({
            revenueThisMonth: earningsData.currentMonth?.revenue || 0,
            totalPayout: totalPayout,
          });
        } else {
          console.error("Failed to fetch platform earnings");
        }
      } catch (error) {
        console.error("Error fetching platform earnings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStats();
  }, []);

  if (!mounted) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2"
        style={{ gap: "var(--spacing-lg)" }}
      >
        {[1, 2].map((index) => (
          <StatCard key={index} title="Loading..." value="..." loading />
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD", // Assuming USD, adjust if currency is dynamic
    }).format(amount);
  };

  const statsData = [
    {
      title: "Revenue this month",
      value: formatCurrency(stats.revenueThisMonth),
      change: "-%", // Placeholder
    },
    {
      title: "Total Payout",
      value: formatCurrency(stats.totalPayout),
      change: "-%", // Placeholder
    },
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2"
      style={{ gap: "var(--spacing-lg)" }}
    >
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          loading={loading}
        />
      ))}
    </div>
  );
}
