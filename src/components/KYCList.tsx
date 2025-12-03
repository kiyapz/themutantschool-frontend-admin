"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { MoreHorizontal, Eye, Check, X, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import adminApi from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

interface KYC {
  _id: string;
  userId: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  fullName: string;
  email?: string;
  role?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt?: string;
  date?: string;
  createdAt?: string;
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  swiftCode?: string;
  bankCountry?: string;
  phoneNumber?: string;
  documentType?: string;
  proofFrontUrl?: string;
  proofBackUrl?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string | null;
}

interface StatusTagProps {
  status: "pending" | "approved" | "rejected";
}

function StatusTag({ status }: StatusTagProps) {
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-[#2B2B2B] text-[#757575]";
      case "approved":
        return "bg-[#193024] text-[#38FF63]";
      case "rejected":
        return "bg-[#301B19] text-[#FF6338]";
      default:
        return "bg-[#2B2B2B] text-[#757575]";
    }
  };

  return (
    <span
      className={`rounded-full text-xs font-medium capitalize ${getStatusColor()}`}
      style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
    >
      {status}
    </span>
  );
}

function KYCRow({
  kyc,
  index,
  onClick,
  onToggleDropdown,
  isDropdownOpen,
  onApprove,
  onReject,
  onView,
  onDelete,
  isProcessing,
}: {
  kyc: KYC;
  index: number;
  onClick: () => void;
  onToggleDropdown: (kycId: string) => void;
  isDropdownOpen: boolean;
  onApprove: (kyc: KYC) => void;
  onReject: (kyc: KYC) => void;
  onView: (kyc: KYC) => void;
  onDelete: (kyc: KYC) => void;
  isProcessing: boolean;
}) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getUserName = () => {
    if (kyc.fullName) return kyc.fullName;
    if (typeof kyc.userId === "object" && kyc.userId) {
      return `${kyc.userId.firstName} ${kyc.userId.lastName}`;
    }
    if (typeof kyc.userId === "string") {
      return kyc.userId.slice(-6);
    }
    return "Unknown";
  };

  const getUserId = () => {
    if (typeof kyc.userId === "object" && kyc.userId) {
      return kyc.userId._id;
    }
    if (typeof kyc.userId === "string") {
      return kyc.userId;
    }
    return kyc._id;
  };

  const userName = getUserName();
  const userId = getUserId();

  return (
    <tr
      style={{ 
        borderBottom: "1px solid var(--border-primary)",
        position: "relative",
      }}
      className="hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
      onClick={onClick}
    >
      <td
        className="text-sm text-[var(--text-secondary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {index + 1}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        <div>
          <div className="font-medium">{userName}</div>
          {kyc.bankName && (
            <div className="text-xs text-[var(--text-secondary)]">
              {kyc.bankName}
            </div>
          )}
        </div>
      </td>
      <td
        className="text-sm text-[var(--text-primary)] font-mono"
        style={{ padding: "var(--spacing-md)" }}
      >
        {userId?.slice(-8) || "N/A"}
      </td>
      <td
        className="text-sm text-[var(--text-primary)] capitalize"
        style={{ padding: "var(--spacing-md)" }}
      >
        {kyc.documentType || "N/A"}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {formatDate(kyc.submittedAt || kyc.date || kyc.createdAt)}
      </td>
      <td style={{ padding: "var(--spacing-md)" }}>
        <StatusTag status={kyc.status} />
      </td>
      <td
        className="text-sm text-[var(--text-secondary)]"
        style={{ 
          padding: "var(--spacing-md)", 
          position: "relative",
          overflow: "visible",
        }}
      >
        <div 
          className="relative" 
          data-dropdown 
          style={{ 
            position: "relative", 
            zIndex: isDropdownOpen ? 1000 : "auto",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleDropdown(kyc._id);
            }}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="More Actions"
            style={{ position: "relative" }}
          >
            <MoreHorizontal size={20} />
          </button>

          {isDropdownOpen && (
            <div
              className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg shadow-lg"
              style={{ 
                minWidth: "180px",
                position: "absolute",
                right: 0,
                top: "calc(100% + var(--spacing-xs))",
                zIndex: 1001,
              }}
              data-dropdown
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(kyc);
                  }}
                  className="flex items-center w-full text-left text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                  style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                >
                  <Eye size={14} style={{ marginRight: "var(--spacing-sm)" }} />
                  View Details
                </button>

                {kyc.status === "pending" && (
                  <>
                    <div
                      style={{
                        height: "1px",
                        backgroundColor: "var(--border-primary)",
                        margin: "var(--spacing-xs) 0",
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onApprove(kyc);
                      }}
                      disabled={isProcessing}
                      className="flex items-center w-full text-left text-[var(--accent-green)] hover:bg-[var(--bg-tertiary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                    >
                      <Check
                        size={14}
                        style={{ marginRight: "var(--spacing-sm)" }}
                      />
                      Approve
                    </button>

                    <div
                      style={{
                        height: "1px",
                        backgroundColor: "var(--border-primary)",
                        margin: "var(--spacing-xs) 0",
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReject(kyc);
                      }}
                      disabled={isProcessing}
                      className="flex items-center w-full text-left text-[var(--accent-red)] hover:bg-[var(--bg-tertiary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                    >
                      <X size={14} style={{ marginRight: "var(--spacing-sm)" }} />
                      Reject
                    </button>
                  </>
                )}
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "var(--border-primary)",
                    margin: "var(--spacing-xs) 0",
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(kyc);
                  }}
                  disabled={isProcessing}
                  className="flex items-center w-full text-left text-[var(--accent-red)] hover:bg-[var(--bg-tertiary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default function KYCList() {
  const { user } = useAuth();
  const [kycList, setKycList] = useState<KYC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [selectedKyc, setSelectedKyc] = useState<KYC | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const fetchKYC = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("--- Fetching KYC ---");
      // Only send status filter if it's not "all"
      const statusParam = statusFilter === "all" ? "" : statusFilter;
      const response = await adminApi.get(
        `/kyc?${statusParam ? `status=${statusParam}&` : ""}page=${page}&limit=10`
      );
      console.log("KYC API Response:", response.data);

      // API returns: { message: "...", total: X, page: X, totalPages: X, data: [...] }
      // Check if data exists (response might have success or just data)
      if (response.data.data && Array.isArray(response.data.data)) {
        const kycArray: KYC[] = response.data.data;
        
        // Handle pagination from response
        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        } else if (response.data.total) {
          // Calculate from total and limit
          const total = response.data.total || 0;
          const limit = 10; // default limit
          setTotalPages(Math.ceil(total / limit));
        } else {
          setTotalPages(1);
        }

        console.log(`✅ Success! Found ${kycArray.length} KYC records.`);
        setKycList(kycArray);
      } else {
        console.error("❌ Invalid response structure:", response.data);
        setError("Failed to fetch KYC data - invalid response structure");
        setKycList([]);
      }
    } catch (err) {
      console.error("❌ Error fetching KYC:", err);
      setError("An error occurred while fetching KYC data.");
      setKycList([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchKYC();
    }
  }, [mounted, fetchKYC]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (dropdownOpen && !target.closest("[data-dropdown]")) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Auto-dismiss error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleRowClick = (kyc: KYC) => {
    setSelectedKyc(kyc);
  };

  const handleCloseModal = () => {
    setSelectedKyc(null);
    setCurrentStep(0); // Reset to first step when closing
  };

  const steps = [
    { id: 0, title: "Overview" },
    { id: 1, title: "User Info" },
    { id: 2, title: "Bank Details" },
    { id: 3, title: "Documents" },
    { id: 4, title: "Verification" },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleDropdown = (kycId: string) => {
    setDropdownOpen(dropdownOpen === kycId ? null : kycId);
  };

  const handleApprove = async (kyc: KYC) => {
    setDropdownOpen(null);
    if (!user?._id) {
      setError("Admin ID not found. Please log in again.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const userId = typeof kyc.userId === "object" ? kyc.userId._id : kyc.userId;
      console.log("Approving KYC for user:", userId);

      const response = await adminApi.patch(`/kyc/verify/${userId}`, {
        status: "approved",
        reason: "Documents verified and valid",
        adminId: user._id,
      });

      if (response.data.success) {
        setSuccessMessage("KYC approved successfully!");
        // Refresh the list after a short delay
        setTimeout(() => {
          fetchKYC();
          setSuccessMessage(null);
        }, 1500);
      } else {
        setError(response.data.error || "Failed to approve KYC");
      }
    } catch (err: unknown) {
      console.error("Error approving KYC:", err);
      const errorMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        (err as Error)?.message ||
        "An error occurred while approving KYC";
      setError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (kyc: KYC) => {
    setDropdownOpen(null);
    if (!user?._id) {
      setError("Admin ID not found. Please log in again.");
      return;
    }

    // Prompt for rejection reason
    const reason = prompt("Enter rejection reason:");
    if (!reason || reason.trim() === "") {
      return; // User cancelled or entered empty reason
    }

    setIsProcessing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const userId = typeof kyc.userId === "object" ? kyc.userId._id : kyc.userId;
      console.log("Rejecting KYC for user:", userId, "Reason:", reason);

      const response = await adminApi.patch(`/kyc/verify/${userId}`, {
        status: "rejected",
        reason: reason.trim(),
        adminId: user._id,
      });

      if (response.data.success) {
        setSuccessMessage("KYC rejected successfully!");
        // Refresh the list after a short delay
        setTimeout(() => {
          fetchKYC();
          setSuccessMessage(null);
        }, 1500);
      } else {
        setError(response.data.error || "Failed to reject KYC");
      }
    } catch (err: unknown) {
      console.error("Error rejecting KYC:", err);
      const errorMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        (err as Error)?.message ||
        "An error occurred while rejecting KYC";
      setError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (kyc: KYC) => {
    setDropdownOpen(null);
    if (!user?._id) {
      setError("Admin ID not found. Please log in again.");
      return;
    }

    // Confirm deletion
    const confirmed = confirm(
      `Are you sure you want to delete KYC for ${kyc.fullName}? This action cannot be undone.`
    );
    if (!confirmed) {
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const userId = typeof kyc.userId === "object" ? kyc.userId._id : kyc.userId;
      console.log("Deleting KYC for user:", userId);

      const response = await adminApi.delete(`/kyc/${userId}`);

      if (response.data.success) {
        setSuccessMessage("KYC deleted successfully!");
        // Refresh the list after a short delay
        setTimeout(() => {
          fetchKYC();
          setSuccessMessage(null);
        }, 1500);
      } else {
        setError(response.data.error || "Failed to delete KYC");
      }
    } catch (err: unknown) {
      console.error("Error deleting KYC:", err);
      const errorMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        (err as Error)?.message ||
        "An error occurred while deleting KYC";
      setError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleView = (kyc: KYC) => {
    setDropdownOpen(null);
    setSelectedKyc(kyc);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: "var(--spacing-lg)" }}>
        <div className="flex items-center bg-[#0C0C0C] rounded-lg p-1">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`text-sm font-medium cursor-pointer transition-colors rounded-md ${
                statusFilter === status
                  ? "text-white bg-[#A333CF]"
                  : "text-[#A5A5A5] hover:opacity-50"
              }`}
              style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="hidden md:block text-sm text-[var(--text-secondary)]">
          Showing {kycList.length} KYC records
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div
          className="mb-4 p-3 rounded-lg bg-[#193024] text-[#38FF63] text-sm"
          style={{ border: "1px solid #38FF63" }}
        >
          {successMessage}
        </div>
      )}
      {error && (
        <div
          className="mb-4 p-3 rounded-lg bg-[#301B19] text-[#FF6338] text-sm"
          style={{ border: "1px solid #FF6338" }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Loading KYC data...</div>
      ) : (
        <div style={{ overflowX: "auto", position: "relative", overflowY: "visible" }}>
          <table style={{ width: "100%", position: "relative" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border-primary)",
                }}
              >
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
                  User
                </th>
                <th
                  className="text-left text-sm font-medium text-[var(--text-secondary)]"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  KYC ID
                </th>
                <th
                  className="text-left text-sm font-medium text-[var(--text-secondary)]"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  Document Type
                </th>
                <th
                  className="text-left text-sm font-medium text-[var(--text-secondary)]"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  Submitted At
                </th>
                <th
                  className="text-left text-sm font-medium text-[var(--text-secondary)]"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  Status
                </th>
                <th
                  className="text-left text-sm font-medium text-[var(--text-secondary)]"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody style={{ position: "relative" }}>
              {kycList.length > 0 ? (
                kycList.map((kyc, index) => (
                  <KYCRow
                    key={kyc._id || index}
                    kyc={kyc}
                    index={index}
                    onClick={() => handleRowClick(kyc)}
                    onToggleDropdown={toggleDropdown}
                    isDropdownOpen={dropdownOpen === kyc._id}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onView={handleView}
                    onDelete={handleDelete}
                    isProcessing={isProcessing}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-[var(--text-secondary)]"
                  >
                    No KYC records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between"
          style={{ marginTop: "var(--spacing-lg)" }}
        >
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg font-medium"
            style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
          >
            Previous
          </button>
          <span className="text-sm text-[var(--text-secondary)]">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg font-medium"
            style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
          >
            Next
          </button>
        </div>
      )}

      {/* KYC Detail Modal - Step-based */}
      {selectedKyc && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
            padding: "var(--spacing-md)",
          }}
          onClick={handleCloseModal}
        >
          <div
            className="bg-[var(--bg-card)] w-full max-w-4xl rounded-2xl shadow-2xl"
            style={{
              border: "1px solid var(--border-primary)",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between"
              style={{
                borderBottom: "1px solid var(--border-primary)",
                padding: "var(--spacing-md) var(--spacing-lg)",
              }}
            >
              <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)]">
                KYC Details
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>
            </div>

            {/* Step Indicators */}
            <div
              className="overflow-x-auto"
              style={{
                borderBottom: "1px solid var(--border-primary)",
                padding: "var(--spacing-sm) var(--spacing-lg)",
              }}
            >
              <div className="flex items-center justify-center gap-1 min-w-max">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-shrink-0">
                    <button
                      onClick={() => setCurrentStep(step.id)}
                      className={`rounded-md text-xs md:text-sm font-medium transition-all whitespace-nowrap relative ${
                        currentStep === step.id
                          ? "bg-[#A333CF] text-white shadow-lg"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                      }`}
                      style={{
                        padding: "var(--spacing-xs) var(--spacing-sm)",
                        borderBottom:
                          currentStep === step.id
                            ? "2px solid #A333CF"
                            : "2px solid transparent",
                      }}
                    >
                      {step.title}
                      {currentStep === step.id && (
                        <div
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: "#A333CF",
                          }}
                        />
                      )}
                    </button>
                    {index < steps.length - 1 && (
                      <div
                        className="w-3 md:w-6 h-0.5 mx-0.5 md:mx-1 flex-shrink-0 transition-colors"
                        style={{
                          backgroundColor:
                            currentStep > step.id
                              ? "#A333CF"
                              : "var(--border-primary)",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div
              className="overflow-y-auto flex-1"
              style={{
                padding: "var(--spacing-lg)",
              }}
            >
              {currentStep === 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                    Overview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-[var(--text-secondary)] mb-2">
                        Status
                      </div>
                      <StatusTag status={selectedKyc.status} />
                    </div>
                    <div>
                      <div className="text-sm text-[var(--text-secondary)] mb-2">
                        Full Name
                      </div>
                      <div className="text-lg font-medium text-[var(--text-primary)]">
                        {selectedKyc.fullName}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-[var(--text-secondary)] mb-2">
                        Document Type
                      </div>
                      <div className="text-[var(--text-primary)] capitalize">
                        {selectedKyc.documentType || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-[var(--text-secondary)] mb-2">
                        Submitted At
                      </div>
                      <div className="text-[var(--text-primary)]">
                        {new Date(
                          selectedKyc.submittedAt ||
                            selectedKyc.date ||
                            selectedKyc.createdAt ||
                            ""
                        ).toLocaleString()}
                      </div>
                    </div>
                    {selectedKyc.verifiedAt && (
                      <div>
                        <div className="text-sm text-[var(--text-secondary)] mb-2">
                          Verified At
                        </div>
                        <div className="text-[var(--text-primary)]">
                          {new Date(selectedKyc.verifiedAt).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                    User Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-[var(--text-secondary)] mb-2">
                        Full Name
                      </div>
                      <div className="text-[var(--text-primary)]">
                        {selectedKyc.fullName}
                      </div>
                    </div>
                    {selectedKyc.email && (
                      <div>
                        <div className="text-sm text-[var(--text-secondary)] mb-2">
                          Email
                        </div>
                        <div className="text-[var(--text-primary)]">
                          {selectedKyc.email}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-[var(--text-secondary)] mb-2">
                        User ID
                      </div>
                      <div className="text-[var(--text-primary)] font-mono text-sm break-all">
                        {typeof selectedKyc.userId === "object"
                          ? selectedKyc.userId._id
                          : selectedKyc.userId}
                      </div>
                    </div>
                    {selectedKyc.role && (
                      <div>
                        <div className="text-sm text-[var(--text-secondary)] mb-2">
                          Role
                        </div>
                        <div className="text-[var(--text-primary)] capitalize">
                          {selectedKyc.role}
                        </div>
                      </div>
                    )}
                    {selectedKyc.phoneNumber && (
                      <div>
                        <div className="text-sm text-[var(--text-secondary)] mb-2">
                          Phone Number
                        </div>
                        <div className="text-[var(--text-primary)]">
                          {selectedKyc.phoneNumber}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                    Bank Details
                  </h3>
                  {selectedKyc.bankName ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-[var(--text-secondary)] mb-2">
                          Bank Name
                        </div>
                        <div className="text-[var(--text-primary)]">
                          {selectedKyc.bankName}
                        </div>
                      </div>
                      {selectedKyc.accountHolderName && (
                        <div>
                          <div className="text-sm text-[var(--text-secondary)] mb-2">
                            Account Holder Name
                          </div>
                          <div className="text-[var(--text-primary)]">
                            {selectedKyc.accountHolderName}
                          </div>
                        </div>
                      )}
                      {selectedKyc.accountNumber && (
                        <div>
                          <div className="text-sm text-[var(--text-secondary)] mb-2">
                            Account Number
                          </div>
                          <div className="text-[var(--text-primary)] font-mono">
                            {selectedKyc.accountNumber}
                          </div>
                        </div>
                      )}
                      {selectedKyc.swiftCode && (
                        <div>
                          <div className="text-sm text-[var(--text-secondary)] mb-2">
                            SWIFT Code
                          </div>
                          <div className="text-[var(--text-primary)] font-mono">
                            {selectedKyc.swiftCode}
                          </div>
                        </div>
                      )}
                      {selectedKyc.bankCountry && (
                        <div>
                          <div className="text-sm text-[var(--text-secondary)] mb-2">
                            Bank Country
                          </div>
                          <div className="text-[var(--text-primary)]">
                            {selectedKyc.bankCountry}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[var(--text-secondary)]">
                      No bank details available
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                    Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedKyc.proofFrontUrl ? (
                      <div>
                        <div className="text-sm text-[var(--text-secondary)] mb-3">
                          Front Document
                        </div>
                        <Image
                          src={selectedKyc.proofFrontUrl}
                          alt="Front Document"
                          width={800}
                          height={400}
                          className="w-full rounded-lg border border-[var(--border-primary)]"
                          style={{ maxHeight: "400px", objectFit: "contain" }}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center min-h-[200px] text-center text-[var(--text-secondary)] border border-[var(--border-primary)] rounded-lg">
                        Front document not available
                      </div>
                    )}
                    {selectedKyc.proofBackUrl ? (
                      <div>
                        <div className="text-sm text-[var(--text-secondary)] mb-3">
                          Back Document
                        </div>
                        <Image
                          src={selectedKyc.proofBackUrl}
                          alt="Back Document"
                          width={800}
                          height={400}
                          className="w-full rounded-lg border border-[var(--border-primary)]"
                          style={{ maxHeight: "400px", objectFit: "contain" }}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center min-h-[200px] text-center text-[var(--text-secondary)] border border-[var(--border-primary)] rounded-lg">
                        Back document not available
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                    Verification Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-[var(--text-secondary)] mb-2">
                        Status
                      </div>
                      <StatusTag status={selectedKyc.status} />
                    </div>
                    <div>
                      <div className="text-sm text-[var(--text-secondary)] mb-2">
                        Submitted At
                      </div>
                      <div className="text-[var(--text-primary)]">
                        {new Date(
                          selectedKyc.submittedAt ||
                            selectedKyc.date ||
                            selectedKyc.createdAt ||
                            ""
                        ).toLocaleString()}
                      </div>
                    </div>
                    {selectedKyc.verifiedAt && (
                      <div>
                        <div className="text-sm text-[var(--text-secondary)] mb-2">
                          Verified At
                        </div>
                        <div className="text-[var(--text-primary)]">
                          {new Date(selectedKyc.verifiedAt).toLocaleString()}
                        </div>
                      </div>
                    )}
                    {selectedKyc.verifiedBy && (
                      <div>
                        <div className="text-sm text-[var(--text-secondary)] mb-2">
                          Verified By
                        </div>
                        <div className="text-[var(--text-primary)] font-mono text-sm break-all">
                          {selectedKyc.verifiedBy}
                        </div>
                      </div>
                    )}
                    {selectedKyc.rejectionReason && (
                      <div className="md:col-span-2">
                        <div className="text-sm text-[var(--text-secondary)] mb-2">
                          Rejection Reason
                        </div>
                        <div
                          className="text-[var(--accent-red)] p-3 rounded-lg"
                          style={{
                            backgroundColor: "rgba(255, 99, 56, 0.1)",
                            border: "1px solid var(--accent-red)",
                          }}
                        >
                          {selectedKyc.rejectionReason}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <div
              className="flex items-center justify-between flex-wrap gap-2"
              style={{
                borderTop: "1px solid var(--border-primary)",
                padding: "var(--spacing-md) var(--spacing-lg)",
              }}
            >
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-1 md:gap-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-lg font-medium text-sm md:text-base border border-transparent hover:border-[#A333CF] active:scale-95"
                style={{
                  padding: "var(--spacing-xs) var(--spacing-sm)",
                  boxShadow:
                    currentStep > 0
                      ? "0 2px 4px rgba(163, 51, 207, 0.2)"
                      : "none",
                }}
              >
                <ChevronLeft
                  size={16}
                  className="md:w-[18px] md:h-[18px] transition-transform"
                  style={{
                    transform: currentStep > 0 ? "translateX(-2px)" : "none",
                  }}
                />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>
              <div className="text-xs md:text-sm text-[var(--text-secondary)] font-medium">
                Step {currentStep + 1} of {steps.length}
              </div>
              <button
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
                className="flex items-center gap-1 md:gap-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-lg font-medium text-sm md:text-base border border-transparent hover:border-[#A333CF] active:scale-95"
                style={{
                  padding: "var(--spacing-xs) var(--spacing-sm)",
                  boxShadow:
                    currentStep < steps.length - 1
                      ? "0 2px 4px rgba(163, 51, 207, 0.2)"
                      : "none",
                }}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight
                  size={16}
                  className="md:w-[18px] md:h-[18px] transition-transform"
                  style={{
                    transform:
                      currentStep < steps.length - 1
                        ? "translateX(2px)"
                        : "none",
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

