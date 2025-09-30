"use client";

import { useState, useEffect, useCallback } from "react";
import { MoreHorizontal } from "lucide-react";
import adminApi from "@/utils/api";

interface Mission {
  _id: string;
  title: string;
  instructor: string;
  category: "Coding" | "Design" | "Growth";
  levels: number;
  capsules: number;
  recruits: number;
  price: number;
  priceType: "Lifetime" | "Limited offer" | "Free";
  status: "Active" | "Pending";
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryTagProps {
  category: "Coding" | "Design" | "Growth";
}

function CategoryTag({ category }: CategoryTagProps) {
  const getCategoryColor = () => {
    switch (category) {
      case "Coding":
        return "bg-[var(--accent-purple)] text-white";
      case "Design":
        return "bg-orange-500 text-white";
      case "Growth":
        return "bg-green-500 text-white";
      default:
        return "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]";
    }
  };

  return (
    <span
      className={`rounded-full text-xs font-medium ${getCategoryColor()}`}
      style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
    >
      {category}
    </span>
  );
}

interface StatusTagProps {
  status: "Active" | "Pending";
}

function StatusTag({ status }: StatusTagProps) {
  const isActive = status === "Active";
  return (
    <span
      className={`rounded-full text-xs font-medium ${
        isActive
          ? "bg-[var(--accent-blue)] text-white"
          : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
      }`}
      style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
    >
      {status}
    </span>
  );
}

function MissionRow({ mission, index }: { mission: Mission; index: number }) {
  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `$${price}`;
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
        <div>
          <div className="text-sm font-medium text-[var(--text-primary)]">
            {mission.title}
          </div>
          <div className="text-xs text-[var(--text-secondary)]">
            by {mission.instructor}
          </div>
        </div>
      </td>
      <td style={{ padding: "var(--spacing-md)" }}>
        <CategoryTag category={mission.category} />
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {mission.levels}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {mission.capsules}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {mission.recruits}
      </td>
      <td style={{ padding: "var(--spacing-md)" }}>
        <div>
          <div className="text-sm font-medium text-[var(--text-primary)]">
            {formatPrice(mission.price)}
          </div>
          <div className="text-xs text-[var(--text-secondary)]">
            {mission.priceType}
          </div>
        </div>
      </td>
      <td style={{ padding: "var(--spacing-md)" }}>
        <StatusTag status={mission.status} />
      </td>
      <td style={{ padding: "var(--spacing-md)" }}>
        <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </td>
    </tr>
  );
}

export default function MissionsList() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("oldest-to-newest");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...missions];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((mission) => mission.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest-to-oldest":
          return (
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
          );
        case "oldest-to-newest":
          return (
            new Date(a.createdAt || "").getTime() -
            new Date(b.createdAt || "").getTime()
          );
        case "name-a-z":
          return a.title.localeCompare(b.title);
        case "name-z-a":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredMissions(filtered);
  }, [missions, sortBy, statusFilter]);

  useEffect(() => {
    fetchMissions();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminApi.get("/missions");
      console.log("Missions API Response:", response.data);

      if (response.data.success) {
        setMissions(response.data.data);
      } else {
        setError("Failed to fetch missions");
      }
    } catch (err: unknown) {
      console.error("Error fetching missions:", err);
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data
              ?.error || "Failed to fetch missions"
          : "Failed to fetch missions";
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
              Loading missions...
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
              onClick={fetchMissions}
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
          Mission List
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
              onClick={() => handleStatusFilter("Active")}
              className={`rounded-lg transition-colors ${
                statusFilter === "Active"
                  ? "bg-[var(--accent-purple)] text-white"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-secondary)]"
              }`}
              style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
            >
              Active
            </button>
            <button
              onClick={() => handleStatusFilter("Pending")}
              className={`rounded-lg transition-colors ${
                statusFilter === "Pending"
                  ? "bg-[var(--accent-purple)] text-white"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-secondary)]"
              }`}
              style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
            >
              Pending
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
                Mission Title
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Category
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Levels
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Capsules
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Recruits
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Price
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
            {filteredMissions.map((mission, index) => (
              <MissionRow key={mission._id} mission={mission} index={index} />
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
          Showing {filteredMissions.length} of {missions.length} missions
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
