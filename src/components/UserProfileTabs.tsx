"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Mail, Trash2, Eye } from "lucide-react";
import adminApi from "@/utils/api";

interface InstructorData {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  phoneNumber?: string;
  gender?: string;
  nationality?: string;
  dateOfBirth?: string;
  preferredLanguage?: string;
  profile?: {
    avatar?: { url: string };
    phone?: string;
    country?: string;
    city?: string;
    bio?: string;
    headline?: string;
    socialLinks?: {
      facebook?: string;
      linkedin?: string;
      github?: string;
      twitter?: string;
      instagram?: string;
      website?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  stats?: {
    activeMissions?: number;
    totalMissions?: number;
    [key: string]: unknown;
  };
  earnings?: {
    totalEarnings?: number;
    currency?: string;
    [key: string]: unknown;
  };
  earningsBalance?: number;
  [key: string]: unknown;
}

interface MissionData {
  _id?: string;
  title?: string;
  category?: string;
  skillLevel?: string;
  description?: string;
  shortDescription?: string;
  bio?: string;
  estimatedDuration?: string;
  averageRating?: number;
  reviews?: unknown[];
  thumbnail?: { url: string };
  levels?: Array<{ name?: string; title?: string; description?: string; [key: string]: unknown }>;
  tags?: Array<string | unknown>;
  isPublished?: boolean;
  status?: string;
  [key: string]: unknown;
}

interface Level {
  name?: string;
  title?: string;
  description?: string;
  [key: string]: unknown;
}

interface ProfileTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function ProfileTab({ label, isActive, onClick }: ProfileTabProps) {
  return (
    <button
      onClick={onClick}
      className={`text-sm font-medium transition-colors ${
        isActive
          ? "text-[#7343B3]"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      }`}
      style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
    >
      {label}
    </button>
  );
}

function ProfileSummaryCard({ instructorData }: { instructorData: InstructorData }) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div
      className="bg-[#0C0C0C] rounded-lg"
      style={{ padding: "var(--spacing-xl)" }}
    >
      <div className="flex items-start" style={{ gap: "var(--spacing-lg)" }}>
        {/* Profile Picture */}
        {instructorData?.profile?.avatar?.url ? (
          <Image
            src={instructorData.profile.avatar.url}
            alt={`${instructorData.firstName || ""} ${instructorData.lastName || ""}`}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-red-500 rounded-full flex-shrink-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>
          </div>
        )}

        {/* Profile Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            {instructorData?.firstName} {instructorData?.lastName}
          </h2>
          <p
            className="text-sm text-[var(--text-secondary)]"
            style={{ marginTop: "var(--spacing-xs)" }}
          >
            @{instructorData?.username}
          </p>

          {/* Statistics */}
          <div
            className="flex"
            style={{ gap: "var(--spacing-xl)", marginTop: "var(--spacing-lg)" }}
          >
            <div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                {instructorData?.stats?.activeMissions || 0}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                Active Missions
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                {instructorData?.stats?.totalMissions || 0}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                Total Missions
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                {formatCurrency(
                  instructorData?.earnings?.totalEarnings || 0,
                  instructorData?.earnings?.currency || "USD"
                )}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                Total Earnings
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                {formatCurrency(
                  instructorData?.earningsBalance || 0,
                  instructorData?.earnings?.currency || "USD"
                )}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                Balance
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BioSection({ instructorData }: { instructorData: InstructorData }) {
  return (
    <div
      className="bg-[#0C0C0C] rounded-lg"
      style={{ padding: "var(--spacing-xl)" }}
    >
      <h3
        className="text-lg font-semibold text-[var(--text-primary)]"
        style={{ marginBottom: "var(--spacing-md)" }}
      >
        Bio
      </h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
        {instructorData?.profile?.bio || "No bio available"}
      </p>
      {instructorData?.profile?.headline && (
        <p
          className="text-sm text-[var(--text-primary)] font-medium"
          style={{ marginTop: "var(--spacing-sm)" }}
        >
          {instructorData.profile.headline}
        </p>
      )}
    </div>
  );
}

function PersonalInformationSection({
  instructorData,
}: {
  instructorData: InstructorData;
}) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  };

  const personalInfo = [
    { label: "Email Address", value: instructorData?.email || "N/A" },
    { label: "Phone Number", value: instructorData?.phoneNumber || "N/A" },
    { label: "Gender", value: instructorData?.gender || "N/A" },
    { label: "Nationality", value: instructorData?.nationality || "N/A" },
    { label: "Date Of Birth", value: formatDate(instructorData?.dateOfBirth || "") },
    {
      label: "Preferred Language",
      value: instructorData?.preferredLanguage || "N/A",
    },
  ];

  return (
    <div
      className="bg-[#0C0C0C] rounded-lg"
      style={{ padding: "var(--spacing-xl)" }}
    >
      <h3
        className="text-lg font-semibold text-[var(--text-primary)]"
        style={{ marginBottom: "var(--spacing-lg)" }}
      >
        Personal Information
      </h3>
      <div
        className=""
        style={{ gap: "var(--spacing-md)" }}
      >
        {personalInfo.map((info, index) => (
          <div key={index} className="grid grid-cols-2 gap-2 w-full">
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
              {info.label}
            </div>
            <div
              className="text-sm text-[var(--text-primary)]"
              style={{ marginTop: "var(--spacing-xs)" }}
            >
              {info.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SocialLinksSection({ instructorData }: { instructorData: InstructorData }) {
  const socialLinks: Array<{ platform: string; url: string }> = [
    {
      platform: "Facebook",
      url: instructorData?.profile?.socialLinks?.facebook || "N/A",
    },
    {
      platform: "Instagram",
      url: instructorData?.profile?.socialLinks?.instagram || "N/A",
    },
    {
      platform: "LinkedIn",
      url: instructorData?.profile?.socialLinks?.linkedin || "N/A",
    },
    {
      platform: "X (Formerly twitter)",
      url: instructorData?.profile?.socialLinks?.twitter || "N/A",
    },
    {
      platform: "Website Link",
      url: instructorData?.profile?.socialLinks?.website || "N/A",
    },
  ];

  return (
    <div
      className="bg-[#0C0C0C] rounded-lg"
      style={{ padding: "var(--spacing-xl)" }}
    >
      <h3
        className="text-lg font-semibold text-[var(--text-primary)]"
        style={{ marginBottom: "var(--spacing-lg)" }}
      >
        Social Links
      </h3>
      <div
        className=""
        style={{ gap: "var(--spacing-md)" }}
      >
        {socialLinks.map((link, index) => (
          <div key={index} className="grid grid-cols-2 gap-2 w-full">
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
              {link.platform}
            </div>
            <div
              className="text-sm text-[var(--text-primary)]"
              style={{ marginTop: "var(--spacing-xs)" }}
            >
              {link.url}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UserProfileTabs() {
  const [activeTab, setActiveTab] = useState("User Profile");
  const [userData, setUserData] = useState<InstructorData | null>(null);
  const [missionData, setMissionData] = useState<MissionData | null>(null);
  const [userType, setUserType] = useState<
    "instructor" | "student" | "affiliate" | null
  >(null);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    missionId: string | null;
    missionTitle: string;
  }>({
    show: false,
    missionId: null,
    missionTitle: "",
  });
  const [userDeleteModal, setUserDeleteModal] = useState<{
    show: boolean;
    userId: string | null;
    userName: string;
    userType: string | null;
  }>({
    show: false,
    userId: null,
    userName: "",
    userType: null,
  });
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [isDeletingMission, setIsDeletingMission] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Clear previous state
    setUserData(null);
    setUserType(null);
    setMissionData(null);

    // Try to load instructor data first
    const storedInstructorData = localStorage.getItem("selectedInstructor");
    if (storedInstructorData) {
      try {
        const data = JSON.parse(storedInstructorData);
        console.log("Loaded instructor data:", data);
        setUserData(data);
        setUserType("instructor");
      } catch (error) {
        console.error("Error parsing instructor data:", error);
        localStorage.removeItem("selectedInstructor");
      }
    }

    // If no instructor data, try to load student data
    const storedStudentData = localStorage.getItem("selectedStudent");
    if (storedStudentData) {
      try {
        const data = JSON.parse(storedStudentData);
        console.log("Loaded student data:", data);
        setUserData(data);
        setUserType("student");
      } catch (error) {
        console.error("Error parsing student data:", error);
        localStorage.removeItem("selectedStudent");
      }
    }

    // If no student data, try to load affiliate data
    const storedAffiliateData = localStorage.getItem("selectedAffiliate");
    if (storedAffiliateData) {
      try {
        const data = JSON.parse(storedAffiliateData);
        console.log("Loaded affiliate data:", data);
        setUserData(data);
        setUserType("affiliate");
      } catch (error) {
        console.error("Error parsing affiliate data:", error);
        localStorage.removeItem("selectedAffiliate");
      }
    }

    // Load mission data
    const storedMissionData = localStorage.getItem("selectedMission");
    if (storedMissionData) {
      try {
        const data = JSON.parse(storedMissionData);
        console.log("Loaded mission data:", data);
        setMissionData(data);
      } catch (error) {
        console.error("Error parsing mission data:", error);
        localStorage.removeItem("selectedMission");
      }
    }
  }, []);

  const handleDeleteMission = (missionId: string) => {
    if (missionData && missionData._id === missionId) {
      setDeleteModal({
        show: true,
        missionId: missionId,
        missionTitle: missionData.title || "Unknown Mission",
      });
    }
  };

  const confirmDeleteMission = async () => {
    if (!deleteModal.missionId) return;

    try {
      setIsDeletingMission(true);
      setSuccessMessage(null);

      console.log("Deleting mission:", deleteModal.missionId);
      const response = await adminApi.delete(
        `/missions/${deleteModal.missionId}`
      );

      if (response.status === 200) {
        console.log("Mission deleted successfully");
        setSuccessMessage("Mission deleted successfully!");

        // Clear mission data and redirect to missions page after a short delay
        setTimeout(() => {
          setDeleteModal({ show: false, missionId: null, missionTitle: "" });
          localStorage.removeItem("selectedMission");
          window.location.href = "/missions";
        }, 1500);
      } else {
        console.error("Failed to delete mission:", response.data);
        alert("Failed to delete mission. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting mission:", err);
      alert("Error deleting mission. Please try again.");
    } finally {
      setIsDeletingMission(false);
    }
  };

  const cancelDeleteMission = () => {
    setDeleteModal({ show: false, missionId: null, missionTitle: "" });
  };

  const handlePublishMission = async (missionId: string) => {
    try {
      console.log("Publishing mission:", missionId);
      const response = await adminApi.put(`/missions/${missionId}/publish`, {
        isPublished: true,
      });

      if (response.status === 200) {
        console.log("Mission published successfully");
        // Update the mission data in state
        setMissionData((prev: MissionData | null) => ({
          ...prev,
          isPublished: true,
          status: "published",
        }));
        alert("Mission published successfully!");
      } else {
        console.error("Failed to publish mission:", response.data);
        alert("Failed to publish mission. Please try again.");
      }
    } catch (err) {
      console.error("Error publishing mission:", err);
      alert("Error publishing mission. Please try again.");
    }
  };

  const handleDeleteUser = () => {
    if (userData) {
      setUserDeleteModal({
        show: true,
        userId: userData._id ?? null,
        userName: `${userData.firstName} ${userData.lastName}`,
        userType: userType,
      });
    }
  };

  const confirmDeleteUser = async () => {
    if (!userDeleteModal.userId) return;

    try {
      setIsDeletingUser(true);
      setSuccessMessage(null);

      console.log("Deleting user:", userDeleteModal.userId);
      const response = await adminApi.delete(
        `/users/users/${userDeleteModal.userId}`
      );

      if (response.status === 200) {
        console.log("User deleted successfully");
        setSuccessMessage(
          `${
            userDeleteModal.userType
              ? userDeleteModal.userType.charAt(0).toUpperCase() +
                userDeleteModal.userType.slice(1)
              : "User"
          } deleted successfully!`
        );

        // Clear localStorage and redirect to appropriate list after a short delay
        setTimeout(() => {
          localStorage.removeItem("selectedInstructor");
          localStorage.removeItem("selectedStudent");
          localStorage.removeItem("selectedAffiliate");
          localStorage.removeItem("selectedMission");

          // Redirect based on user type
          if (userDeleteModal.userType === "instructor") {
            window.location.href = "/instructors";
          } else if (userDeleteModal.userType === "student") {
            window.location.href = "/students";
          } else if (userDeleteModal.userType === "affiliate") {
            window.location.href = "/affiliates";
          } else {
            window.location.href = "/admin";
          }
        }, 1500);
      } else {
        console.error("Failed to delete user:", response.data);
        alert("Failed to delete user. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Error deleting user. Please try again.");
    } finally {
      setIsDeletingUser(false);
    }
  };

  const cancelDeleteUser = () => {
    setUserDeleteModal({
      show: false,
      userId: null,
      userName: "",
      userType: null,
    });
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Success Message */}
      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
          style={{ marginBottom: "var(--spacing-md)" }}
        >
          {successMessage}
        </div>
      )}

      {/* Profile Header */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: "var(--spacing-lg)" }}
      >
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          {userType === "instructor"
            ? "Instructor Profile"
            : userType === "affiliate"
            ? "Affiliate Profile"
            : "Student Profile"}
        </h1>
        <div className="flex items-center" style={{ gap: "var(--spacing-sm)" }}>
          <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <Mail size={20} />
          </button>
          <button
            onClick={handleDeleteUser}
            className="bg-[var(--accent-red)] text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
            style={{
              gap: "var(--spacing-xs)",
              padding: "var(--spacing-sm) var(--spacing-md)",
            }}
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex"
        style={{
          borderBottom: "1px solid var(--border-primary)",
          marginBottom: "var(--spacing-lg)",
        }}
      >
        <ProfileTab
          label="User Profile"
          isActive={activeTab === "User Profile"}
          onClick={() => setActiveTab("User Profile")}
        />
        <ProfileTab
          label="Missions"
          isActive={activeTab === "Missions"}
          onClick={() => setActiveTab("Missions")}
        />
      </div>

      {/* Tab Content */}
      {activeTab === "User Profile" && userData && (
        <div className="flex flex-col" style={{ gap: "var(--spacing-lg)" }}>
          <ProfileSummaryCard instructorData={userData} />
          <BioSection instructorData={userData} />
          <PersonalInformationSection instructorData={userData} />
          <SocialLinksSection instructorData={userData} />
        </div>
      )}

      {activeTab === "User Profile" && !userData && (
        <div
          className="bg-[var(--bg-card)] rounded-lg"
          style={{ padding: "var(--spacing-xl)" }}
        >
          <p className="text-sm text-[var(--text-secondary)]">
            Loading user data...
          </p>
        </div>
      )}

      {activeTab === "Missions" && (
        <div className="flex flex-col" style={{ gap: "var(--spacing-lg)" }}>
          {missionData ? (
            <div className="bg-[#0C0C0C] rounded-lg overflow-hidden">
              {/* Mission Header */}
              <div
                className="flex flex-col md:flex-row md:items-start md:justify-between"
                style={{
                  padding: "var(--spacing-md)",
                  borderBottom: "1px solid var(--border-primary)",
                }}
              >
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">
                    {missionData.title}
                  </h3>
                  <div className="text-sm text-[var(--text-secondary)]">
                    {missionData.category || "N/A"} • {missionData.skillLevel || "N/A"}
                  </div>
                  <div
                    className="flex items-center"
                    style={{ marginTop: "var(--spacing-sm)" }}
                  >
                    <span
                      className={`rounded-full text-xs font-medium ${
                        missionData.isPublished ||
                        missionData.status?.toLowerCase() === "published"
                          ? "bg-[var(--accent-green)] text-white"
                          : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                      }`}
                      style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
                    >
                      {missionData.isPublished ||
                      missionData.status?.toLowerCase() === "published"
                        ? "Published"
                        : "Draft"}
                    </span>
                  </div>
                </div>

                <div
                  className="flex flex-col items-start md:items-end"
                  style={{
                    marginTop: "var(--spacing-md)",
                    gap: "var(--spacing-sm)",
                  }}
                >
                  <div className="text-lg font-bold text-[var(--text-primary)]">
                    {missionData.isFree || missionData.price === 0
                      ? "Free"
                      : `$${missionData.price}`}
                  </div>

                  {/* Action Buttons */}
                  <div
                    className="flex items-center"
                    style={{ gap: "var(--spacing-sm)" }}
                  >
                    {!missionData.isPublished &&
                      missionData.status?.toLowerCase() !== "published" &&
                      missionData._id && (
                        <button
                          onClick={() => handlePublishMission(missionData._id!)}
                          className="flex items-center text-[var(--accent-green)] hover:text-green-600 transition-colors text-sm font-medium"
                          style={{
                            padding: "var(--spacing-xs) var(--spacing-sm)",
                          }}
                        >
                          <Eye
                            size={14}
                            style={{ marginRight: "var(--spacing-xs)" }}
                          />
                          Publish
                        </button>
                      )}
                    {missionData._id && (
                      <button
                        onClick={() => handleDeleteMission(missionData._id!)}
                      className="flex items-center text-[var(--accent-red)] hover:text-red-600 transition-colors text-sm font-medium"
                      style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
                    >
                      <Trash2
                        size={14}
                        style={{ marginRight: "var(--spacing-xs)" }}
                      />
                      Delete
                    </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Mission Content */}
              <div style={{ padding: "var(--spacing-md)" }}>
                {/* Mission Thumbnail */}
                {missionData.thumbnail?.url && (
                  <div
                    className="rounded-lg overflow-hidden w-[200px] h-[150px]"
                    style={{ marginBottom: "var(--spacing-md)" }}
                  >
                    <Image
                      src={missionData.thumbnail.url}
                      alt={missionData.title || "Mission thumbnail"}
                      width={200}
                      height={150}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}

                {/* Mission Details Grid */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2"
                  style={{ gap: "var(--spacing-md)" }}
                >
                  <div>
                    <h4
                      className="text-lg font-semibold text-[var(--text-primary)]"
                      style={{ marginBottom: "var(--spacing-sm)" }}
                    >
                      Description
                    </h4>
                    <p className="text-[var(--text-secondary)] text-sm">
                      {missionData.description ||
                        missionData.shortDescription ||
                        missionData.bio ||
                        "No description available."}
                    </p>
                  </div>

                  <div>
                    <h4
                      className="text-lg font-semibold text-[var(--text-primary)]"
                      style={{ marginBottom: "var(--spacing-sm)" }}
                    >
                      Mission Details
                    </h4>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-xs)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--text-secondary)]">
                          Duration:
                        </span>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {missionData.estimatedDuration || "Not specified"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--text-secondary)]">
                          Rating:
                        </span>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {missionData.averageRating
                            ? `${missionData.averageRating.toFixed(1)}/5`
                            : "No ratings yet"}
                        </span>
                      </div>

                      <div className="flex items-start justify-between">
                        <span className="text-sm text-[var(--text-secondary)]">
                          Levels:
                        </span>
                        <div className="text-sm font-medium text-[var(--text-primary)] text-right max-w-48">
                          {missionData.levels &&
                          missionData.levels.length > 0 ? (
                            <div className="flex flex-col">
                              {missionData.levels.map(
                                (level: Level, index: number) => (
                                  <span key={index} className="text-xs">
                                    {level.name ||
                                      level.title ||
                                      level.description ||
                                      `Level ${index + 1}`}
                                  </span>
                                )
                              )}
                            </div>
                          ) : (
                            <span className="text-xs">No levels defined</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--text-secondary)]">
                          Reviews:
                        </span>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {missionData.reviews?.length || 0} reviews
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--text-secondary)]">
                          Price Type:
                        </span>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {missionData.isFree || missionData.price === 0
                            ? "Free"
                            : "Paid"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {missionData.tags && missionData.tags.length > 0 && (
                  <div style={{ marginTop: "var(--spacing-md)" }}>
                    <h4
                      className="text-lg font-semibold text-[var(--text-primary)]"
                      style={{ marginBottom: "var(--spacing-xs)" }}
                    >
                      Tags
                    </h4>
                    <div
                      className="flex flex-wrap"
                      style={{ gap: "var(--spacing-sm)" }}
                    >
                      {missionData.tags.map((tag: string | unknown, index: number) => {
                        let tagText: string = typeof tag === "string" ? tag : String(tag || "");
                        try {
                          if (typeof tag === "string" && tag.startsWith("[")) {
                            const parsedTags = JSON.parse(tag);
                            if (Array.isArray(parsedTags)) {
                              tagText = parsedTags.join(", ");
                            }
                          }
                        } catch (e) {
                          console.error("Error parsing tag:", e);
                        }

                        return (
                          <span
                            key={index}
                            className="bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-full text-xs"
                            style={{
                              padding: "var(--spacing-xs) var(--spacing-sm)",
                            }}
                          >
                            {tagText}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              className="bg-[var(--bg-card)] rounded-lg"
              style={{ padding: "var(--spacing-xl)" }}
            >
              <p className="text-sm text-[var(--text-secondary)] text-center">
                No mission selected. Click on a mission from the missions list
                to view details.
              </p>
            </div>
          )}
        </div>
      )}

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
                disabled={isDeletingMission}
                className={`${
                  isDeletingMission
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[var(--accent-red)] hover:bg-red-600"
                } text-white transition-colors rounded-lg font-medium`}
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                }}
              >
                {isDeletingMission ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Delete Confirmation Modal */}
      {userDeleteModal.show && (
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
              Delete{" "}
              {userDeleteModal.userType
                ? userDeleteModal.userType.charAt(0).toUpperCase() +
                  userDeleteModal.userType.slice(1)
                : "User"}
            </h3>
            <p
              className="text-sm text-[var(--text-secondary)]"
              style={{ marginBottom: "var(--spacing-xl)" }}
            >
              Are you sure you want to delete &quot;{userDeleteModal.userName}
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
                onClick={cancelDeleteUser}
                className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors rounded-lg font-medium"
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                disabled={isDeletingUser}
                className={`${
                  isDeletingUser
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[var(--accent-red)] hover:bg-red-600"
                } text-white transition-colors rounded-lg font-medium`}
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                }}
              >
                {isDeletingUser ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
