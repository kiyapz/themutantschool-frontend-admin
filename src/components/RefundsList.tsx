"use client";

import { useState, useEffect, useRef } from "react";
import { MoreHorizontal, Check, X, Eye, AlertCircle } from "lucide-react";
import adminApi from "@/utils/api";

const Dropdown = ({
  refund,
  onView,
  onApprove,
  onReject,
  isProcessing,
}: {
  refund: Refund;
  onView: (refund: Refund) => void;
  onApprove: (refund: Refund) => void;
  onReject: (refund: Refund) => void;
  isProcessing: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        title="More Actions"
        disabled={isProcessing}
      >
        <MoreHorizontal size={20} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-8 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg shadow-lg z-10"
          style={{ minWidth: "180px" }}
        >
          <div className="py-2">
            <button
              onClick={() => {
                onView(refund);
                setIsOpen(false);
              }}
              className="flex items-center w-full text-left text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              style={{ padding: "var(--spacing-md) var(--spacing-lg)" }}
            >
              <Eye size={14} style={{ marginRight: "var(--spacing-md)" }} />
              View Details
            </button>

            {refund.status === "pending" && (
              <>
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "var(--border-primary)",
                    margin: "var(--spacing-xs) 0",
                  }}
                />
                <button
                  onClick={() => {
                    onApprove(refund);
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full text-left text-[#38FF63] hover:bg-[var(--bg-tertiary)] transition-colors"
                  style={{ padding: "var(--spacing-md) var(--spacing-lg)" }}
                  disabled={isProcessing}
                >
                  <Check
                    size={14}
                    style={{ marginRight: "var(--spacing-md)" }}
                  />
                  Approve Refund
                </button>
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "var(--border-primary)",
                    margin: "var(--spacing-xs) 0",
                  }}
                />
                <button
                  onClick={() => {
                    onReject(refund);
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full text-left text-[var(--accent-red)] hover:bg-[var(--bg-tertiary)] transition-colors"
                  style={{ padding: "var(--spacing-md) var(--spacing-lg)" }}
                  disabled={isProcessing}
                >
                  <X size={14} style={{ marginRight: "var(--spacing-md)" }} />
                  Reject Refund
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export interface Refund {
  _id?: string;
  student?: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  enrollment?: {
    _id?: string;
    mission?: string;
    paymentInfo?: {
      amount: number;
      paidAt?: string;
      paymentIntent?: string;
      referenceId?: string;
    };
    progress?: {
      completedLevels?: any[];
      progressPercent?: number;
    };
    releaseDate?: string;
    createdAt?: string;
  };
  paymentIntentId?: string;
  sessionId?: string;
  reason?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
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

function RefundRow({
  refund,
  index,
  onClick,
  onApprove,
  onReject,
  onView,
  isProcessing,
}: {
  refund: Refund;
  index: number;
  onClick: () => void;
  onApprove: (refund: Refund) => void;
  onReject: (refund: Refund) => void;
  onView: (refund: Refund) => void;
  isProcessing: boolean;
}) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserName = () => {
    if (typeof refund.student === "object" && refund.student) {
      return `${refund.student.firstName} ${refund.student.lastName}`;
    }
    return refund.student?.slice(-8) || "N/A";
  };

  const getUserEmail = () => {
    if (typeof refund.student === "object" && refund.student) {
      return refund.student.email;
    }
    return "N/A";
  };

  const getAmount = () => {
    return refund.enrollment?.paymentInfo?.amount || 0;
  };

  const getProgressPercent = () => {
    return refund.enrollment?.progress?.progressPercent || 0;
  };

  const getTransactionId = () => {
    return refund.sessionId || refund.paymentIntentId || "N/A";
  };

  return (
    <tr
      style={{ borderBottom: "1px solid var(--border-primary)" }}
      className="hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
      onClick={(e) => {
        // Don't trigger row click if clicking on dropdown or action buttons
        if ((e.target as Element).closest("[data-dropdown]") || (e.target as Element).closest("button")) {
          return;
        }
        onClick();
      }}
    >
      <td
        className="text-xs sm:text-sm text-[var(--text-secondary)]"
        style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
      >
        {index + 1}
      </td>
      <td
        className="text-xs sm:text-sm text-[var(--text-primary)] font-mono hidden md:table-cell"
        style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
      >
        {refund._id ? refund._id.slice(-8) : "N/A"}
      </td>
      <td
        className="text-xs sm:text-sm text-[var(--text-primary)] font-mono hidden lg:table-cell"
        style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
      >
        {getTransactionId() !== "N/A" ? getTransactionId().slice(-8) : "N/A"}
      </td>
      <td
        className="text-xs sm:text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
      >
        <div>
          <div className="font-medium">{getUserName()}</div>
          <div className="text-xs text-[var(--text-secondary)] hidden sm:block">
            {getUserEmail()}
          </div>
        </div>
      </td>
      <td
        className="text-xs sm:text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
      >
        <div className="font-medium">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(getAmount())}
        </div>
      </td>
      <td
        className="text-xs sm:text-sm text-[var(--text-primary)] hidden sm:table-cell"
        style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
      >
        <div className="flex items-center gap-2">
          <div className="font-medium text-xs">{getProgressPercent()}%</div>
          <div className="flex-1 bg-[#2B2B2B] rounded-full h-2" style={{ maxWidth: "60px" }}>
            <div
              className="bg-[#A333CF] h-2 rounded-full transition-all"
              style={{ width: `${getProgressPercent()}%` }}
            />
          </div>
        </div>
      </td>
      <td
        className="text-xs sm:text-sm text-[var(--text-primary)] hidden md:table-cell"
        style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
      >
        <div className="truncate max-w-[150px]" title={refund.reason || "N/A"}>
          {refund.reason || "N/A"}
        </div>
      </td>
      <td
        className="text-xs sm:text-sm text-[var(--text-secondary)] hidden lg:table-cell"
        style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
      >
        {formatDate(refund.createdAt)}
      </td>
      <td className="text-xs sm:text-sm" style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}>
        <StatusTag status={refund.status} />
      </td>
      <td
        className="text-xs sm:text-sm text-[var(--text-secondary)]"
        style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
      >
        <Dropdown
          refund={refund}
          onView={onView}
          onApprove={onApprove}
          onReject={onReject}
          isProcessing={isProcessing}
        />
      </td>
    </tr>
  );
}

export default function RefundsList() {
  const [refundsList, setRefundsList] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [mounted, setMounted] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchRefunds();
    }
  }, [mounted, statusFilter]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Check if click is outside the dropdown container
      // Also check if it's not a button that toggles the dropdown
      if (false && !target.closest("[data-dropdown]")) { // This line was removed as per the edit hint
        // setDropdownOpen(null); // This line was removed as per the edit hint
      }
    };

    // Use a slight delay to ensure the toggle click completes first
    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside, true);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []); // This useEffect was removed as per the edit hint

  // Auto-dismiss messages after 5 seconds
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  const fetchRefunds = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("--- Fetching Refunds ---");
      const statusParam = statusFilter === "all" ? "" : statusFilter;
      const response = await adminApi.get(
        `/payment/refund${statusParam ? `?status=${statusParam}` : ""}`
      );
      console.log("Refunds API Response:", response.data);

      // Handle different response formats
      let refundsArray: Refund[] = [];
      
      if (response.data.success && Array.isArray(response.data.data)) {
        // Format: { success: true, data: [...] }
        refundsArray = response.data.data;
      } else if (Array.isArray(response.data.data)) {
        // Format: { data: [...] }
        refundsArray = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Format: [...] (direct array)
        refundsArray = response.data;
      } else if (response.data.refunds && Array.isArray(response.data.refunds)) {
        // Format: { refunds: [...] }
        refundsArray = response.data.refunds;
      } else {
        console.error("❌ Invalid response structure:", response.data);
        setError("Failed to fetch refunds data - invalid response structure");
        setRefundsList([]);
        return;
      }

      console.log(`✅ Success! Found ${refundsArray.length} refund requests.`);
      setRefundsList(refundsArray);
    } catch (err) {
      console.error("❌ Error fetching refunds:", err);
      setError("An error occurred while fetching refunds data.");
      setRefundsList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (refund: Refund) => {
    setSelectedRefund(refund);
  };

  const handleCloseModal = () => {
    setSelectedRefund(null);
  };

  const handleApprove = async (refund: Refund) => {
    if (!refund._id) {
      setError("Refund ID is missing. Cannot approve refund.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      console.log("Approving refund:", refund._id);

      const response = await adminApi.put(`/payment/refund/${refund._id}/approve`);

      if (response.data.success) {
        setSuccessMessage("Refund approved successfully!");
        setTimeout(() => {
          fetchRefunds();
          setSuccessMessage(null);
        }, 1500);
      } else {
        setError(response.data.error || "Failed to approve refund");
      }
    } catch (err: any) {
      console.error("Error approving refund:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "An error occurred while approving refund";
      setError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (refund: Refund) => {
    if (!refund._id) {
      setError("Refund ID is missing. Cannot reject refund.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      console.log("Rejecting refund:", refund._id);

      const response = await adminApi.put(`/payment/refund/${refund._id}/reject`);

      if (response.data.success) {
        setSuccessMessage("Refund rejected successfully!");
        setTimeout(() => {
          fetchRefunds();
          setSuccessMessage(null);
        }, 1500);
      } else {
        setError(response.data.error || "Failed to reject refund");
      }
    } catch (err: any) {
      console.error("Error rejecting refund:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "An error occurred while rejecting refund";
      setError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleView = (refund: Refund) => {
    setSelectedRefund(refund);
  };

  const filteredRefunds = statusFilter === "all" 
    ? refundsList 
    : refundsList.filter((refund) => refund.status === statusFilter);

  if (!mounted) {
    return (
      <div className="text-center py-10 text-[var(--text-secondary)]">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ marginBottom: "var(--spacing-lg)" }}
      >
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
          Refund Requests
        </h1>
      </div>

      {/* Status Messages */}
      {error && (
        <div
          className="mb-4 p-4 rounded-lg bg-[#301B19] text-[#FF6338] border border-[#FF6338]"
          style={{ marginBottom: "var(--spacing-md)" }}
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          className="mb-4 p-4 rounded-lg bg-[#193024] text-[#38FF63] border border-[#38FF63]"
          style={{ marginBottom: "var(--spacing-md)" }}
        >
          {successMessage}
        </div>
      )}

      {/* Filters */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ marginBottom: "var(--spacing-lg)" }}
      >
        <div className="flex items-center bg-[#0C0C0C] rounded-lg p-1 flex-wrap gap-1">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-xs sm:text-sm font-medium cursor-pointer transition-colors rounded-md capitalize ${
                statusFilter === status
                  ? "text-white bg-[#A333CF]"
                  : "text-[#A5A5A5] hover:opacity-50"
              }`}
              style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Showing {filteredRefunds.length} refund{filteredRefunds.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-[var(--text-secondary)]">
          Loading refunds...
        </div>
      ) : (
        <div className="w-full overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <table className="w-full min-w-[800px]">
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border-primary)",
                }}
              >
                <th
                  className="text-left text-xs sm:text-sm font-medium text-[var(--text-secondary)]"
                  style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                >
                  #
                </th>
                <th
                  className="text-left text-xs sm:text-sm font-medium text-[var(--text-secondary)] hidden md:table-cell"
                  style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                >
                  Refund ID
                </th>
                <th
                  className="text-left text-xs sm:text-sm font-medium text-[var(--text-secondary)] hidden lg:table-cell"
                  style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                >
                  Transaction ID
                </th>
                <th
                  className="text-left text-xs sm:text-sm font-medium text-[var(--text-secondary)]"
                  style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                >
                  Student
                </th>
                <th
                  className="text-left text-xs sm:text-sm font-medium text-[var(--text-secondary)]"
                  style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                >
                  Amount
                </th>
                <th
                  className="text-left text-xs sm:text-sm font-medium text-[var(--text-secondary)] hidden sm:table-cell"
                  style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                >
                  Progress
                </th>
                <th
                  className="text-left text-xs sm:text-sm font-medium text-[var(--text-secondary)] hidden md:table-cell"
                  style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                >
                  Reason
                </th>
                <th
                  className="text-left text-xs sm:text-sm font-medium text-[var(--text-secondary)] hidden lg:table-cell"
                  style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                >
                  Requested Date
                </th>
                <th
                  className="text-left text-xs sm:text-sm font-medium text-[var(--text-secondary)]"
                  style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                >
                  Status
                </th>
                <th
                  className="text-left text-xs sm:text-sm font-medium text-[var(--text-secondary)]"
                  style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRefunds.length > 0 ? (
                filteredRefunds.map((refund, index) => (
                  <RefundRow
                    key={refund._id || `refund-${index}`}
                    refund={refund}
                    index={index}
                    onClick={() => handleRowClick(refund)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onView={handleView}
                    isProcessing={isProcessing}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-10 text-[var(--text-secondary)]"
                  >
                    No refund requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Refund Detail Modal */}
      {selectedRefund && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[100] p-4"
          style={{
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
          }}
          onClick={handleCloseModal}
        >
          <div
            className="bg-[var(--bg-card)] rounded-2xl shadow-2xl max-h-[90vh] w-full max-w-[600px] flex flex-col overflow-hidden"
            style={{
              border: "1px solid var(--border-primary)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--border-primary)] flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                Refund Details
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="overflow-y-auto scrollbar-hide flex-1" style={{ padding: "24px" }}>
              <div style={{ paddingBottom: "16px", paddingTop: "16px" }}>
                <label className="text-sm text-[var(--text-secondary)]" style={{ display: "block", marginBottom: "8px" }}>
                  Refund ID
                </label>
                <p className="text-[var(--text-primary)] font-mono" style={{ margin: 0 }}>
                  {selectedRefund._id || "N/A"}
                </p>
              </div>

              <div style={{ paddingBottom: "16px", paddingTop: "16px" }}>
                <label className="text-sm text-[var(--text-secondary)]" style={{ display: "block", marginBottom: "8px" }}>
                  Transaction ID
                </label>
                <p className="text-[var(--text-primary)] font-mono" style={{ margin: 0 }}>
                  {selectedRefund.sessionId || selectedRefund.paymentIntentId || "N/A"}
                </p>
              </div>

              <div style={{ paddingBottom: "16px", paddingTop: "16px" }}>
                <label className="text-sm text-[var(--text-secondary)]" style={{ display: "block", marginBottom: "8px" }}>
                  Student
                </label>
                <p className="text-[var(--text-primary)]" style={{ margin: 0 }}>
                  {typeof selectedRefund.student === "object"
                    ? `${selectedRefund.student.firstName} ${selectedRefund.student.lastName} (${selectedRefund.student.email})`
                    : selectedRefund.student || "N/A"}
                </p>
              </div>

              <div style={{ paddingBottom: "16px", paddingTop: "16px" }}>
                <label className="text-sm text-[var(--text-secondary)]" style={{ display: "block", marginBottom: "8px" }}>
                  Amount
                </label>
                <p className="text-[var(--text-primary)] font-medium text-lg" style={{ margin: 0 }}>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(selectedRefund.enrollment?.paymentInfo?.amount || 0)}
                </p>
              </div>

              <div style={{ paddingBottom: "16px", paddingTop: "16px" }}>
                <label className="text-sm text-[var(--text-secondary)]" style={{ display: "block", marginBottom: "8px" }}>
                  Progress
                </label>
                <div style={{ marginTop: "8px" }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: "4px" }}>
                    <span className="text-[var(--text-primary)] font-medium">
                      {selectedRefund.enrollment?.progress?.progressPercent || 0}%
                    </span>
                  </div>
                  <div className="flex-1 bg-[#2B2B2B] rounded-full h-2" style={{ maxWidth: "200px" }}>
                    <div
                      className="bg-[#A333CF] h-2 rounded-full transition-all"
                      style={{ width: `${selectedRefund.enrollment?.progress?.progressPercent || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ paddingBottom: "16px", paddingTop: "16px" }}>
                <label className="text-sm text-[var(--text-secondary)]" style={{ display: "block", marginBottom: "8px" }}>
                  Reason
                </label>
                <p className="text-[var(--text-primary)]" style={{ margin: 0 }}>
                  {selectedRefund.reason || "N/A"}
                </p>
              </div>

              <div style={{ paddingBottom: "16px", paddingTop: "16px" }}>
                <label className="text-sm text-[var(--text-secondary)]" style={{ display: "block", marginBottom: "8px" }}>
                  Status
                </label>
                <div style={{ marginTop: "4px" }}>
                  <StatusTag status={selectedRefund.status} />
                </div>
              </div>

              <div style={{ paddingBottom: "16px", paddingTop: "16px" }}>
                <label className="text-sm text-[var(--text-secondary)]" style={{ display: "block", marginBottom: "8px" }}>
                  Requested Date
                </label>
                <p className="text-[var(--text-primary)]" style={{ margin: 0 }}>
                  {new Date(selectedRefund.createdAt).toLocaleString()}
                </p>
              </div>

              {selectedRefund.rejectionReason && (
                <div style={{ paddingBottom: "16px", paddingTop: "16px" }}>
                  <label className="text-sm text-[var(--text-secondary)]" style={{ display: "block", marginBottom: "8px" }}>
                    Rejection Reason
                  </label>
                  <p className="text-[var(--accent-red)]" style={{ margin: 0 }}>
                    {selectedRefund.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {/* This block is removed as per the edit hint */}
    </div>
  );
}

