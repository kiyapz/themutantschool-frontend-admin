"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Bell,
  MessageCircle,
  ChevronDown,
  Menu,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout, user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getPageTitle = () => {
    switch (pathname) {
      case "/admin":
        return "ADMIN PANEL";
      case "/instructors":
        return "INSTRUCTORS";
      case "/students":
        return "RECRUITS";
      case "/affiliates":
        return "AFFILIATES";
      case "/missions":
        return "MISSIONS";
      case "/payments":
        return "PAYOUTS - ADMIN PORTAL";
      case "/settings":
        return "SETTINGS - ADMIN PORTAL";
      case "/profile":
        return "INSTRUCTORS";
      default:
        return "ADMIN PANEL";
    }
  };

  return (
    <header
      className="bg-[#000000] flex items-center justify-between"
      style={{ height: "var(--header-height)", padding: "0 var(--spacing-lg)" }}
    >
      {/* Left side */}
      <div className="flex items-center" style={{ gap: "var(--spacing-sm)" }}>
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-[10px] sm:text-[19px] font-[400] text-[#909090] font-xirod">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center" style={{ gap: "var(--spacing-sm)" }}>
        {/* Search */}
        <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <Search size={20} />
        </button>

        {/* Notifications */}
        <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <Bell size={20} />
        </button>

        {/* Messages */}
        <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <MessageCircle size={20} />
        </button>

        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center transition-colors"
            style={{
              gap: "var(--spacing-sm)",
              padding: "var(--spacing-xs) var(--spacing-sm)",
            }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              {user?.profile?.avatar?.url ? (
                <img
                  src={user.profile.avatar.url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-sm font-medium">
                  {user?.firstName?.charAt(0) ||
                    user?.username?.charAt(0) ||
                    "A"}
                </span>
              )}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-[var(--text-primary)]">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                {user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : "Admin"}
              </div>
            </div>
            <ChevronDown
              size={16}
              className={`text-[var(--text-secondary)] transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border-primary)] z-50">
              <div style={{ padding: "var(--spacing-sm)" }}>
                {/* User Info Section */}
                <div className="px-3 py-2 border-b border-[var(--border-primary)] mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      {user?.profile?.avatar?.url ? (
                        <img
                          src={user.profile.avatar.url}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-medium">
                          {user?.firstName?.charAt(0) ||
                            user?.username?.charAt(0) ||
                            "A"}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[var(--text-primary)]">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        {user?.email}
                      </div>
                      <div className="text-xs text-[var(--accent-purple)] font-medium">
                        {user?.role
                          ? user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)
                          : "Admin"}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    router.push("/adminprofile");
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center text-left hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                  style={{
                    gap: "var(--spacing-sm)",
                    padding: "var(--spacing-sm)",
                  }}
                >
                  <User size={16} className="text-[var(--text-secondary)]" />
                  <span className="text-sm text-[var(--text-primary)]">
                    Admin Profile
                  </span>
                </button>
                <button
                  className="w-full flex items-center text-left hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                  style={{
                    gap: "var(--spacing-sm)",
                    padding: "var(--spacing-sm)",
                  }}
                >
                  <Settings
                    size={16}
                    className="text-[var(--text-secondary)]"
                  />
                  <span className="text-sm text-[var(--text-primary)]">
                    Settings
                  </span>
                </button>
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "var(--border-primary)",
                    margin: "var(--spacing-sm) 0",
                  }}
                />
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="w-full flex items-center text-left hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                  style={{
                    gap: "var(--spacing-sm)",
                    padding: "var(--spacing-sm)",
                  }}
                >
                  <LogOut size={16} className="text-[var(--text-secondary)]" />
                  <span className="text-sm text-[var(--text-primary)]">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
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
              Confirm Logout
            </h3>
            <p
              className="text-sm text-[var(--text-secondary)]"
              style={{ marginBottom: "var(--spacing-xl)" }}
            >
              Are you sure you want to logout? You will need to sign in again to
              access your account.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--spacing-sm)",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors rounded-lg font-medium"
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
                className="bg-[var(--accent-red)] text-white hover:bg-red-600 transition-colors rounded-lg font-medium"
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
