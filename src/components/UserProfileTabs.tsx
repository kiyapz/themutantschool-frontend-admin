"use client";

import { useState } from "react";
import { Mail, Trash2 } from "lucide-react";

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
          ? "text-[var(--accent-purple)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      }`}
      style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
    >
      {label}
    </button>
  );
}

function ProfileSummaryCard() {
  return (
    <div
      className="bg-[var(--bg-card)] rounded-lg"
      style={{ padding: "var(--spacing-xl)" }}
    >
      <div className="flex items-start" style={{ gap: "var(--spacing-lg)" }}>
        {/* Profile Picture */}
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-red-500 rounded-full flex-shrink-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Abdulrahman Assan
          </h2>
          <p
            className="text-sm text-[var(--text-secondary)]"
            style={{ marginTop: "var(--spacing-xs)" }}
          >
            @AbdulrahmanAssan
          </p>

          {/* Statistics */}
          <div
            className="flex"
            style={{ gap: "var(--spacing-xl)", marginTop: "var(--spacing-lg)" }}
          >
            <div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                4
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                Active Missions
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                6
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                Published Missions
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                $200.22
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                Total Revenue
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                $101
              </div>
              <div className="text-xs text-[var(--text-secondary)]">Payout</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BioSection() {
  return (
    <div
      className="bg-[var(--bg-card)] rounded-lg"
      style={{ padding: "var(--spacing-xl)" }}
    >
      <h3
        className="text-lg font-semibold text-[var(--text-primary)]"
        style={{ marginBottom: "var(--spacing-md)" }}
      >
        Bio
      </h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
    </div>
  );
}

function PersonalInformationSection() {
  const personalInfo = [
    { label: "Email Address", value: "etienodouglas@gmail.com" },
    { label: "Phone Number", value: "+234 (0) 909495797" },
    { label: "Gender", value: "Male" },
    { label: "Nationality", value: "Nigerian" },
    { label: "Date Of Birth", value: "12 - FEB - 2000" },
    { label: "Preferred Language", value: "English (UK)" },
  ];

  return (
    <div
      className="bg-[var(--bg-card)] rounded-lg"
      style={{ padding: "var(--spacing-xl)" }}
    >
      <h3
        className="text-lg font-semibold text-[var(--text-primary)]"
        style={{ marginBottom: "var(--spacing-lg)" }}
      >
        Personal Information
      </h3>
      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ gap: "var(--spacing-md)" }}
      >
        {personalInfo.map((info, index) => (
          <div key={index}>
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

function SocialLinksSection() {
  const socialLinks = [
    { platform: "Facebook", url: "facebook.com/abdulrahmenssen" },
    { platform: "Instagram", url: "instagram.com/labdulassan_8" },
    { platform: "LinkedIn", url: "linkedin.com/in/abdulassan" },
    { platform: "X (Formerly twitter)", url: "x.com/abddu123" },
    { platform: "Website Link", url: "https://www.abdulrahmaressan.com/" },
  ];

  return (
    <div
      className="bg-[var(--bg-card)] rounded-lg"
      style={{ padding: "var(--spacing-xl)" }}
    >
      <h3
        className="text-lg font-semibold text-[var(--text-primary)]"
        style={{ marginBottom: "var(--spacing-lg)" }}
      >
        Social Links
      </h3>
      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ gap: "var(--spacing-md)" }}
      >
        {socialLinks.map((link, index) => (
          <div key={index}>
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

  return (
    <div className="flex flex-col min-h-full">
      {/* Profile Header */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: "var(--spacing-lg)" }}
      >
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Profile
        </h1>
        <div className="flex items-center" style={{ gap: "var(--spacing-sm)" }}>
          <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <Mail size={20} />
          </button>
          <button
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
      {activeTab === "User Profile" && (
        <div className="flex flex-col" style={{ gap: "var(--spacing-lg)" }}>
          <ProfileSummaryCard />
          <BioSection />
          <PersonalInformationSection />
          <SocialLinksSection />
        </div>
      )}

      {activeTab === "Missions" && (
        <div className="flex flex-col" style={{ gap: "var(--spacing-lg)" }}>
          {/* Mission Stats */}
          <div
            className="bg-[var(--bg-card)] rounded-lg"
            style={{ padding: "var(--spacing-xl)" }}
          >
            <h3
              className="text-lg font-semibold text-[var(--text-primary)]"
              style={{ marginBottom: "var(--spacing-lg)" }}
            >
              Mission Statistics
            </h3>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              style={{ gap: "var(--spacing-lg)" }}
            >
              <div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  4
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  Active Missions
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  6
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  Published Missions
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  71
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  Total Recruits
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  50
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  Certificates Issued
                </div>
              </div>
            </div>
          </div>

          {/* Missions List */}
          <div className="bg-[var(--bg-card)] rounded-lg">
            <div style={{ padding: "var(--spacing-lg)" }}>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Published Missions
              </h3>
            </div>

            <div style={{ padding: "var(--spacing-lg)", paddingTop: "0" }}>
              <div
                className="flex flex-col"
                style={{ gap: "var(--spacing-md)" }}
              >
                {/* Mission 1 */}
                <div
                  className="bg-[var(--bg-tertiary)] rounded-lg"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  <div
                    className="flex items-center"
                    style={{ gap: "var(--spacing-md)" }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-red-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-md"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--text-primary)] truncate">
                        Javascript Fundamental
                      </h4>
                      <p
                        className="text-sm text-[var(--text-secondary)]"
                        style={{ marginTop: "var(--spacing-xs)" }}
                      >
                        Published Mission
                      </p>
                      <div
                        className="flex"
                        style={{
                          gap: "var(--spacing-md)",
                          marginTop: "var(--spacing-sm)",
                        }}
                      >
                        <span className="text-sm font-medium text-[var(--accent-yellow)]">
                          71 Recruits
                        </span>
                        <span className="text-sm font-medium text-[var(--accent-yellow)]">
                          50 Certificates
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mission 2 */}
                <div
                  className="bg-[var(--bg-tertiary)] rounded-lg"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  <div
                    className="flex items-center"
                    style={{ gap: "var(--spacing-md)" }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-md"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--text-primary)] truncate">
                        Mobile App Design
                      </h4>
                      <p
                        className="text-sm text-[var(--text-secondary)]"
                        style={{ marginTop: "var(--spacing-xs)" }}
                      >
                        Published Mission
                      </p>
                      <div
                        className="flex"
                        style={{
                          gap: "var(--spacing-md)",
                          marginTop: "var(--spacing-sm)",
                        }}
                      >
                        <span className="text-sm font-medium text-[var(--accent-yellow)]">
                          50 Recruits
                        </span>
                        <span className="text-sm font-medium text-[var(--accent-yellow)]">
                          20 Certificates
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mission 3 */}
                <div
                  className="bg-[var(--bg-tertiary)] rounded-lg"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  <div
                    className="flex items-center"
                    style={{ gap: "var(--spacing-md)" }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-md"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--text-primary)] truncate">
                        Flutter+ Masterclass
                      </h4>
                      <p
                        className="text-sm text-[var(--text-secondary)]"
                        style={{ marginTop: "var(--spacing-xs)" }}
                      >
                        Published Mission
                      </p>
                      <div
                        className="flex"
                        style={{
                          gap: "var(--spacing-md)",
                          marginTop: "var(--spacing-sm)",
                        }}
                      >
                        <span className="text-sm font-medium text-[var(--accent-yellow)]">
                          43 Recruits
                        </span>
                        <span className="text-sm font-medium text-[var(--accent-yellow)]">
                          21 Certificates
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mission 4 */}
                <div
                  className="bg-[var(--bg-tertiary)] rounded-lg"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  <div
                    className="flex items-center"
                    style={{ gap: "var(--spacing-md)" }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-md"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--text-primary)] truncate">
                        HTML Basics
                      </h4>
                      <p
                        className="text-sm text-[var(--text-secondary)]"
                        style={{ marginTop: "var(--spacing-xs)" }}
                      >
                        Published Mission
                      </p>
                      <div
                        className="flex"
                        style={{
                          gap: "var(--spacing-md)",
                          marginTop: "var(--spacing-sm)",
                        }}
                      >
                        <span className="text-sm font-medium text-[var(--accent-yellow)]">
                          35 Recruits
                        </span>
                        <span className="text-sm font-medium text-[var(--accent-yellow)]">
                          15 Certificates
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mission 5 */}
                <div
                  className="bg-[var(--bg-tertiary)] rounded-lg"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  <div
                    className="flex items-center"
                    style={{ gap: "var(--spacing-md)" }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-md"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--text-primary)] truncate">
                        CSS Fundamentals
                      </h4>
                      <p
                        className="text-sm text-[var(--text-secondary)]"
                        style={{ marginTop: "var(--spacing-xs)" }}
                      >
                        Published Mission
                      </p>
                      <div
                        className="flex"
                        style={{
                          gap: "var(--spacing-md)",
                          marginTop: "var(--spacing-sm)",
                        }}
                      >
                        <span className="text-sm font-medium text-[var(--accent-yellow)]">
                          28 Recruits
                        </span>
                        <span className="text-sm font-medium text-[var(--accent-yellow)]">
                          12 Certificates
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mission 6 */}
                <div
                  className="bg-[var(--bg-tertiary)] rounded-lg"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  <div
                    className="flex items-center"
                    style={{ gap: "var(--spacing-md)" }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-md"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--text-primary)] truncate">
                        React.js Basics
                      </h4>
                      <p
                        className="text-sm text-[var(--text-secondary)]"
                        style={{ marginTop: "var(--spacing-xs)" }}
                      >
                        Published Mission
                      </p>
                      <div
                        className="flex"
                        style={{
                          gap: "var(--spacing-md)",
                          marginTop: "var(--spacing-sm)",
                        }}
                      >
                        <span className="text-sm font-medium text-[var(--accent-yellow)]">
                          42 Recruits
                        </span>
                        <span className="text-sm font-medium text-[var(--accent-yellow)]">
                          18 Certificates
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
