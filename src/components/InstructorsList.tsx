"use client";

import { useState, useEffect, useCallback } from "react";
import { MoreHorizontal } from "lucide-react";
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
}: {
  instructor: Instructor;
  index: number;
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
      style={{ borderBottom: "1px solid var(--border-primary)" }}
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
        <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </td>
    </tr>
  );
}

export default function InstructorsList() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [filteredInstructors, setFilteredInstructors] = useState<Instructor[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("oldest-to-newest");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
    fetchInstructors();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("=== FETCHING INSTRUCTORS FROM BACKEND ===");
      console.log("Using endpoint: /api/admin/users/instructors");
      const response = await adminApi.get("/users/instructors");
      console.log("=== COMPLETE INSTRUCTORS API RESPONSE ===");
      console.log("Instructors API Response:", response.data);
      console.log("Response data type:", typeof response.data);
      console.log("Response data keys:", Object.keys(response.data));
      console.log("Response success:", response.data.success);
      console.log("Response message:", response.data.message);
      console.log("Response status:", response.data.status);
      console.log("Response pagination:", response.data.pagination);

      if (response.data.success) {
        // The array is in response.data.data
        console.log("=== DEBUGGING DATA ACCESS ===");
        console.log("response.data:", response.data);
        console.log("response.data.data:", response.data.data);
        console.log("response.data.data type:", typeof response.data.data);
        console.log(
          "response.data.data is array:",
          Array.isArray(response.data.data)
        );
        console.log("response.data.data length:", response.data.data?.length);

        const instructorsData = response.data.data;
        console.log("Instructors data:", instructorsData);
        console.log("Instructors data type:", typeof instructorsData);
        console.log(
          "Instructors data is array:",
          Array.isArray(instructorsData)
        );
        console.log("=== END DEBUGGING ===");

        if (Array.isArray(instructorsData)) {
          console.log("✅ SUCCESS: Instructors data is an array!");
          console.log("Instructors count:", instructorsData.length);
          console.log("=== INDIVIDUAL INSTRUCTORS ===");
          instructorsData.forEach((instructor: any, index: number) => {
            console.log(`Instructor ${index + 1}:`, {
              _id: instructor._id,
              firstName: instructor.firstName,
              lastName: instructor.lastName,
              username: instructor.username,
              email: instructor.email,
              isActive: instructor.isActive,
              isVerified: instructor.isVerified,
              createdAt: instructor.createdAt,
              profile: instructor.profile,
            });
          });

          // Transform backend data to match our interface
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
          console.log(
            "Transformed instructors count:",
            transformedInstructors.length
          );
          console.log("Transformed instructors:", transformedInstructors);
          console.log("Setting instructors state...");
          setInstructors(transformedInstructors);
          console.log("=== INSTRUCTORS FETCH COMPLETE ===");
        } else {
          console.error("❌ ERROR: Instructors data is not an array!");
          console.error("Instructors data:", instructorsData);
          console.error("Data type:", typeof instructorsData);
          console.error("Is array:", Array.isArray(instructorsData));
          console.error("Full response structure:", response.data);
          setError("Invalid data format received from server");
        }
      } else {
        console.error("Failed to fetch instructors - no success");
        setError("Failed to fetch instructors");
      }
    } catch (err: unknown) {
      console.error("Error fetching instructors:", err);
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data
              ?.error || "Failed to fetch instructors"
          : "Failed to fetch instructors";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
              onClick={fetchInstructors}
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
    </div>
  );
}
