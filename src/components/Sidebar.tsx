"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Grid3X3,
  Target,
  DollarSign,
  Settings,
  UserCheck,
  Menu,
  X,
  LogOut,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Instructors", href: "/instructors" },
  { icon: BarChart3, label: "Students", href: "/students" },
  { icon: Grid3X3, label: "Affiliates", href: "/affiliates" },
  { icon: Target, label: "Missions", href: "/missions" },
  { icon: DollarSign, label: "Payments", href: "/payments" },
  { icon: RotateCcw, label: "Refunds", href: "/refunds" },
  { icon: UserCheck, label: "KYC", href: "/kyc" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        w-64 bg-[#000000] 
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
        fixed lg:relative top-0 left-0 h-full lg:h-full lg:flex-shrink-0 lg:overflow-hidden
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className="flex items-center justify-between"
            style={{
              height: "var(--header-height)",
              padding: "0 var(--spacing-lg)",
            }}
          >
            <h1 className="text-[15px]  sm:text-[24px] font-[400] text-[#7343B3] font-xirod">
              MUTANT
            </h1>
            <button
              onClick={onToggle}
              className="lg:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1" style={{ padding: "var(--spacing-lg)" }}>
            <h2
              className="text-[10px] sm:text-[15px] font-[600] text-[#898989] uppercase tracking-wider"
              style={{ marginBottom: "var(--spacing-md)" }}
            >
              Core Navigation
            </h2>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-sm)",
              }}
            >
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={`
                      w-full flex items-center rounded-lg text-left transition-colors
                      ${
                        isActive
                          ? "text-[#7343B3]"
                          : "text-[#AEAEAE] hover:text-[var(--text-primary)] "
                      }
                    `}
                      style={{
                        gap: "var(--spacing-sm)",
                        padding: "var(--spacing-sm) var(--spacing-sm)",
                      }}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Logout Button */}
            <div style={{ marginTop: "var(--spacing-lg)" }}>
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center rounded-lg text-left transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                style={{
                  gap: "var(--spacing-sm)",
                  padding: "var(--spacing-sm) var(--spacing-sm)",
                }}
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

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
                onClick={handleCancelLogout}
                className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors rounded-lg font-medium"
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
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
    </>
  );
}
