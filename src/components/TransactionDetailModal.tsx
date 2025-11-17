"use client";

import { X } from "lucide-react";
import { Transaction } from "./PaymentTabs";

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export default function TransactionDetailModal({
  transaction,
  onClose,
}: TransactionDetailModalProps) {
  if (!transaction) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div
      className="fixed flex items-center justify-center z-50"
      style={{
        top: "80px",
        right: 0,
        bottom: 0,
        left: "280px",
        padding: "var(--spacing-md)",
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="bg-[var(--bg-card)] w-full max-w-4xl"
        style={{
          borderRadius: "var(--border-radius-2xl)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
          border: "1px solid var(--border-primary)",
          overflow: "hidden",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Action Buttons - Top Right */}
        <div
          style={{
            padding: "var(--spacing-lg) var(--spacing-xl)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "var(--spacing-sm)",
          }}
        >
          <button
            className="bg-red-500 hover:bg-red-600 text-white transition-all duration-200 font-medium"
            style={{
              padding: "var(--spacing-sm) var(--spacing-lg)",
              borderRadius: "var(--border-radius-lg)",
            }}
            title="Reject Payment"
          >
            Reject
          </button>
          <button
            className="bg-[var(--accent-green)] hover:bg-green-600 text-white transition-all duration-200 font-medium"
            style={{
              padding: "var(--spacing-sm) var(--spacing-lg)",
              borderRadius: "var(--border-radius-lg)",
            }}
            title="Approve Payment"
          >
            Approve
          </button>
        </div>

        {/* Payment Request Summary Card */}
        <div
          style={{
            padding: "var(--spacing-lg) var(--spacing-xl)",
            background: "var(--bg-tertiary)",
            margin: "0 var(--spacing-xl)",
            borderRadius: "var(--border-radius-lg)",
            marginBottom: "var(--spacing-lg)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span className="text-white text-lg">
                @{transaction.studentId?.slice(-6) || "N/A"} Payment Request of{" "}
                <span style={{ color: "var(--accent-purple)" }}>
                  {formatCurrency(transaction.amount)}
                </span>
              </span>
              <div className="text-sm text-[var(--text-secondary)] mt-1">
                Status: <span className="capitalize">{transaction.status}</span>
              </div>
            </div>
            <div className="text-white text-sm">
              {new Date(transaction.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Detailed Payment Information */}
        <div
          style={{
            padding: "var(--spacing-lg) var(--spacing-xl)",
            background: "var(--bg-tertiary)",
            margin: "0 var(--spacing-xl)",
            borderRadius: "var(--border-radius-lg)",
            marginBottom: "var(--spacing-lg)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--spacing-md)",
            }}
          >
            <div className="text-white">
              <div className="text-sm text-[var(--text-secondary)] mb-1">
                Ticket ID
              </div>
              <div className="font-medium">#{transaction._id.slice(-4)}</div>
            </div>

            <div className="text-white">
              <div className="text-sm text-[var(--text-secondary)] mb-1">
                Status
              </div>
              <div className="font-medium capitalize">{transaction.status}</div>
            </div>

            <div className="text-white">
              <div className="text-sm text-[var(--text-secondary)] mb-1">
                Amount
              </div>
              <div className="font-medium">
                {formatCurrency(transaction.amount)}
              </div>
            </div>

            <div className="text-white">
              <div className="text-sm text-[var(--text-secondary)] mb-1">
                Student ID
              </div>
              <div className="font-medium">
                {transaction.studentId?.slice(-6) || "N/A"}
              </div>
            </div>

            <div className="text-white">
              <div className="text-sm text-[var(--text-secondary)] mb-1">
                Mission ID
              </div>
              <div className="font-medium">
                {transaction.missionId.slice(-6)}
              </div>
            </div>

            <div className="text-white">
              <div className="text-sm text-[var(--text-secondary)] mb-1">
                Month
              </div>
              <div className="font-medium">{transaction.month}</div>
            </div>

            <div className="text-white">
              <div className="text-sm text-[var(--text-secondary)] mb-1">
                Created At
              </div>
              <div className="font-medium">
                {new Date(transaction.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </div>
            </div>

            <div className="text-white">
              <div className="text-sm text-[var(--text-secondary)] mb-1">
                Release Date
              </div>
              <div className="font-medium">
                {new Date(transaction.releaseDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </div>
            </div>

            <div className="text-white">
              <div className="text-sm text-[var(--text-secondary)] mb-1">
                Refunded
              </div>
              <div className="font-medium">
                {transaction.refunded ? "Yes" : "No"}
              </div>
            </div>

            <div className="text-white">
              <div className="text-sm text-[var(--text-secondary)] mb-1">
                Session ID
              </div>
              <div className="font-medium text-xs break-all">
                {transaction.sessionId}
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div
          style={{
            padding: "var(--spacing-lg) var(--spacing-xl)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            onClick={onClose}
            className="bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors rounded-lg font-medium"
            style={{
              padding: "var(--spacing-sm) var(--spacing-lg)",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
