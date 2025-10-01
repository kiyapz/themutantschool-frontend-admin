"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminProfilePage() {
  const router = useRouter();
  const [adminData, setAdminData] = useState<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
    lastLogin: string;
    profile?: {
      avatar?: {
        url: string;
        key: string;
      };
    };
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Debug: Log all localStorage data
    console.log("=== ADMIN PROFILE DEBUG ===");
    console.log("All localStorage keys:", Object.keys(localStorage));
    console.log("adminProfile:", localStorage.getItem("adminProfile"));
    console.log("USER:", localStorage.getItem("USER"));
    console.log(
      "login-accessToken:",
      localStorage.getItem("login-accessToken")
    );

    // Get admin data from localStorage
    const savedAdminData = localStorage.getItem("adminProfile");
    const userData = localStorage.getItem("USER");

    if (savedAdminData) {
      try {
        const parsedData = JSON.parse(savedAdminData);
        console.log("Parsed admin data:", parsedData);
        setAdminData(parsedData);
      } catch (error) {
        console.error("Error parsing admin data:", error);
        console.log("Raw admin data:", savedAdminData);
      }
    } else if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        console.log("Using USER data instead:", parsedUserData);
        setAdminData(parsedUserData);
      } catch (error) {
        console.error("Error parsing USER data:", error);
        console.log("Raw USER data:", userData);
      }
    } else {
      console.log("No admin data found in localStorage");
      // Don't redirect, just show debug info
    }
  }, [router]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[var(--text-primary)]">Loading...</div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div
        className="min-h-screen bg-[var(--bg-primary)]"
        style={{ padding: "var(--spacing-lg)" }}
      >
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-3xl font-bold text-[var(--text-primary)]"
            style={{ marginBottom: "var(--spacing-xl)" }}
          >
            Admin Profile Debug
          </h1>

          <div
            className="bg-[var(--bg-card)] rounded-2xl shadow-lg border border-[var(--border-primary)]"
            style={{ padding: "var(--spacing-lg)" }}
          >
            <h2
              className="text-xl font-semibold text-[var(--text-primary)]"
              style={{ marginBottom: "var(--spacing-md)" }}
            >
              Debug Information
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-md)",
              }}
            >
              <div>
                <h3
                  className="text-lg font-medium text-[var(--text-primary)]"
                  style={{ marginBottom: "var(--spacing-sm)" }}
                >
                  localStorage Contents:
                </h3>
                <div
                  className="bg-[var(--bg-tertiary)] rounded-lg"
                  style={{ padding: "var(--spacing-md)" }}
                >
                  <pre className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">
                    {JSON.stringify(
                      {
                        adminProfile: localStorage.getItem("adminProfile"),
                        USER: localStorage.getItem("USER"),
                        loginAccessToken:
                          localStorage.getItem("login-accessToken"),
                        allKeys: Object.keys(localStorage),
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>

              <div>
                <h3
                  className="text-lg font-medium text-[var(--text-primary)]"
                  style={{ marginBottom: "var(--spacing-sm)" }}
                >
                  What to check:
                </h3>
                <ul
                  className="list-disc list-inside text-[var(--text-secondary)]"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-xs)",
                  }}
                >
                  <li>
                    Check if you&apos;re logged in (look for login-accessToken)
                  </li>
                  <li>Check if adminProfile or USER data exists</li>
                  <li>Check browser console for detailed logs</li>
                  <li>Try logging in again if no data is found</li>
                </ul>
              </div>

              <div
                className="flex"
                style={{
                  gap: "var(--spacing-md)",
                  marginTop: "var(--spacing-lg)",
                }}
              >
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[var(--accent-purple)] text-white rounded-lg hover:bg-purple-600 transition-colors"
                  style={{ padding: "var(--spacing-sm) var(--spacing-lg)" }}
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => router.push("/admin")}
                  className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                  style={{ padding: "var(--spacing-sm) var(--spacing-lg)" }}
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="bg-[var(--accent-red)] text-white rounded-lg hover:bg-red-600 transition-colors"
                  style={{ padding: "var(--spacing-sm) var(--spacing-lg)" }}
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div
        className="max-w-4xl mx-auto"
        style={{ padding: "var(--spacing-lg)" }}
      >
        {/* Header */}
        <div style={{ marginBottom: "var(--spacing-xl)" }}>
          <h1
            className="text-3xl font-bold text-[var(--text-primary)]"
            style={{ marginBottom: "var(--spacing-sm)" }}
          >
            Admin Profile
          </h1>
          <p className="text-[var(--text-secondary)]">
            Manage your admin account settings and information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-[var(--bg-card)] rounded-2xl shadow-lg border border-[var(--border-primary)] overflow-hidden">
          {/* Profile Header */}
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-purple) 0%, #ec4899 100%)",
              padding: "var(--spacing-xl)",
            }}
          >
            <div
              className="flex items-center"
              style={{ gap: "var(--spacing-lg)" }}
            >
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {adminData.firstName?.charAt(0) || "A"}
                </span>
              </div>
              <div>
                <h2 className="text-3xl font-bold">
                  {adminData.firstName} {adminData.lastName}
                </h2>
                <p className="text-xl opacity-90">{adminData.email}</p>
                <div style={{ marginTop: "var(--spacing-sm)" }}>
                  <span
                    className="bg-white bg-opacity-20 rounded-full text-sm font-medium"
                    style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
                  >
                    {adminData.role || "Admin"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div style={{ padding: "var(--spacing-xl)" }}>
            <div
              className="grid grid-cols-1 md:grid-cols-2"
              style={{ gap: "var(--spacing-xl)" }}
            >
              {/* Personal Information */}
              <div>
                <h3
                  className="text-xl font-semibold text-[var(--text-primary)]"
                  style={{ marginBottom: "var(--spacing-md)" }}
                >
                  Personal Information
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-md)",
                  }}
                >
                  <div>
                    <label className="text-sm text-[var(--text-secondary)]">
                      Full Name
                    </label>
                    <p className="text-[var(--text-primary)] font-medium">
                      {adminData.firstName} {adminData.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-secondary)]">
                      Email
                    </label>
                    <p className="text-[var(--text-primary)] font-medium">
                      {adminData.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-secondary)]">
                      Role
                    </label>
                    <p className="text-[var(--text-primary)] font-medium">
                      {adminData.role || "Admin"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-secondary)]">
                      Admin ID
                    </label>
                    <p className="text-[var(--text-primary)] font-medium font-mono">
                      {adminData._id || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h3
                  className="text-xl font-semibold text-[var(--text-primary)]"
                  style={{ marginBottom: "var(--spacing-md)" }}
                >
                  Account Information
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-md)",
                  }}
                >
                  <div>
                    <label className="text-sm text-[var(--text-secondary)]">
                      Account Status
                    </label>
                    <p className="text-[var(--accent-green)] font-medium">
                      Active
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-secondary)]">
                      Last Login
                    </label>
                    <p className="text-[var(--text-primary)] font-medium">
                      {adminData.lastLogin
                        ? new Date(adminData.lastLogin).toLocaleString()
                        : "Just now"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-secondary)]">
                      Account Created
                    </label>
                    <p className="text-[var(--text-primary)] font-medium">
                      {adminData.createdAt
                        ? new Date(adminData.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-secondary)]">
                      Permissions
                    </label>
                    <p className="text-[var(--text-primary)] font-medium">
                      Full Admin Access
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              className="border-t border-[var(--border-primary)]"
              style={{
                marginTop: "var(--spacing-xl)",
                paddingTop: "var(--spacing-lg)",
              }}
            >
              <div className="flex" style={{ gap: "var(--spacing-md)" }}>
                <button
                  className="bg-[var(--accent-purple)] text-white rounded-lg hover:bg-purple-600 transition-colors"
                  style={{ padding: "var(--spacing-sm) var(--spacing-lg)" }}
                >
                  Edit Profile
                </button>
                <button
                  className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                  style={{ padding: "var(--spacing-sm) var(--spacing-lg)" }}
                >
                  Change Password
                </button>
                <button
                  onClick={() => router.push("/admin")}
                  className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                  style={{ padding: "var(--spacing-sm) var(--spacing-lg)" }}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
