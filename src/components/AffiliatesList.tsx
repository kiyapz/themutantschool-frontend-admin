"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import adminApi from "@/utils/api";

interface Affiliate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile: {
    avatar?: {
      url: string;
      key: string;
    };
    phone?: string;
    country?: string;
    city?: string;
    bio?: string;
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      behance?: string;
      dribbble?: string;
      medium?: string;
      kaggle?: string;
      dev?: string;
    };
  };
  affiliateEarnings: number;
  affiliateWithdrawals: Array<{
    _id: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
  earningsBalance: number;
  pendingBalance: number;
  walletBalance: number;
  level: number;
  completedMissions: Array<{
    _id: string;
    title: string;
    completedAt: string;
  }>;
  // Add computed fields for display
  name: string;
  location: string;
  referrals: number;
  enrolments: number;
  commissions: string;
  cashout: string;
}

function AffiliateRow({
  affiliate,
  onClick,
  onDelete,
  onToggleDropdown,
  isDropdownOpen,
}: {
  affiliate: Affiliate;
  onClick: () => void;
  onDelete: (affiliateId: string, affiliateName: string) => void;
  onToggleDropdown: (affiliateId: string) => void;
  isDropdownOpen: boolean;
}) {
  return (
    <tr
      onClick={onClick}
      style={{
        borderBottom: "1px solid var(--border-primary)",
        cursor: "pointer",
      }}
      className="hover:bg-[var(--bg-tertiary)] transition-colors"
    >
      <td
        className="text-sm text-[var(--text-secondary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {affiliate._id.slice(-6)}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        <div className="flex items-center gap-3">
          {affiliate.profile?.avatar?.url ? (
            <Image
              src={affiliate.profile.avatar.url}
              alt={affiliate.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[var(--accent-purple)] flex items-center justify-center text-white text-xs font-medium">
              {affiliate.firstName.charAt(0)}
              {affiliate.lastName.charAt(0)}
            </div>
          )}
        <div>
          <div className="font-medium">{affiliate.name}</div>
          <div className="text-xs text-[var(--text-secondary)]">
              {affiliate.email}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">
              Balance: ${affiliate.earningsBalance.toFixed(2)}
            </div>
          </div>
        </div>
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {affiliate.referrals}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {affiliate.enrolments}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        <div>{affiliate.commissions}</div>
        <div className="text-xs text-[var(--text-secondary)]">
          Cashout: {affiliate.cashout}
        </div>
      </td>
      <td
        className="text-sm text-[var(--text-secondary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        <div className="relative" data-dropdown>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleDropdown(affiliate._id);
            }}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="More Actions"
          >
          <MoreHorizontal size={20} />
        </button>

          {isDropdownOpen && (
            <div
              className="absolute right-0 top-8 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg shadow-lg z-10"
              style={{ minWidth: "160px" }}
              data-dropdown
            >
              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(
                      affiliate._id,
                      `${affiliate.firstName} ${affiliate.lastName}`
                    );
                  }}
                  className="flex items-center w-full text-left text-[var(--accent-red)] hover:bg-[var(--bg-tertiary)] transition-colors"
                  style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                >
                  <Trash2
                    size={14}
                    style={{ marginRight: "var(--spacing-sm)" }}
                  />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function AffiliatesList() {
  const router = useRouter();
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    affiliateId: string | null;
    affiliateName: string;
  }>({
    show: false,
    affiliateId: null,
    affiliateName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAffiliateClick = (affiliate: Affiliate) => {
    // Clear any existing user data in localStorage
    localStorage.removeItem("selectedInstructor");
    localStorage.removeItem("selectedStudent");

    // Store the affiliate data in localStorage
    localStorage.setItem("selectedAffiliate", JSON.stringify(affiliate));

    // Navigate to profile page
    router.push("/profile");
  };

  const handleDeleteAffiliate = (
    affiliateId: string,
    affiliateName: string
  ) => {
    setDeleteModal({
      show: true,
      affiliateId,
      affiliateName,
    });
  };

  const confirmDeleteAffiliate = async () => {
    if (!deleteModal.affiliateId) return;

    try {
      setIsDeleting(true);
      setError(null);
      setSuccessMessage(null);

      console.log("Deleting affiliate:", deleteModal.affiliateId);
      const response = await adminApi.delete(
        `/users/users/${deleteModal.affiliateId}`
      );

      if (response.status === 200) {
        console.log("Affiliate deleted successfully");
        // Remove the affiliate from the local state
        setAffiliates((prevAffiliates) =>
          prevAffiliates.filter((a) => a._id !== deleteModal.affiliateId)
        );
        setDeleteModal({ show: false, affiliateId: null, affiliateName: "" });
        setDropdownOpen(null);
        setSuccessMessage("Affiliate deleted successfully!");

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        console.error("Failed to delete affiliate:", response.data);
        setError("Failed to delete affiliate. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting affiliate:", err);
      setError("Error deleting affiliate. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteAffiliate = () => {
    setDeleteModal({ show: false, affiliateId: null, affiliateName: "" });
  };

  const toggleDropdown = (affiliateId: string) => {
    console.log("Toggling dropdown for affiliate:", affiliateId);
    console.log("Current dropdown open:", dropdownOpen);
    setDropdownOpen(dropdownOpen === affiliateId ? null : affiliateId);
  };

  useEffect(() => {
    setMounted(true);

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (dropdownOpen && !target.closest("[data-dropdown]")) {
        console.log("Clicking outside dropdown, closing it");
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    setMounted(true);
    const fetchAffiliates = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("=== FETCHING AFFILIATES FROM BACKEND ===");
        console.log("Using endpoint: /api/admin/users/affiliates");
        console.log("Full URL will be: /api/admin/users/affiliates");
        console.log("Admin API base URL:", adminApi.defaults?.baseURL);
        console.log("Admin API headers:", adminApi.defaults?.headers);
        console.log(
          "Token from localStorage:",
          localStorage.getItem("login-accessToken")
        );

        console.log("Making API call...");

        // Test the API route directly first
        console.log("Testing API route accessibility...");
        try {
          const testResponse = await fetch("/api/admin/users/affiliates", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "login-accessToken"
              )}`,
              "Content-Type": "application/json",
            },
          });
          console.log("Direct fetch test - Status:", testResponse.status);
          console.log(
            "Direct fetch test - Headers:",
            Object.fromEntries(testResponse.headers.entries())
          );
          if (testResponse.ok) {
            const testData = await testResponse.json();
            console.log("Direct fetch test - Data:", testData);
          } else {
            const errorText = await testResponse.text();
            console.log("Direct fetch test - Error:", errorText);
          }
        } catch (testError) {
          console.log("Direct fetch test - Error:", testError);
        }

        const response = await adminApi.get("/users/affiliates");
        console.log("=== API CALL SUCCESSFUL ===");
        console.log("Response status:", response.status);
        console.log("Response status text:", response.statusText);
        console.log("Response headers:", response.headers);
        console.log("Response config:", response.config);
        console.log("=== COMPLETE AFFILIATES API RESPONSE ===");
        console.log("Affiliates API Response:", response.data);
        console.log("Response data type:", typeof response.data);
        console.log("Response data keys:", Object.keys(response.data));
        console.log("Response success:", response.data.success);
        console.log("Response message:", response.data.message);
        console.log("Response status:", response.data.status);
        console.log("Response pagination:", response.data.pagination);

        if (response.data.success) {
          // The array is in response.data.data.data
          const affiliatesData = response.data.data?.data;
          console.log("Affiliates data:", affiliatesData);
          console.log("Affiliates data type:", typeof affiliatesData);
          console.log(
            "Affiliates data is array:",
            Array.isArray(affiliatesData)
          );

          if (Array.isArray(affiliatesData)) {
            console.log("Affiliates count:", affiliatesData.length);
            console.log("=== INDIVIDUAL AFFILIATES ===");
            affiliatesData.forEach((affiliate: Affiliate, index: number) => {
              console.log(`Affiliate ${index + 1}:`, {
                _id: affiliate._id,
                firstName: affiliate.firstName,
                lastName: affiliate.lastName,
                username: affiliate.username,
                email: affiliate.email,
                isActive: affiliate.isActive,
                isVerified: affiliate.isVerified,
                createdAt: affiliate.createdAt,
                affiliateEarnings: affiliate.affiliateEarnings,
                earningsBalance: affiliate.earningsBalance,
                pendingBalance: affiliate.pendingBalance,
                walletBalance: affiliate.walletBalance,
                level: affiliate.level,
                completedMissions: affiliate.completedMissions,
                profile: affiliate.profile,
              });
            });

            // Transform backend data to match our interface
            console.log("=== TRANSFORMING AFFILIATE DATA ===");
            const transformedAffiliates = affiliatesData.map(
              (affiliate: Affiliate, index: number) => {
                console.log(`Transforming affiliate ${index + 1}:`, affiliate);

                const transformed = {
                  ...affiliate,
                  name: `${affiliate.firstName} ${affiliate.lastName}`,
                  location: `${affiliate.profile?.city || "Unknown"}, ${
                    affiliate.profile?.country || "Unknown"
                  }`,
                  referrals: affiliate.completedMissions?.length || 0,
                  enrolments: affiliate.completedMissions?.length || 0,
                  commissions: `$${
                    affiliate.affiliateEarnings?.toFixed(2) || "0.00"
                  }`,
                  cashout: `$${
                    affiliate.affiliateWithdrawals
                      ?.reduce(
                        (sum: number, withdrawal: { amount: number }) =>
                          sum + (withdrawal.amount || 0),
                        0
                      )
                      .toFixed(2) || "0.00"
                  }`,
                };

                console.log(`Transformed affiliate ${index + 1}:`, transformed);
                return transformed;
              }
            );

            console.log("=== TRANSFORMATION COMPLETE ===");
            console.log(
              "Transformed affiliates count:",
              transformedAffiliates.length
            );
            console.log("Transformed affiliates:", transformedAffiliates);
            console.log("Setting affiliates state...");
            setAffiliates(transformedAffiliates);
            console.log("=== AFFILIATES FETCH COMPLETE ===");
          } else {
            console.error("❌ ERROR: Affiliates data is not an array!");
            console.error("Affiliates data:", affiliatesData);
            console.error("Data type:", typeof affiliatesData);
            console.error("Is array:", Array.isArray(affiliatesData));
            console.error("Full response structure:", response.data);
            setError("Invalid data format received from server");
          }
        } else {
          console.error("Failed to fetch affiliates - no success");
          setError("Failed to fetch affiliates");
        }
      } catch (err: unknown) {
        console.error("=== AFFILIATES FETCH ERROR ===");
        console.error("Error type:", typeof err);
        console.error("Error object:", err);

        if (err instanceof Error) {
          console.error("Error message:", err.message);
          console.error("Error stack:", err.stack);
        }

        if (err && typeof err === "object" && "response" in err) {
          const axiosError = err as {
            response?: { status?: number; data?: unknown; headers?: unknown };
          };
          console.error("Axios error response:", axiosError.response);
          console.error("Axios error status:", axiosError.response?.status);
          console.error("Axios error data:", axiosError.response?.data);
          console.error("Axios error headers:", axiosError.response?.headers);
        }

        if (err && typeof err === "object" && "request" in err) {
          const axiosError = err as { request?: unknown };
          console.error("Axios request error:", axiosError.request);
        }

        console.error("=== END AFFILIATES FETCH ERROR ===");

        const errorMessage =
          err instanceof Error && "response" in err
            ? (err as { response?: { data?: { error?: string } } }).response
                ?.data?.error || "Failed to fetch affiliates"
            : "Failed to fetch affiliates";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliates();
  }, []);

  if (!mounted) {
    return (
      <div className="bg-[var(--bg-card)] rounded-lg">
        <div
          className="flex items-center justify-center"
          style={{ padding: "var(--spacing-2xl)" }}
        >
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[var(--text-secondary)] mt-4">
              Loading affiliates...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[var(--bg-card)] rounded-lg">
        <div
          className="flex items-center justify-center"
          style={{ padding: "var(--spacing-2xl)" }}
        >
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[var(--text-secondary)] mt-4">
              Loading affiliates...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--bg-card)] rounded-lg">
        <div
          className="flex items-center justify-center"
          style={{ padding: "var(--spacing-2xl)" }}
        >
          <div className="text-center">
            <p className="text-[var(--text-error)] mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[var(--accent-purple)] text-white px-4 py-2 rounded-lg hover:bg-[var(--accent-purple-light)] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] rounded-lg">
      <div
        className="flex items-center justify-between"
        style={{ padding: "var(--spacing-lg)" }}
      >
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Affiliate List
        </h2>
        <div className="flex items-center" style={{ gap: "var(--spacing-sm)" }}>
          <button
            className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--border-secondary)] transition-colors"
            style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
          >
            Filter
          </button>
          <select
            className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg focus:outline-none"
            style={{
              padding: "var(--spacing-sm) var(--spacing-md)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <option>Sort By: Oldest to Newest</option>
            <option>Sort By: Newest to Oldest</option>
            <option>Sort By: Name A-Z</option>
            <option>Sort By: Name Z-A</option>
          </select>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
          style={{ marginBottom: "var(--spacing-md)" }}
        >
          {successMessage}
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-primary)" }}>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                #
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Affiliates
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Referrals
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Enrolments
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Commissions
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {affiliates.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-[var(--text-secondary)]"
                  style={{ padding: "var(--spacing-2xl)" }}
                >
                  No affiliates found
                </td>
              </tr>
            ) : (
              affiliates.map((affiliate) => (
                <AffiliateRow
                  key={affiliate._id}
                  affiliate={affiliate}
                  onClick={() => handleAffiliateClick(affiliate)}
                  onDelete={handleDeleteAffiliate}
                  onToggleDropdown={toggleDropdown}
                  isDropdownOpen={dropdownOpen === affiliate._id}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "var(--spacing-lg)",
          borderTop: "1px solid var(--border-primary)",
        }}
      >
        <div className="text-sm text-[var(--text-secondary)]">
          Showing {affiliates.length} of {affiliates.length} entries
        </div>
        <div className="flex items-center" style={{ gap: "var(--spacing-sm)" }}>
          <button
            className="text-sm text-[var(--text-muted)] bg-[var(--bg-tertiary)] rounded-lg cursor-not-allowed"
            style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
          >
            Previous
          </button>
          <button
            className="text-sm text-white bg-[var(--accent-purple)] rounded-lg hover:bg-[var(--accent-purple-light)] transition-colors"
            style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
          >
            Next &gt;
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[100]"
          style={{
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="bg-[var(--bg-card)] rounded-2xl shadow-2xl"
            style={{
              width: "90%",
              maxWidth: "400px",
              padding: "var(--spacing-xl)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <h3
              className="text-xl font-bold text-[var(--text-primary)]"
              style={{ marginBottom: "var(--spacing-md)" }}
            >
              Delete Affiliate
            </h3>
            <p
              className="text-sm text-[var(--text-secondary)]"
              style={{ marginBottom: "var(--spacing-xl)" }}
            >
              Are you sure you want to delete &quot;{deleteModal.affiliateName}
              &quot;? This action cannot be undone.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--spacing-sm)",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={cancelDeleteAffiliate}
                className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors rounded-lg font-medium"
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAffiliate}
                disabled={isDeleting}
                className={`${
                  isDeleting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[var(--accent-red)] hover:bg-red-600"
                } text-white transition-colors rounded-lg font-medium`}
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
