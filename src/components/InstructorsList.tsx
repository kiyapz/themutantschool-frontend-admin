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
        isActive ? "bg-[#191B30] text-[#387EFF]" : "bg-[#757575] text-[#757575]"
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
  const location = instructor.profile.country || 'Unknown';
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <tr
      // style={{ borderBottom: "1px solid var(--border-primary)" }}
      style={{ marginBottom: "20px",}}
      className="bg-[#0C0C0C] cursor-pointer transition-colors"
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
            <div className="text-[12px] text-[#5F5F5F]">{location}</div>
          </div>
        </div>
      </td>
      <td
        className="text-sm text-[#5F5F5F]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {instructor.stats.activeMissions}
      </td>
      <td
        className="text-sm text-[#5F5F5F]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {instructor.stats.completedMissions}
      </td>
      <td
        className="text-sm text-[#5F5F5F]"
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
          <div className="text-xs text-[#5F5F5F]">
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

      const response = await adminApi.get("/users/instructors");

      if (response.data.success) {
        // The array is in response.data.data.data
        console.log("=== DEBUGGING DATA ACCESS ===");
        console.log("response.data:", response.data);
       
        console.log(
          "response.data.data.data type:",
          typeof response.data?.data?.data
        );
        console.log(
          "response.data.data.data is array:",
          Array.isArray(response.data?.data?.data)
        );
        console.log(
          "response.data.data.data length:",
          response.data?.data?.data?.length
        );

        const instructorsData = response.data?.data?.data;
        console.log("Instructors data:", instructorsData);
        console.log("Instructors data type:", typeof instructorsData);
        console.log(
          "Instructors data is array:",
          Array.isArray(instructorsData)
        );
        console.log("=== END DEBUGGING ===");

        // Check if data is nested in a different structure
        let actualInstructorsData = instructorsData;
        if (
          !Array.isArray(instructorsData) &&
          instructorsData &&
          typeof instructorsData === "object"
        ) {
          // Try to find the array in the object
          if (instructorsData.data && Array.isArray(instructorsData.data)) {
            actualInstructorsData = instructorsData.data;
            console.log(
              "Found instructors array in instructorsData.data:",
              actualInstructorsData
            );
          } else if (
            instructorsData.instructors &&
            Array.isArray(instructorsData.instructors)
          ) {
            actualInstructorsData = instructorsData.instructors;
            console.log(
              "Found instructors array in instructorsData.instructors:",
              actualInstructorsData
            );
          }
        }

        if (Array.isArray(actualInstructorsData)) {
          console.log("✅ SUCCESS: Instructors data is an array!");
          console.log("Instructors count:", actualInstructorsData.length);
          console.log("=== INDIVIDUAL INSTRUCTORS ===");
          actualInstructorsData.forEach((instructor: any, index: number) => {
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
          const transformedInstructors = actualInstructorsData.map(
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

         
         
          setInstructors(transformedInstructors);
          console.log("=== INSTRUCTORS FETCH COMPLETE ===");
        } else {
          
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
      <div className="">
        <div
          className="flex items-center justify-center"
          style={{ padding: "var(--spacing-2xl)" }}
        >
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#7343B3] border-t-transparent rounded-full animate-spin mx-auto"></div>
           
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
    <div className=" rounded-lg flex flex-col gap-8">
      {/* Header */}
      <div
        className="flex items-center justify-between bg-[#0C0C0C] rounded-[20px]"
        style={{
          padding: "var(--spacing-lg)",
          // marginBottom: "var(--spacing-lg)",
        }}
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
              className={`rounded-lg transition-colors shadow-md cursor-pointer  text-[#878787] text-[19px] font-medium  ${
                statusFilter === "all" ? "bg-[#161616] " : "bg-[#161616]  "
              }`}
              style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilter("active")}
              className={`rounded-lg transition-colors shadow-md cursor-pointer  text-[#878787] text-[19px] font-medium  ${
                statusFilter === "all" ? "bg-[#161616] " : "bg-[#161616]  "
              }`}
              style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
            >
              Active
            </button>
            <button
              onClick={() => handleStatusFilter("inactive")}
              className={`rounded-lg transition-colors shadow-md cursor-pointer  text-[#878787] text-[19px] font-medium  ${
                statusFilter === "all" ? "bg-[#161616] " : "bg-[#161616]  "
              }`}
              style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
            >
              Inactive
            </button>
          </div>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className={`rounded-lg transition-colors outline-none shadow-md cursor-pointer  text-[#878787] text-[19px] font-medium  ${
              statusFilter === "all" ? "bg-[#161616] " : "bg-[#161616]  "
            }`}
            style={{
              padding: "var(--spacing-sm) var(--spacing-md)",
              border: "",
            }}
          >
            <option value="oldest-to-newest">
              <span className="text-[#ffffff] text-[19px] font-medium">
                Sort By:{" "}
              </span>{" "}
              Oldest to Newest
            </option>
            <option value="newest-to-oldest">Sort By: Newest to Oldest</option>
            <option value="name-a-z">Sort By: Name A-Z</option>
            <option value="name-z-a">Sort By: Name Z-A</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }} className=" ">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
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
                Recruits
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
          <tbody style={{ marginBottom: "10px" }}>
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
          // borderTop: "1px solid var(--border-primary)",
        }}
      >
        <div className="text-[15px] italic text-[var(--text-secondary)]">
          instructors Showing results from 1- {filteredInstructors.length} of{" "}
          {instructors.length} Entries
        </div>
        <div className="flex items-center" style={{ gap: "var(--spacing-sm)" }}>
          <button
            className="text-sm text-[#535353] bg-[#1D1D1D] rounded-lg cursor-not-allowed"
            style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
          >
            Previous
          </button>
          <button
            className="text-sm text-white bg-[#840B94] rounded-lg cursor-pointer transition-colors"
            style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
