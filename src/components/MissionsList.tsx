"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2, Eye, EyeOff } from "lucide-react";
import adminApi from "@/utils/api";

interface Review {
  _id?: string;
  rating?: number;
  comment?: string;
  [key: string]: unknown;
}

interface Level {
  _id?: string;
  title?: string;
  [key: string]: unknown;
}

interface ValidCoupon {
  _id?: string;
  code?: string;
  [key: string]: unknown;
}

interface Instructor {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  profile: {
    avatar?: {
      url: string;
    };
  };
}

interface Mission {
  _id: string;
  title: string;
  instructor: string;
  instructorDetails?: Instructor; // Added to store instructor details
  category: string;
  skillLevel: string;
  estimatedDuration: string;
  price: number;
  isFree: boolean;
  isPublished: boolean;
  status: string;
  averageRating: number;
  reviews: Review[];
  description?: string;
  shortDescription?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  thumbnail?: {
    url: string;
    key: string;
  };
  video?: {
    url: string;
    key: string;
    type: string;
  };
  certificateAvailable?: boolean;
  tags?: string[];
  levels?: Level[];
  validCoupons?: ValidCoupon[];
  // Add computed fields for display
  capsules?: number;
  recruits?: number;
  priceType?: string;
}

interface CategoryTagProps {
  category: string;
}

function CategoryTag({ category }: CategoryTagProps) {
  const getCategoryColor = () => {
    switch (category?.toLowerCase()) {
      case "coding":
      case "programming":
        return "bg-[#30192E] text-[#840B94]";
      case "design":
        return "bg-[#302A19] text-[#FF9F38]";
      case "Technology":
      case "education":
        return "bg-[#19302B] text-[#38FFBD]";
      default:
        return "bg-[#19302B] text-[#38FFBD]";
    }
  };

  return (
    <span
      className={`rounded-full text-xs font-medium ${getCategoryColor()}`}
      style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
    >
      {category || "Unknown"}
    </span>
  );
}

interface StatusTagProps {
  status: string;
  isPublished?: boolean;
}

function StatusTag({ status, isPublished }: StatusTagProps) {
  const getStatusColor = () => {
    if (isPublished) {
      return "bg-[#191B30] text-[#387EFF]";
    }
    if (status && status.toLowerCase() === "published") {
      return "bg-[var(--accent-blue)] text-white";
    }
    if (status && status.toLowerCase() === "draft") {
      return "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]";
    }
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-[var(--accent-blue)] text-white";
      case "pending":
        return "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]";
      default:
        return "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]";
    }
  };

  const getStatusText = () => {
    if (isPublished) return "Published";
    if (status && status.toLowerCase() === "published") return "Published";
    if (status && status.toLowerCase() === "draft") return "Draft";
    return status || "Unknown";
  };

  return (
    <span
      className={`rounded-full text-xs font-medium ${getStatusColor()}`}
      style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
    >
      {getStatusText()}
    </span>
  );
}

function MissionRow({
  mission,
  index,
  onInstructorClick,
  onMissionClick,
  onDeleteMission,
  onPublishMission,
  onUnpublishMission,
  onToggleDropdown,
  isDropdownOpen,
}: {
  mission: Mission;
  index: number;
  onInstructorClick: (instructorId: string) => void;
  onMissionClick: (mission: Mission) => void;
  onDeleteMission: (missionId: string) => void;
  onPublishMission: (missionId: string) => void;
  onUnpublishMission: (missionId: string) => void;
  onToggleDropdown: (missionId: string) => void;
  isDropdownOpen: boolean;
}) {
  const formatPrice = (price: number, isFree: boolean) => {
    if (isFree || price === 0) return "Free";
    return `$${price}`;
  };

  const getPriceType = (isFree: boolean) => {
    return isFree ? "Free" : "Paid";
  };

  return (
    <tr
      className="hover:opacity-80 transition-colors cursor-pointer"
      onClick={() => onMissionClick(mission)}
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
          <div
            className="text-xs text-[#5F5F5F] cursor-pointer hover:text-[#7343B3]"
            onClick={(e) => {
              e.stopPropagation();
              onInstructorClick(mission.instructor);
            }}
          >
            by{" "}
            {mission.instructorDetails &&
            mission.instructorDetails.firstName &&
            mission.instructorDetails.lastName
              ? `${mission.instructorDetails.firstName} ${mission.instructorDetails.lastName}`
              : mission.instructor || "Unknown Instructor"}
          </div>
        </div>
      </td>
      <td style={{ padding: "var(--spacing-md)" }}>
        <CategoryTag category={mission.category} />
      </td>
      <td
        className="text-sm text-[#5F5F5F]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {mission.levels?.length || 0}
      </td>
      <td
        className="text-sm text-[#5F5F5F]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {mission.averageRating?.toFixed(1) || "N/A"}
      </td>
      <td
        className="text-sm text-[#5F5F5F]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {mission.reviews?.length || 0}
      </td>
      <td style={{ padding: "var(--spacing-md)" }}>
        <div>
          <div className="text-sm font-medium text-[var(--text-primary)]">
            {formatPrice(mission.price, mission.isFree)}
          </div>
          <div className="text-xs text-[#5F5F5F]">
            {getPriceType(mission.isFree)}
          </div>
        </div>
      </td>
      <td style={{ padding: "var(--spacing-md)" }}>
        <StatusTag status={mission.status} isPublished={mission.isPublished} />
      </td>
      <td style={{ padding: "var(--spacing-md)" }}>
        <div className="relative" data-dropdown>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleDropdown(mission._id);
            }}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="More Actions"
          >
            <MoreHorizontal size={16} />
          </button>

          {isDropdownOpen && (
            <div
              className="absolute right-0 top-8 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg shadow-lg z-10"
              style={{ minWidth: "160px" }}
              data-dropdown
            >
              <div className="py-1">
                {!mission.isPublished &&
                  mission.status?.toLowerCase() !== "published" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPublishMission(mission._id);
                      }}
                      className="flex items-center w-full text-left text-[var(--accent-green)] hover:bg-[var(--bg-tertiary)] transition-colors"
                      style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                    >
                      <Eye
                        size={14}
                        style={{ marginRight: "var(--spacing-sm)" }}
                      />
                      Publish
                    </button>
                  )}

                {mission.isPublished ||
                mission.status?.toLowerCase() === "published" ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUnpublishMission(mission._id);
                    }}
                    className="flex items-center w-full text-left text-[var(--accent-orange)] hover:bg-[var(--bg-tertiary)] transition-colors"
                    style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                  >
                    <EyeOff
                      size={14}
                      style={{ marginRight: "var(--spacing-sm)" }}
                    />
                    Unpublish
                  </button>
                ) : null}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMission(mission._id);
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

export default function MissionsList() {
  const router = useRouter();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [instructors, setInstructors] = useState<Record<string, Instructor>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalMissions, setTotalMissions] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<string>("oldest-to-newest");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [mounted, setMounted] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    missionId: string | null;
    missionTitle: string;
  }>({
    show: false,
    missionId: null,
    missionTitle: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const handleInstructorClick = (instructorId: string) => {
    const instructor = instructors[instructorId];
    if (instructor) {
      // Clear any existing user data in localStorage
      localStorage.removeItem("selectedStudent");
      localStorage.removeItem("selectedAffiliate");
      localStorage.removeItem("selectedMission");

      // Store the instructor data in localStorage
      localStorage.setItem("selectedInstructor", JSON.stringify(instructor));

      // Navigate to profile page
      router.push("/profile");
    } else {
      console.error("Instructor details not found for ID:", instructorId);
    }
  };

  const handleMissionClick = (mission: Mission) => {
    console.log("Mission clicked:", mission.title);

    // Get instructor data for this mission
    const instructor = instructors[mission.instructor];

    if (instructor) {
      // Clear any existing user data in localStorage
      localStorage.removeItem("selectedStudent");
      localStorage.removeItem("selectedAffiliate");
      localStorage.removeItem("selectedMission");

      // Store the instructor data in localStorage
      localStorage.setItem("selectedInstructor", JSON.stringify(instructor));

      // Store the mission data for the missions tab
      localStorage.setItem("selectedMission", JSON.stringify(mission));

      // Navigate to profile page
      router.push("/profile");
    } else {
      console.error("Instructor details not found for mission:", mission.title);
    }
  };

  const handleDeleteMission = (missionId: string) => {
    const mission = missions.find((m) => m._id === missionId);
    if (mission) {
      setDeleteModal({
        show: true,
        missionId: missionId,
        missionTitle: mission.title,
      });
    }
  };

  const confirmDeleteMission = async () => {
    if (!deleteModal.missionId) return;

    try {
      console.log("Deleting mission:", deleteModal.missionId);
      const response = await adminApi.delete(
        `/missions/${deleteModal.missionId}`
      );

      if (response.status === 200) {
        console.log("Mission deleted successfully");
        // Remove the mission from the local state
        setMissions((prevMissions) =>
          prevMissions.filter((m) => m._id !== deleteModal.missionId)
        );
        setDeleteModal({ show: false, missionId: null, missionTitle: "" });
      } else {
        console.error("Failed to delete mission:", response.data);
        setError("Failed to delete mission. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting mission:", err);
      setError("Error deleting mission. Please try again.");
    }
  };

  const cancelDeleteMission = () => {
    setDeleteModal({ show: false, missionId: null, missionTitle: "" });
  };

  const handlePublishMission = async (missionId: string) => {
    try {
      console.log("Publishing mission:", missionId);
      const response = await adminApi.put(`/missions/${missionId}/publish`);

      if (response.status === 200) {
        console.log("Mission published successfully");
        // Update the mission in the local state
        setMissions((prevMissions) =>
          prevMissions.map((m) =>
            m._id === missionId
              ? { ...m, isPublished: true, status: "published" }
              : m
          )
        );
        setDropdownOpen(null);
      } else {
        console.error("Failed to publish mission:", response.data);
        setError("Failed to publish mission. Please try again.");
      }
    } catch (err) {
      console.error("Error publishing mission:", err);
      setError("Error publishing mission. Please try again.");
    }
  };

  const handleUnpublishMission = async (missionId: string) => {
    try {
      console.log("Unpublishing mission:", missionId);
      const response = await adminApi.put(`/missions/${missionId}/draft`);

      if (response.status === 200) {
        console.log("Mission unpublished successfully");
        // Update the mission in the local state
        setMissions((prevMissions) =>
          prevMissions.map((m) =>
            m._id === missionId
              ? { ...m, isPublished: false, status: "draft" }
              : m
          )
        );
        setDropdownOpen(null);
      } else {
        console.error("Failed to unpublish mission:", response.data);
        setError("Failed to unpublish mission. Please try again.");
      }
    } catch (err) {
      console.error("Error unpublishing mission:", err);
      setError("Error unpublishing mission. Please try again.");
    }
  };

  const toggleDropdown = (missionId: string) => {
    console.log("Toggling dropdown for mission:", missionId);
    console.log("Current dropdown open:", dropdownOpen);
    setDropdownOpen(dropdownOpen === missionId ? null : missionId);
  };

  // Debug dropdown state changes
  useEffect(() => {
    console.log("Dropdown state changed:", dropdownOpen);
  }, [dropdownOpen]);

  const fetchInstructors = async () => {
    try {
      console.log("--- Fetching instructors ---");
      const response = await adminApi.get("/users/instructors");

      // The array is nested in response.data.data.data
      const instructorsArray = response?.data?.data?.data;

      if (instructorsArray && Array.isArray(instructorsArray)) {
        console.log(
          `✅ Success! Found ${instructorsArray.length} instructors.`
        );

        // Create a map of instructor IDs to instructor objects
        const instructorsMap: Record<string, Instructor> = {};
        instructorsArray.forEach((instructor: Instructor) => {
          instructorsMap[instructor._id] = instructor;
        });

        setInstructors(instructorsMap);
        return instructorsMap;
      } else {
        console.error(
          "❌ Instructors data is not in the expected format:",
          response.data
        );
        return {};
      }
    } catch (err) {
      console.error("❌ Error fetching instructors:", err);
      return {};
    }
  };

  const fetchMissions = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`--- Fetching missions (page ${page}) ---`);

      const instructorsMap = await fetchInstructors();

      const response = await adminApi.get(`/missions?page=${page}&limit=10`);

      const missionsArray = response?.data?.data?.data;
      const pagination = response?.data?.data?.pagination;

      if (pagination) {
        console.log(`Total missions in database: ${pagination.totalItems}`);
        setTotalMissions(pagination.totalItems);
        setTotalPages(pagination.totalPages);
        setCurrentPage(pagination.page);
      }

      if (missionsArray && Array.isArray(missionsArray)) {
        console.log(`✅ Success! Found ${missionsArray.length} missions.`);

        const missionsWithInstructors = missionsArray.map((mission: unknown) => {
          const missionData = mission as {
            instructor?: string | Instructor;
            [key: string]: unknown;
          };
          let instructorObject: Instructor | undefined;
          let instructorId = "";

          if (
            typeof missionData.instructor === "object" &&
            missionData.instructor !== null
          ) {
            instructorObject = missionData.instructor as Instructor;
            instructorId = instructorObject._id;
          } else if (typeof missionData.instructor === "string") {
            instructorId = missionData.instructor;
            instructorObject = instructorsMap[instructorId];
          }

          return {
            ...missionData,
            instructor: instructorId,
            instructorDetails: instructorObject,
          } as Mission;
        });

        setMissions(missionsWithInstructors);
      } else {
        const errorMsg =
          "Data received, but it is not in the expected format (array missing).";
        console.error("❌", errorMsg, response.data);
        setError(errorMsg);
        setMissions([]);
      }
    } catch (err) {
      console.error("❌ Error fetching missions:", err);
      setError("An error occurred while fetching missions.");
      setMissions([]);
    } finally {
      setLoading(false);
      console.log("--- Finished fetching missions ---");
    }
  }, []);

  useEffect(() => {
    setMounted(true);

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Check if the click is outside the dropdown
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
    fetchMissions(1);
  }, [fetchMissions]);

  const filteredMissions = useMemo(() => {
    let filtered = Array.isArray(missions) ? [...missions] : [];

    console.log("=== FILTERING DEBUG ===");
    console.log("Total missions:", missions.length);
    console.log("Status filter:", statusFilter);
    console.log(
      "All missions data:",
      missions.map((m) => ({
        title: m.title,
        isPublished: m.isPublished,
        status: m.status,
        _id: m._id,
      }))
    );

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((mission) => {
        const isPublishedBool = mission.isPublished === true;
        const isPublishedString =
          mission.status && mission.status.toLowerCase() === "published";
        const isDraftBool = mission.isPublished === false;
        const isDraftString =
          mission.status && mission.status.toLowerCase() === "draft";

        console.log(`Mission: ${mission.title}`);
        console.log(
          `  isPublished: ${mission.isPublished}, status: ${mission.status}`
        );
        console.log(
          `  isPublishedBool: ${isPublishedBool}, isPublishedString: ${isPublishedString}`
        );
        console.log(
          `  isDraftBool: ${isDraftBool}, isDraftString: ${isDraftString}`
        );

        if (statusFilter === "Published") {
          const result = isPublishedBool || isPublishedString;
          console.log(`  Published filter result: ${result}`);
          return result;
        }
        if (statusFilter === "Draft") {
          const result = isDraftBool || isDraftString;
          console.log(`  Draft filter result: ${result}`);
          return result;
        }
        return true;
      });
    }

    console.log(`Filtered missions count: ${filtered.length}`);
    console.log(
      "Filtered missions:",
      filtered.map((m) => ({
        title: m.title,
        isPublished: m.isPublished,
        status: m.status,
      }))
    );
    console.log("=== END FILTERING DEBUG ===");

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

    return filtered;
  }, [missions, sortBy, statusFilter]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchMissions(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchMissions(currentPage - 1);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  if (!mounted) {
    return (
      <div className=" rounded-lg">
        <div
          className="flex items-center justify-center"
          style={{ padding: "var(--spacing-2xl)" }}
        >
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className=" rounded-lg">
        <div
          className="flex items-center justify-center"
          style={{ padding: "var(--spacing-2xl)" }}
        >
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin mx-auto"></div>
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
              onClick={() => fetchMissions(1)}
              className="bg-[#7343B3] text-white px-4 py-2 rounded-lg hover:bg-[#8b5cf6] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" rounded-lg">
      {/* Header */}
      <div
        className="flex items-center justify-between bg-[#0C0C0C] rounded-[20px]"
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
              className={`rounded-lg transition-colors shadow-md cursor-pointer  text-[#878787] text-[19px] font-medium ${
                statusFilter === "all" ? "bg-[#161616]" : "bg-[#161616] "
              }`}
              style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilter("Published")}
              className={`rounded-lg transition-colors shadow-md cursor-pointer  text-[#878787] text-[19px] font-medium ${
                statusFilter === "Published" ? "bg-[#161616]" : "bg-[#161616] "
              }`}
              style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
            >
              Published
            </button>
            <button
              onClick={() => handleStatusFilter("Draft")}
              className={`rounded-lg transition-colors shadow-md cursor-pointer  text-[#878787] text-[19px] font-medium ${
                statusFilter === "Draft" ? "bg-[#161616]" : "bg-[#161616] "
              }`}
              style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
            >
              Draft
            </button>
          </div>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="hidden md:block rounded-lg transition-colors outline-none bg-[#0C0C0C] shadow-md cursor-pointer  text-[#878787] text-[19px] font-medium "
            style={{
              padding: "var(--spacing-sm) var(--spacing-md)",
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
                Levels (Count)
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Avg. Rating
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Reviews (Count)
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
            {filteredMissions.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{ padding: "var(--spacing-lg)", textAlign: "center" }}
                >
                  <div
                    style={{
                      background: "#f0f0f0",
                      padding: "20px",
                      borderRadius: "8px",
                    }}
                  >
                    <h3>No missions found</h3>
                    <p>Total missions in database: {totalMissions}</p>
                    <p>Missions loaded: {missions.length}</p>
                    <p>Filtered count: {filteredMissions.length}</p>
                    <p>Loading: {loading.toString()}</p>
                    <p>Error: {error || "None"}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredMissions.map((mission, index) => {
                console.log("Rendering mission:", index + 1, mission.title);
                return (
                  <MissionRow
                    key={mission._id}
                    mission={mission}
                    index={index}
                    onInstructorClick={handleInstructorClick}
                    onMissionClick={handleMissionClick}
                    onDeleteMission={handleDeleteMission}
                    onPublishMission={handlePublishMission}
                    onUnpublishMission={handleUnpublishMission}
                    onToggleDropdown={toggleDropdown}
                    isDropdownOpen={dropdownOpen === mission._id}
                  />
                );
              })
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
        <div className="text-[8px] sm:text-[15px] italic text-[var(--text-secondary)]">
          Showing results from {(currentPage - 1) * 10 + 1}-
          {(currentPage - 1) * 10 + missions.length} of {totalMissions} Entries
        </div>
        <div className="flex items-center" style={{ gap: "var(--spacing-sm)" }}>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`text-sm rounded-lg transition-colors ${
              currentPage === 1
                ? "text-[#535353] bg-[#1D1D1D] cursor-not-allowed"
                : "text-white bg-[#840B94] hover:bg-[#8b5cf6]"
            }`}
            style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className={`text-sm rounded-lg transition-colors ${
              currentPage >= totalPages
                ? "text-[#535353] bg-[#1D1D1D] cursor-not-allowed"
                : "text-white bg-[#840B94] hover:bg-[#8b5cf6]"
            }`}
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
              Delete Mission
            </h3>
            <p
              className="text-sm text-[var(--text-secondary)]"
              style={{ marginBottom: "var(--spacing-xl)" }}
            >
              Are you sure you want to delete &quot;{deleteModal.missionTitle}
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
                onClick={cancelDeleteMission}
                className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors rounded-lg font-medium"
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteMission}
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
