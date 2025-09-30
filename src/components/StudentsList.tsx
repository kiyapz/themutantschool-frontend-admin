"use client";

import { useState, useEffect, useCallback } from "react";
import { MoreHorizontal } from "lucide-react";
import adminApi from "@/utils/api";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  status: "active" | "inactive";
  joinDate: string;
  lastLogin: string;
  profile: {
    avatar?: string;
    phone?: string;
    country: string;
    city: string;
  };
  progress: {
    completedMissions: number;
    totalMissions: number;
    completionRate: number;
    currentLevel: string;
  };
  enrollment: {
    enrolledMissions: number;
    certificates: number;
    badges: number;
  };
  subscription: {
    type: string;
    status: string;
    expiresAt?: string;
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

function StudentRow({ student, index }: { student: Student; index: number }) {
  const fullName = `${student.firstName} ${student.lastName}`;
  const location = `${student.profile.city}, ${student.profile.country}`;

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
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-red-500 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full"></div>
          </div>
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
        {student.enrollment.enrolledMissions}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {student.progress.completedMissions}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {student.enrollment.certificates}
      </td>
      <td style={{ padding: "var(--spacing-md)" }}>
        <StatusButton status={student.status} />
      </td>
      <td style={{ padding: "var(--spacing-md)" }}>
        <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </td>
    </tr>
  );
}

export default function StudentsList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("oldest-to-newest");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...students];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((student) => student.status === statusFilter);
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

    setFilteredStudents(filtered);
  }, [students, sortBy, statusFilter]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminApi.get("/users/students");
      console.log("Students API Response:", response.data);

      if (response.data.success) {
        setStudents(response.data.data);
      } else {
        setError("Failed to fetch students");
      }
    } catch (err: unknown) {
      console.error("Error fetching students:", err);
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data
              ?.error || "Failed to fetch students"
          : "Failed to fetch students";
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
              Loading students...
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
              onClick={fetchStudents}
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
          Students List
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
                Student
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Enrolled Missions
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
                Certificates
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
            {filteredStudents.map((student, index) => (
              <StudentRow key={student._id} student={student} index={index} />
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
          Showing {filteredStudents.length} of {students.length} students
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
