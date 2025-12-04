"use client";

import { useState, useEffect } from "react";
import { Plus, MoreHorizontal, Edit, Trash2, X } from "lucide-react";
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  listCoupons,
} from "@/utils/api";

interface Coupon {
  _id?: string;
  id?: string;
  code: string;
  discountType: "percentage";
  discountValue: number;
  status: "active" | "inactive";
  applyToAllMissions?: boolean;
  maxUsage?: number;
  maxUsagePerUser?: number;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  minOrderAmount?: number;
  eligibleMissions?: string[];
  eligibleUsers?: string;
  usageCount?: number;
  __v?: number;
}

interface StatusTagProps {
  status: "active" | "inactive";
}

function StatusTag({ status }: StatusTagProps) {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-[#193024] text-[#38FF63]";
      case "inactive":
        return "bg-[#2B2B2B] text-[#757575]";
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

function CouponRow({
  coupon,
  index,
  onEdit,
  onDelete,
  onToggleDropdown,
  isDropdownOpen,
}: {
  coupon: Coupon;
  index: number;
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
  onToggleDropdown: (couponId: string) => void;
  isDropdownOpen: boolean;
}) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const couponId = coupon._id || coupon.id || index.toString();

  return (
    <tr
      style={{ borderBottom: "none" }}
      className="hover:bg-[var(--bg-tertiary)] transition-colors"
    >
      <td
        className="text-sm text-[var(--text-secondary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {index + 1}
      </td>
      <td
        className="text-sm text-[var(--text-primary)] font-mono font-medium"
        style={{ padding: "var(--spacing-md)" }}
      >
        {coupon.code}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        <div className="flex items-center" style={{ gap: "var(--spacing-xs)" }}>
          <span className="capitalize">{coupon.discountType}</span>
          <span className="text-[var(--text-secondary)]">•</span>
          <span className="font-medium">
            {coupon.discountValue}%
          </span>
        </div>
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        <StatusTag status={coupon.status} />
      </td>
      <td
        className="text-sm text-[var(--text-secondary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {coupon.maxUsage || "Unlimited"}
      </td>
      <td
        className="text-sm text-[var(--text-secondary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {coupon.maxUsagePerUser || "Unlimited"}
      </td>
      <td
        className="text-sm text-[var(--text-secondary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {formatDate(coupon.startDate)}
      </td>
      <td
        className="text-sm text-[var(--text-secondary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {formatDate(coupon.endDate)}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        <div className="relative" data-dropdown>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleDropdown(couponId);
            }}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <MoreHorizontal size={20} />
          </button>
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 bg-[var(--bg-card)] rounded-lg shadow-lg z-10"
              style={{ minWidth: "150px" }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(coupon);
                  onToggleDropdown("");
                }}
                className="w-full flex items-center text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                style={{
                  gap: "var(--spacing-sm)",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                }}
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(coupon);
                  onToggleDropdown("");
                }}
                className="w-full flex items-center text-left text-sm text-[var(--accent-red)] hover:bg-[var(--bg-tertiary)] transition-colors"
                style={{
                  gap: "var(--spacing-sm)",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                }}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

interface CouponFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (coupon: Partial<Coupon>) => Promise<void>;
  coupon?: Coupon | null;
}

function CouponFormModal({
  isOpen,
  onClose,
  onSubmit,
  coupon,
}: CouponFormModalProps) {
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    status: "active",
    applyToAllMissions: true,
    maxUsage: undefined,
    maxUsagePerUser: undefined,
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || "",
        discountType: "percentage", // Backend only supports percentage
        discountValue: coupon.discountValue || 0,
        status: coupon.status || "active",
        applyToAllMissions: coupon.applyToAllMissions ?? true,
        maxUsage: coupon.maxUsage,
        maxUsagePerUser: coupon.maxUsagePerUser,
        startDate: coupon.startDate
          ? new Date(coupon.startDate).toISOString().split("T")[0]
          : "",
        endDate: coupon.endDate
          ? new Date(coupon.endDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        status: "active",
        applyToAllMissions: true,
        maxUsage: undefined,
        maxUsagePerUser: undefined,
        startDate: "",
        endDate: "",
      });
    }
    setError(null);
  }, [coupon, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const submitData: Partial<Coupon> = {
        ...formData,
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString()
          : undefined,
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString()
          : undefined,
      };
      await onSubmit(submitData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save coupon");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[100]"
      style={{
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg-card)] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto w-[95%] md:w-[90%]"
        style={{
          maxWidth: "600px",
          padding: "var(--spacing-md) var(--spacing-lg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: "var(--spacing-lg)" }}
        >
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {coupon ? "Edit Coupon" : "Create New Coupon"}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div
            className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4"
            style={{ marginBottom: "var(--spacing-md)" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "var(--spacing-md)" }}>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Coupon Code *
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              className="w-full bg-[var(--bg-secondary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus-visible:outline-none"
              style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
              placeholder="DISCOUNT20"
            />
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: "var(--spacing-md)", marginBottom: "var(--spacing-md)" }}
          >
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Discount Type *
              </label>
              <select
                required
                value={formData.discountType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountType: e.target.value as "percentage",
                  })
                }
                className="w-full bg-[var(--bg-secondary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus-visible:outline-none"
                style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                disabled
              >
                <option value="percentage">Percentage</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Discount Value *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.discountValue || ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value > 0 || e.target.value === "") {
                    setFormData({
                      ...formData,
                      discountValue: value || 0,
                    });
                  }
                }}
                className="w-full bg-[var(--bg-secondary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus-visible:outline-none"
                style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                placeholder="20"
              />
            </div>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: "var(--spacing-md)", marginBottom: "var(--spacing-md)" }}
          >
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "active" | "inactive",
                  })
                }
                className="w-full bg-[var(--bg-secondary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus-visible:outline-none"
                style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Apply to All Missions
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.applyToAllMissions ?? true}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      applyToAllMissions: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded focus:outline-none focus-visible:outline-none cursor-pointer"
                  style={{ accentColor: "#7343B3" }}
                />
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: "var(--spacing-md)", marginBottom: "var(--spacing-md)" }}
          >
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Max Usage
              </label>
              <input
                type="number"
                min="0"
                value={formData.maxUsage || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxUsage: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="w-full bg-[var(--bg-secondary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus-visible:outline-none"
                style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                placeholder="Unlimited"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Max Usage Per User
              </label>
              <input
                type="number"
                min="0"
                value={formData.maxUsagePerUser || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxUsagePerUser: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                className="w-full bg-[var(--bg-secondary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus-visible:outline-none"
                style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                placeholder="Unlimited"
              />
            </div>
          </div>

          <div
            className="grid grid-cols-2"
            style={{ gap: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}
          >
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full bg-[var(--bg-secondary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus-visible:outline-none"
                style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full bg-[var(--bg-secondary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus-visible:outline-none"
                style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
              />
            </div>
          </div>

          <div
            className="flex flex-col sm:flex-row justify-end"
            style={{ gap: "var(--spacing-sm)" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors rounded-lg font-medium w-full sm:w-auto"
              style={{
                padding: "var(--spacing-sm) var(--spacing-lg)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#7343B3] text-white hover:bg-[#5d3599] transition-colors rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              style={{
                padding: "var(--spacing-sm) var(--spacing-lg)",
              }}
            >
              {loading ? "Saving..." : coupon ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CouponsList() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Coupon | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
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

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listCoupons();
      console.log("=== COUPONS LIST RESPONSE ===");
      console.log("Full response:", response);
      console.log("Response data:", response.data);
      console.log("Response coupons:", response.coupons);
      console.log("Response success:", response.success);
      
      // Handle different response structures
      let couponsArray: Coupon[] = [];
      if (response.success && Array.isArray(response.data)) {
        couponsArray = response.data;
      } else if (Array.isArray(response.coupons)) {
        couponsArray = response.coupons;
      } else if (Array.isArray(response.data)) {
        couponsArray = response.data;
      } else if (Array.isArray(response)) {
        couponsArray = response;
      }
      
      console.log("Parsed coupons array:", couponsArray);
      console.log("Coupons count:", couponsArray.length);
      setCoupons(couponsArray);
    } catch (err: any) {
      console.error("Error fetching coupons:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (couponData: Partial<Coupon>) => {
    await createCoupon(couponData);
    await fetchCoupons();
  };

  const handleUpdateCoupon = async (couponData: Partial<Coupon>) => {
    if (!editingCoupon) return;
    const couponId = editingCoupon._id || editingCoupon.id;
    if (!couponId) return;
    await updateCoupon(couponId, couponData);
    await fetchCoupons();
  };

  const handleDeleteCoupon = async () => {
    if (!deleteConfirm) return;
    const couponId = deleteConfirm._id || deleteConfirm.id;
    if (!couponId) return;
    try {
      await deleteCoupon(couponId);
      await fetchCoupons();
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error("Error deleting coupon:", err);
      alert(err.response?.data?.message || "Failed to delete coupon");
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsFormModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCoupon(null);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (couponData: Partial<Coupon>) => {
    if (editingCoupon) {
      await handleUpdateCoupon(couponData);
    } else {
      await handleCreateCoupon(couponData);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "400px" }}>
        <div className="text-[var(--text-secondary)]">Loading coupons...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: "var(--spacing-lg)" }}
      >
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Coupons</h1>
        <button
          onClick={handleCreate}
          className="bg-[#7343B3] text-white hover:bg-[#5d3599] transition-colors rounded-lg font-medium flex items-center"
          style={{
            gap: "var(--spacing-xs)",
            padding: "var(--spacing-sm) var(--spacing-md)",
          }}
        >
          <Plus size={20} />
          Create Coupon
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4"
          style={{ marginBottom: "var(--spacing-md)" }}
        >
          {error}
        </div>
      )}

      {/* Coupons Table */}
      <div
        className="bg-[var(--bg-card)] rounded-lg overflow-hidden"
        style={{ flex: 1 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                style={{ borderBottom: "none" }}
                className="bg-[var(--bg-secondary)]"
              >
                <th
                  className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  #
                </th>
                <th
                  className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  Code
                </th>
                <th
                  className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  Discount
                </th>
                <th
                  className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  Status
                </th>
                <th
                  className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  Max Usage
                </th>
                <th
                  className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  Max Per User
                </th>
                <th
                  className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  Start Date
                </th>
                <th
                  className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  End Date
                </th>
                <th
                  className="text-right text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center text-[var(--text-secondary)]"
                    style={{ padding: "var(--spacing-xl)" }}
                  >
                    No coupons found. Create your first coupon!
                  </td>
                </tr>
              ) : (
                coupons.map((coupon, index) => (
                  <CouponRow
                    key={coupon._id || coupon.id || index}
                    coupon={coupon}
                    index={index}
                    onEdit={handleEdit}
                    onDelete={(coupon) => setDeleteConfirm(coupon)}
                    onToggleDropdown={(couponId) =>
                      setDropdownOpen(dropdownOpen === couponId ? null : couponId)
                    }
                    isDropdownOpen={
                      dropdownOpen === (coupon._id || coupon.id || index.toString())
                    }
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <CouponFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingCoupon(null);
        }}
        onSubmit={handleFormSubmit}
        coupon={editingCoupon}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
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
            }}
          >
            <h3
              className="text-xl font-bold text-[var(--text-primary)]"
              style={{ marginBottom: "var(--spacing-md)" }}
            >
              Delete Coupon
            </h3>
            <p
              className="text-sm text-[var(--text-secondary)]"
              style={{ marginBottom: "var(--spacing-xl)" }}
            >
              Are you sure you want to delete coupon{" "}
              <span className="font-mono font-medium text-[var(--text-primary)]">
                {deleteConfirm.code}
              </span>
              ? This action cannot be undone.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--spacing-sm)",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setDeleteConfirm(null)}
                className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors rounded-lg font-medium"
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCoupon}
                className="bg-[var(--accent-red)] text-white hover:bg-red-600 transition-colors rounded-lg font-medium"
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

