"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2 } from "lucide-react";
import adminApi from "@/utils/api";

interface Instructor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
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
    expertiseTags?: string[];
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
  // Add computed fields for display
  status: "active" | "inactive";
  joinDate: string;
  stats: {
    totalMissions: number;
    activeMissions: number;
    completedMissions: number;
    totalStudents: number;
    averageRating: number;
    totalReviews: number;
  };
  earnings: {
    totalEarnings: number;
    monthlyEarnings: number;
    currency: string;
  };
}

interface StatusButtonProps {
  status: "active" | "inactive";
}

function StatusButton({ status }: StatusButtonProps) {
  const isActive = status === "active";
  return (
    <button
      className={`rounded-full text-xs font-medium transition-colors ${
        isActive
          ? "bg-[var(--accent-blue)] text-white"
          : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
      }`}
      style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </button>
  );
}

function InstructorRow({
  instructor,
  index,
  onClick,
  onDelete,
  onToggleDropdown,
  isDropdownOpen,
}: {
  instructor: Instructor;
  index: number;
  onClick: () => void;
  onDelete: (instructorId: string) => void;
  onToggleDropdown: (instructorId: string) => void;
  isDropdownOpen: boolean;
}) {
  const fullName = `${instructor.firstName} ${instructor.lastName}`;
  const location = `${instructor.profile.city || "N/A"}, ${
    instructor.profile.country || "N/A"
  }`;
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

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
        {index + 1}
      </td>
      <td style={{ padding: "var(--spacing-md)" }}>
        <div className="flex items-center" style={{ gap: "var(--spacing-sm)" }}>
          {instructor.profile.avatar?.url ? (
            <img
              src={instructor.profile.avatar.url}
              alt={fullName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-red-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full"></div>
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-[var(--text-primary)]">
              {fullName}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">
              {location}
            </div>
          </div>
        </div>
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {instructor.stats.activeMissions}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {instructor.stats.completedMissions}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {instructor.stats.totalStudents}
      </td>
      <td style={{ padding: "var(--spacing-md)" }}>
        <div>
          <div className="text-sm font-medium text-[var(--text-primary)]">
            {formatCurrency(
              instructor.earnings.totalEarnings,
              instructor.earnings.currency
            )}
          </div>
          <div className="text-xs text-[var(--text-secondary)]">
            Monthly:{" "}
            {formatCurrency(
              instructor.earnings.monthlyEarnings,
              instructor.earnings.currency
            )}
          </div>
        </div>
      </td>
      <td style={{ padding: "var(--spacing-md)" }}>
        <StatusButton status={instructor.status} />
      </td>
      <td style={{ padding: "var(--spacing-md)" }}>
        <div className="flex items-center" style={{ gap: "var(--spacing-sm)" }}>
          <div className="relative" data-dropdown>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleDropdown(instructor._id);
              }}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              data-dropdown
            >
              <MoreHorizontal size={16} />
            </button>

            {isDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-1 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg shadow-lg z-50 min-w-[120px]"
                data-dropdown
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(instructor._id);
                    onToggleDropdown(instructor._id);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-[var(--accent-red)] hover:bg-[var(--bg-tertiary)] transition-colors flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function InstructorsList() {
  const router = useRouter();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [filteredInstructors, setFilteredInstructors] = useState<Instructor[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("oldest-to-newest");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    instructorId: string | null;
    instructorName: string;
  }>({
    show: false,
    instructorId: null,
    instructorName: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInstructorClick = (instructor: Instructor) => {
    // Clear any existing user data in localStorage
    localStorage.removeItem("selectedStudent");
    localStorage.removeItem("selectedAffiliate");

    // Store the instructor data in localStorage
    localStorage.setItem("selectedInstructor", JSON.stringify(instructor));

    // Navigate to profile page
    router.push("/profile");
  };

  const handleDeleteInstructor = (instructorId: string) => {
    const instructor = instructors.find((i) => i._id === instructorId);
    if (instructor) {
      setDeleteModal({
        show: true,
        instructorId: instructorId,
        instructorName: `${instructor.firstName} ${instructor.lastName}`,
      });
    }
  };

  const toggleDropdown = (instructorId: string) => {
    console.log("Toggling dropdown for instructor:", instructorId);
    console.log("Current dropdown open:", dropdownOpen);
    setDropdownOpen(dropdownOpen === instructorId ? null : instructorId);
  };

  const closeDropdown = () => {
    setDropdownOpen(null);
  };

  const confirmDeleteInstructor = async () => {
    if (!deleteModal.instructorId) return;

    try {
      setIsDeleting(true);
      console.log("Deleting instructor:", deleteModal.instructorId);
      const response = await adminApi.delete(
        `/users/users/${deleteModal.instructorId}`
      );

      if (response.status === 200) {
        console.log("Instructor deleted successfully");
        // Remove the instructor from the local state
        setInstructors((prevInstructors) =>
          prevInstructors.filter((i) => i._id !== deleteModal.instructorId)
        );
        setDeleteModal({ show: false, instructorId: null, instructorName: "" });
        setSuccessMessage(
          `Instructor ${deleteModal.instructorName} deleted successfully!`
        );

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        console.error("Failed to delete instructor:", response.data);
        setError("Failed to delete instructor. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting instructor:", err);
      setError("Error deleting instructor. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteInstructor = () => {
    setDeleteModal({ show: false, instructorId: null, instructorName: "" });
  };

  const applyFiltersAndSort = useCallback(() => {
    // Ensure instructors is always an array
    if (!Array.isArray(instructors)) {
      console.warn("Instructors is not an array:", instructors);
      setFilteredInstructors([]);
      return;
    }

    let filtered = [...instructors];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (instructor) => instructor.status === statusFilter
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest-to-oldest":
          return (
            new Date(b.joinDate || "").getTime() -
            new Date(a.joinDate || "").getTime()
          );
        case "oldest-to-newest":
          return (
            new Date(a.joinDate || "").getTime() -
            new Date(b.joinDate || "").getTime()
          );
        case "name-a-z":
          return `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
          );
        case "name-z-a":
          return `${b.firstName} ${b.lastName}`.localeCompare(
            `${a.firstName} ${a.lastName}`
          );
        default:
          return 0;
      }
    });

    setFilteredInstructors(filtered);
  }, [instructors, sortBy, statusFilter]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("=== FETCHING INSTRUCTors FROM BACKEND ===");
        console.log("Using endpoint: /api/admin/users/instructors");
        const response = await adminApi.get("/users/instructors");
        console.log("=== COMPLETE INSTRUCTORS API RESPONSE ===");
        console.log("Instructors API Response:", response.data);

        const instructorsData = response.data?.data?.data; // Correctly access nested data

        if (instructorsData && Array.isArray(instructorsData)) {
          console.log("✅ SUCCESS: Instructors data is an array!");
          console.log("Instructors count:", instructorsData.length);

          const transformedInstructors = instructorsData.map(
            (instructor: any) => ({
              ...instructor,
              status: instructor.isActive ? "active" : "inactive",
              joinDate: instructor.createdAt,
              stats: {
                totalMissions: instructor.completedMissions?.length || 0,
                activeMissions: instructor.activeMissions?.length || 0,
                completedMissions: instructor.completedMissions?.length || 0,
                totalStudents: instructor.totalStudents || 0,
                averageRating: instructor.averageRating || 0,
                totalReviews: instructor.reviews?.length || 0,
              },
              earnings: {
                totalEarnings: instructor.totalEarnings || 0,
                monthlyEarnings: instructor.monthlyEarnings || 0,
                currency: "USD",
              },
            })
          );

          console.log("=== TRANSFORMATION COMPLETE ===");
          console.log("Transformed instructors:", transformedInstructors);
          setInstructors(transformedInstructors);
          console.log("=== INSTRUCTORS FETCH COMPLETE ===");
        } else {
          const errorMsg =
            "Data received, but it is not in the expected format (array missing).";
          console.error("❌ ERROR:", errorMsg);
          console.error("Received data:", response.data);
          setError(errorMsg);
          setInstructors([]);
        }
      } catch (err: unknown) {
        console.error("Error fetching instructors:", err);
        const errorMessage =
          err instanceof Error && "response" in err
            ? (err as { response?: { data?: { error?: string } } }).response
                ?.data?.error || "Failed to fetch instructors"
            : "Failed to fetch instructors";
        setError(errorMessage);
        setInstructors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdownOpen && !target.closest("[data-dropdown]")) {
        console.log("Clicking outside dropdown, closing it");
        setDropdownOpen(null);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

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
              Loading instructors...
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
            <p className="text-[var(--accent-red)] mb-4">{error}</p>
            <button
              onClick={() => {
                const fetchInstructors = async () => {
                  try {
                    setLoading(true);
                    setError(null);
                    console.log("=== RETRYING INSTRUCTORS FETCH ===");
                    const response = await adminApi.get("/users/instructors");
                    console.log("=== COMPLETE INSTRUCTORS API RESPONSE ===");
                    console.log("Instructors API Response:", response.data);

                    const instructorsData = response.data?.data?.data;
                    if (instructorsData && Array.isArray(instructorsData)) {
                      console.log("✅ SUCCESS: Instructors data is an array!");
                      console.log("Instructors count:", instructorsData.length);

                      const transformedInstructors = instructorsData.map(
                        (instructor: any) => ({
                          ...instructor,
                          status: instructor.isActive ? "active" : "inactive",
                          joinDate: instructor.createdAt,
                          stats: {
                            totalMissions:
                              instructor.completedMissions?.length || 0,
                            activeMissions:
                              instructor.activeMissions?.length || 0,
                            completedMissions:
                              instructor.completedMissions?.length || 0,
                            totalStudents: instructor.totalStudents || 0,
                            averageRating: instructor.averageRating || 0,
                            totalReviews: instructor.reviews?.length || 0,
                          },
                          earnings: {
                            totalEarnings: instructor.totalEarnings || 0,
                            monthlyEarnings: instructor.monthlyEarnings || 0,
                            currency: "USD",
                          },
                        })
                      );

                      console.log("=== TRANSFORMATION COMPLETE ===");
                      console.log(
                        "Transformed instructors:",
                        transformedInstructors
                      );
                      setInstructors(transformedInstructors);
                      console.log("=== INSTRUCTORS FETCH COMPLETE ===");
                    } else {
                      const errorMsg =
                        "Data received, but it is not in the expected format (array missing).";
                      console.error("❌ ERROR:", errorMsg);
                      console.error("Received data:", response.data);
                      setError(errorMsg);
                      setInstructors([]);
                    }
                  } catch (err: unknown) {
                    console.error("Error fetching instructors:", err);
                    const errorMessage =
                      err instanceof Error && "response" in err
                        ? (err as { response?: { data?: { error?: string } } })
                            .response?.data?.error ||
                          "Failed to fetch instructors"
                        : "Failed to fetch instructors";
                    setError(errorMessage);
                    setInstructors([]);
                  } finally {
                    setLoading(false);
                  }
                };
                fetchInstructors();
              }}
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
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{ padding: "var(--spacing-lg)" }}
      >
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Instructors List
        </h2>
        <div className="flex items-center" style={{ gap: "var(--spacing-sm)" }}>
          <div
            className="flex items-center"
            style={{ gap: "var(--spacing-xs)" }}
          >
            <button
              onClick={() => handleStatusFilter("all")}
              className={`rounded-lg transition-colors ${
                statusFilter === "all"
                  ? "bg-[var(--accent-purple)] text-white"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-secondary)]"
              }`}
              style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilter("active")}
              className={`rounded-lg transition-colors ${
                statusFilter === "active"
                  ? "bg-[var(--accent-purple)] text-white"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-secondary)]"
              }`}
              style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
            >
              Active
            </button>
            <button
              onClick={() => handleStatusFilter("inactive")}
              className={`rounded-lg transition-colors ${
                statusFilter === "inactive"
                  ? "bg-[var(--accent-purple)] text-white"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-secondary)]"
              }`}
              style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
            >
              Inactive
            </button>
          </div>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg focus:outline-none"
            style={{
              padding: "var(--spacing-sm) var(--spacing-md)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <option value="oldest-to-newest">Sort By: Oldest to Newest</option>
            <option value="newest-to-oldest">Sort By: Newest to Oldest</option>
            <option value="name-a-z">Sort By: Name A-Z</option>
            <option value="name-z-a">Sort By: Name Z-A</option>
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
                Instructor
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Active Missions
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Completed Missions
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Students
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Revenue
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
          <tbody>
            {filteredInstructors.map((instructor, index) => (
              <InstructorRow
                key={instructor._id}
                instructor={instructor}
                index={index}
                onClick={() => handleInstructorClick(instructor)}
                onDelete={handleDeleteInstructor}
                onToggleDropdown={toggleDropdown}
                isDropdownOpen={dropdownOpen === instructor._id}
              />
            ))}
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
          Showing {filteredInstructors.length} of {instructors.length}{" "}
          instructors
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
              Delete Instructor
            </h3>
            <p
              className="text-sm text-[var(--text-secondary)]"
              style={{ marginBottom: "var(--spacing-xl)" }}
            >
              Are you sure you want to delete "{deleteModal.instructorName}"?
              This action cannot be undone.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--spacing-sm)",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={cancelDeleteInstructor}
                className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors rounded-lg font-medium"
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteInstructor}
                disabled={isDeleting}
                className="bg-[var(--accent-red)] text-white hover:bg-red-600 transition-colors rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
