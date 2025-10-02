"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2 } from "lucide-react";
import adminApi from "@/utils/api";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  profile: {
    avatar?: { url: string };
    phone?: string;
    country: string;
    city: string;
  };
  completedMissions: any[];
  // Computed properties
  status: "active" | "inactive";
  joinDate: string;
  enrollment: {
    enrolledMissions: number;
    certificates: number;
    badges: number;
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
        isActive ? "bg-[#191B30] text-[#387EFF]" : "bg-[#2B2B2B] text-[#757575]"
      }`}
      style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </button>
  );
}

function StudentRow({
  student,
  index,
  onClick,
  onDelete,
  onToggleDropdown,
  isDropdownOpen,
}: {
  student: Student;
  index: number;
  onClick: () => void;
  onDelete: (studentId: string) => void;
  onToggleDropdown: (studentId: string) => void;
  isDropdownOpen: boolean;
}) {
  const fullName = `${student.firstName} ${student.lastName}`;
  const location = student.profile.country || 'Unknown';

  return (
    <tr
      onClick={onClick}
      style={{
        // borderBottom: "1px solid var(--border-primary)",
        cursor: "pointer",
        marginBottom: "20px",
      }}
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
          {student.profile.avatar?.url ? (
            <img
              src={student.profile.avatar.url}
              alt={fullName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center text-white font-bold text-xs">
              {student.firstName.charAt(0)}
              {student.lastName.charAt(0)}
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-[var(--text-primary)]">
              {fullName}
            </div>
            <div className="text-xs text-[#5F5F5F]">{location}</div>
          </div>
        </div>
      </td>
      <td
        className="text-sm text-[#5F5F5F]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {student.enrollment.enrolledMissions}
      </td>
      <td
        className="text-sm text-[#5F5F5F]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {student.completedMissions?.length || 0}
      </td>
      <td
        className="text-sm text-[#5F5F5F]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {student.enrollment.certificates}
      </td>
      <td style={{ padding: "var(--spacing-md)" }}>
        <StatusButton status={student.status} />
      </td>
      <td style={{ padding: "var(--spacing-md)" }}>
        <div className="relative" data-dropdown>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleDropdown(student._id);
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(student._id);
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

export default function StudentsList() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("oldest-to-newest");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [mounted, setMounted] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    studentId: string | null;
    studentName: string;
  }>({
    show: false,
    studentId: null,
    studentName: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleStudentClick = (student: Student) => {
    // Clear any existing user data in localStorage
    localStorage.removeItem("selectedInstructor");
    localStorage.removeItem("selectedAffiliate");

    // Store the student data in localStorage
    localStorage.setItem("selectedStudent", JSON.stringify(student));

    // Navigate to profile page
    router.push("/profile");
  };

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find((s) => s._id === studentId);
    if (student) {
      setDeleteModal({
        show: true,
        studentId: studentId,
        studentName: `${student.firstName} ${student.lastName}`,
      });
    }
  };

  const confirmDeleteStudent = async () => {
    if (!deleteModal.studentId) return;

    try {
      setIsDeleting(true);
      setError(null);
      setSuccessMessage(null);

      console.log("Deleting student:", deleteModal.studentId);
      const response = await adminApi.delete(
        `/users/users/${deleteModal.studentId}`
      );

      if (response.status === 200) {
        console.log("Student deleted successfully");
        // Remove the student from the local state
        setStudents((prevStudents) =>
          prevStudents.filter((s) => s._id !== deleteModal.studentId)
        );
        setDeleteModal({ show: false, studentId: null, studentName: "" });
        setDropdownOpen(null);
        setSuccessMessage("Student deleted successfully!");

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        console.error("Failed to delete student:", response.data);
        setError("Failed to delete student. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting student:", err);
      setError("Error deleting student. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteStudent = () => {
    setDeleteModal({ show: false, studentId: null, studentName: "" });
  };

  const toggleDropdown = (studentId: string) => {
    console.log("Toggling dropdown for student:", studentId);
    console.log("Current dropdown open:", dropdownOpen);
    setDropdownOpen(dropdownOpen === studentId ? null : studentId);
  };

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
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
          );
        case "oldest-to-newest":
          return (
            new Date(a.createdAt || "").getTime() -
            new Date(b.createdAt || "").getTime()
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
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("--- Fetching Students ---");
        const response = await adminApi.get("/users/students");
        console.log("Students API Response:", response.data);

        // Data is nested in response.data.data.data
        const studentsData = response.data?.data?.data;

        if (studentsData && Array.isArray(studentsData)) {
          console.log(`✅ Success! Found ${studentsData.length} students.`);
          // Transform data to match front-end interface
          const transformedStudents = studentsData.map((student: any) => ({
            ...student,
            status: student.isActive ? "active" : "inactive",
            joinDate: student.createdAt,
            enrollment: {
              enrolledMissions: student.completedMissions?.length || 0, // Assuming enrolled is same as completed for now
              certificates: student.badges?.length || 0, // Assuming certs are badges for now
              badges: student.badges?.length || 0,
            },
          }));
          console.log("Transformed Students:", transformedStudents);
          setStudents(transformedStudents);
        } else {
          const errorMsg =
            "Data received, but it is not in the expected format (array missing).";
          console.error("❌", errorMsg, response.data);
          setError(errorMsg);
          setStudents([]);
        }
      } catch (err: unknown) {
        console.error("❌ Error fetching students:", err);
        const errorMessage =
          err instanceof Error && "response" in err
            ? (err as { response?: { data?: { error?: string } } }).response
                ?.data?.error || "Failed to fetch students"
            : "Failed to fetch students";
        setError(errorMessage);
        setStudents([]);
      } finally {
        setLoading(false);
        console.log("--- Finished Fetching Students ---");
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  if (!mounted) {
    return (
      <div className=" ">
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

  if (loading) {
    return (
      <div className=" rounded-lg">
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
              onClick={() => {
                const fetchStudents = async () => {
                  try {
                    setLoading(true);
                    setError(null);
                    console.log("--- Retry: Fetching Students ---");
                    const response = await adminApi.get("/users/students");
                    console.log("Students API Response:", response.data);

                    const studentsData = response.data?.data?.data;

                    if (studentsData && Array.isArray(studentsData)) {
                      console.log(
                        `✅ Retry Success! Found ${studentsData.length} students.`
                      );
                      const transformedStudents = studentsData.map(
                        (student: any) => ({
                          ...student,
                          status: student.isActive ? "active" : "inactive",
                          joinDate: student.createdAt,
                          enrollment: {
                            enrolledMissions:
                              student.completedMissions?.length || 0,
                            certificates: student.badges?.length || 0,
                            badges: student.badges?.length || 0,
                          },
                        })
                      );
                      setStudents(transformedStudents);
                    } else {
                      setError(
                        "Failed to fetch students - invalid data format"
                      );
                    }
                  } catch (err: unknown) {
                    console.error("❌ Retry Error fetching students:", err);
                    const errorMessage =
                      err instanceof Error && "response" in err
                        ? (err as { response?: { data?: { error?: string } } })
                            .response?.data?.error || "Failed to fetch students"
                        : "Failed to fetch students";
                    setError(errorMessage);
                  } finally {
                    setLoading(false);
                    console.log("--- Retry: Finished Fetching Students ---");
                  }
                };
                fetchStudents();
              }}
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
          Students List
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
            <tr style={{ marginBottom: "10px" }}>
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
              <StudentRow
                key={student._id}
                student={student}
                index={index}
                onClick={() => handleStudentClick(student)}
                onDelete={handleDeleteStudent}
                onToggleDropdown={toggleDropdown}
                isDropdownOpen={dropdownOpen === student._id}
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
        }}
      >
        <div className="text-[15px] text-[var(--text-secondary)] italic">
          Showing results from 1- {filteredStudents.length} of {students.length}
          Entries 
        </div>
        <div className="flex items-center" style={{ gap: "var(--spacing-sm)" }}>
          <button
            className="text-sm text-[#535353] bg-[#1D1D1D] rounded-lg cursor-not-allowed"
            style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
          >
            Previous
          </button>
          <button
            className="text-sm text-white bg-[#840B94] cursor-pointer rounded-lg  transition-colors"
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
              Delete Student
            </h3>
            <p
              className="text-sm text-[var(--text-secondary)]"
              style={{ marginBottom: "var(--spacing-xl)" }}
            >
              Are you sure you want to delete &quot;{deleteModal.studentName}
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
                onClick={cancelDeleteStudent}
                className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors rounded-lg font-medium"
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteStudent}
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
