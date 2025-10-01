"use client";

import { useState, useEffect } from "react";
import { fetchTopAffiliates } from "@/utils/api";

interface Affiliate {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  level: number;
  nationality: string;
  preferredLanguage: string;
  profile: {
    avatar: {
      url: string;
      key: string;
    };
    bio: string;
    headline: string;
    introVideo: string;
    expertiseTags: string[];
    socialLinks: {
      website: string;
      twitter: string;
      linkedin: string;
      facebook: string;
      instagram: string;
    };
  };
  referralCode: string;
  referrer: string | null;
  affiliateEarnings: number;
  earningsBalance: number;
  pendingBalance: number;
  walletBalance: number;
  completedMissions: any[];
  badges: any[];
  activityLog: any[];
  affiliateWithdrawals: any[];
  transactions: any[];
  streakCount: number;
  xp: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-red-500 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
          {affiliate.profile?.avatar?.url ? (
            <img
              src={affiliate.profile.avatar.url}
              alt={`${affiliate.firstName} ${affiliate.lastName}`}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {affiliate.firstName?.charAt(0)}
                {affiliate.lastName?.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--text-primary)] truncate">
            {affiliate.firstName} {affiliate.lastName}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] truncate">
            @{affiliate.username}
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="text-sm font-medium text-[var(--accent-green)]">
              ${affiliate.affiliateEarnings} Earnings
            </span>
          <span className="text-sm font-medium text-[var(--accent-purple)]">
              Level {affiliate.level}
            </span>
            <span className="text-sm font-medium text-[var(--accent-yellow)]">
              {affiliate.completedMissions?.length || 0} Missions
          </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TopAffiliates() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTopAffiliates = async () => {
      try {
        setLoading(true);
        console.log("Fetching top performing affiliates...");

        const response = await fetchTopAffiliates();

        console.log("=== TOP AFFILIATES RESPONSE ===");
        console.log("Response:", response);
        console.log("Affiliates data:", response.data);
        console.log("=============================");

        // Handle the correct data structure from your backend
        console.log("Response structure:", response);
        console.log("Response.data:", response.data);
        console.log("Response.data.data:", response.data?.data);
        console.log("Type of response.data.data:", typeof response.data?.data);
        console.log("Is array:", Array.isArray(response.data?.data));

        // Access the nested data structure: response.data.data
        const affiliatesData = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        console.log("Final affiliates data:", affiliatesData);
        setAffiliates(affiliatesData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch top affiliates:", err);
        setError("Failed to load top affiliates");
      } finally {
        setLoading(false);
      }
    };

    loadTopAffiliates();
  }, []);

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
        {loading ? (
          <div className="text-center text-[var(--text-secondary)] py-8">
            Loading top affiliates...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : !Array.isArray(affiliates) || affiliates.length === 0 ? (
          <div className="text-center text-[var(--text-secondary)] py-8">
            No affiliates found
          </div>
        ) : (
          affiliates.map((affiliate) => (
            <AffiliateCard key={affiliate._id} affiliate={affiliate} />
          ))
        )}
      </div>
    </div>
  );
}
