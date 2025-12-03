"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, Eye, Mail, X } from "lucide-react";
import adminApi from "@/utils/api";
import TransactionDetailModal from "./TransactionDetailModal";

export interface Transaction {
  
  _id: string;
  missionId: string;
  studentId?: string;
  sessionId: string;
  amount: number;
  status: "pending" | "succeeded" | "failed" | "refunded";
  month: string;
  releaseDate: string;
  createdAt: string;
  refunded?: boolean;
}

interface StatusTagProps {
  status: "pending" | "succeeded" | "failed" | "refunded";
}

function StatusTag({ status }: StatusTagProps) {
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-[#2B2B2B] text-[#757575] ";
      case "succeeded":
        return "bg-[#193024] text-[#38FF63] ";
      case "failed":
      case "refunded":
        return "bg-[#193024] text-[#38FF63]";
      default:
        return "bg-[#301B19] text-[#FF6338]";
    }
  };

  return (
    <span
      className={`rounded-full text-xs font-medium capitalize ${getStatusColor()}`}
      style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
    >
      {status}
    </span>
  );
}

function TransactionRow({
  transaction,
  index,
  onClick,
  onToggleDropdown,
  isDropdownOpen,
  onOpenRequest,
  onSendMessage,
  onReject,
}: {
  transaction: Transaction;
  index: number;
  onClick: () => void;
  onToggleDropdown: (transactionId: string) => void;
  isDropdownOpen: boolean;
  onOpenRequest: (transaction: Transaction) => void;
  onSendMessage: (transaction: Transaction) => void;
  onReject: (transaction: Transaction) => void;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <tr
      style={{ borderBottom: "1px solid var(--border-primary)" }}
      className="hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
      onClick={onClick}
    >
      <td
        className="text-sm text-[var(--text-secondary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {index + 1}
      </td>
      <td
        className="text-sm text-[var(--text-primary)] font-mono"
        style={{ padding: "var(--spacing-md)" }}
      >
        {transaction._id.slice(-8)}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        <div>
          <div className="font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(transaction.amount)}
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-mono">
            Student: {transaction.studentId?.slice(-6) || "N/A"}
          </div>
        </div>
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {formatDate(transaction.createdAt)}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {formatDate(transaction.releaseDate)}
      </td>
      <td className="text-sm" style={{ padding: "var(--spacing-md)" }}>
        <StatusTag status={transaction.status} />
      </td>
      <td
        className="text-sm text-[var(--text-secondary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        <div className="relative" data-dropdown>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleDropdown(transaction._id);
            }}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="More Actions"
          >
            <MoreHorizontal size={20} />
          </button>

          {isDropdownOpen && (
            <div
              className="absolute right-0 top-8 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg shadow-lg z-10"
              style={{ minWidth: "180px" }}
              data-dropdown
            >
              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenRequest(transaction);
                  }}
                  className="flex items-center w-full text-left text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                  style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                >
                  <Eye size={14} style={{ marginRight: "var(--spacing-sm)" }} />
                  Open Request
                </button>

                <div
                  style={{
                    height: "1px",
                    backgroundColor: "var(--border-primary)",
                    margin: "var(--spacing-xs) 0",
                  }}
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSendMessage(transaction);
                  }}
                  className="flex items-center w-full text-left text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                  style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                >
                  <Mail
                    size={14}
                    style={{ marginRight: "var(--spacing-sm)" }}
                  />
                  Send Message / Mail
                </button>

                <div
                  style={{
                    height: "1px",
                    backgroundColor: "var(--border-primary)",
                    margin: "var(--spacing-xs) 0",
                  }}
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReject(transaction);
                  }}
                  className="flex items-center w-full text-left text-[var(--accent-red)] hover:bg-[var(--bg-tertiary)] transition-colors"
                  style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                >
                  <X size={14} style={{ marginRight: "var(--spacing-sm)" }} />
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function PaymentTabs() {
  const [activeTab, setActiveTab] = useState("Payouts");
  const [activeSubTab, setActiveSubTab] = useState("Affiliates");
  const [transactions, setTransactions] = useState<{
    affiliates: Transaction[];
    instructors: Transaction[];
    platform: Transaction[];
  }>({ affiliates: [], instructors: [], platform: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
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
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("--- Fetching All Transactions ---");
        const response = await adminApi.get("/earnings/platform");
        console.log("All Transactions API Response:", response.data);

        if (response.data.success) {
          const transData = response.data.data.transactions;

          // Get all transactions from all months, not just current month
          const getAllTransactions = (monthlyData: any) => {
            if (!monthlyData || !monthlyData.monthlyTransactions) return [];

            // Flatten all monthly transactions into a single array
            const allTransactions = Object.values(
              monthlyData.monthlyTransactions
            ).flat() as Transaction[];

            // Sort by creation date (most recent first)
            return allTransactions.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
          };

          const allAffiliates = getAllTransactions(transData.affiliates);
          const allInstructors = getAllTransactions(transData.instructors);
          const allPlatform = getAllTransactions(transData.platform);

          console.log("All Affiliates Transactions:", allAffiliates.length);
          console.log("All Instructors Transactions:", allInstructors.length);
          console.log("All Platform Transactions:", allPlatform.length);

          setTransactions({
            affiliates: allAffiliates,
            instructors: allInstructors,
            platform: allPlatform,
          });
        } else {
          setError("Failed to fetch transactions");
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("An error occurred while fetching transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getCurrentTransactions = (): Transaction[] => {
    switch (activeSubTab) {
      case "Affiliates":
        return transactions.affiliates;
      case "Instructors":
        return transactions.instructors;
      case "Platform":
        return transactions.platform;
      default:
        return [];
    }
  };

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseModal = () => {
    setSelectedTransaction(null);
  };

  const toggleDropdown = (transactionId: string) => {
    console.log("Toggling dropdown for transaction:", transactionId);
    console.log("Current dropdown open:", dropdownOpen);
    setDropdownOpen(dropdownOpen === transactionId ? null : transactionId);
  };

  const handleOpenRequest = (transaction: Transaction) => {
    console.log("Opening request for transaction:", transaction._id);
    // Close dropdown
    setDropdownOpen(null);
    // You can add specific logic here for opening a request
    alert("Open Request functionality - Transaction ID: " + transaction._id);
  };

  const handleSendMessage = (transaction: Transaction) => {
    console.log("Sending message for transaction:", transaction._id);
    // Close dropdown
    setDropdownOpen(null);
    // You can add specific logic here for sending a message
    alert("Send Message functionality - Transaction ID: " + transaction._id);
  };

  const handleReject = (transaction: Transaction) => {
    console.log("Rejecting transaction:", transaction._id);
    // Close dropdown
    setDropdownOpen(null);
    // You can add specific logic here for rejecting
    alert("Reject functionality - Transaction ID: " + transaction._id);
  };

  return (
    <div>
      <div className="">
        {/* Tabs */}
        <div
          className="flex"
          style={{ borderBottom: "1px solid var(--border-primary)" }}
        >
          <button
            onClick={() => setActiveTab("Payouts")}
            className={`text-sm font-medium transition-colors ${
              activeTab === "Payouts"
                ? "text-[#A333CF] border-b-2 border-[#A333CF]"
                : "text-[#A5A5A5] hover:text-[#A5A5A5]"
            }`}
            style={{ padding: "var(--spacing-md) var(--spacing-lg)" }}
          >
            Payouts
          </button>
         
        </div>

        {/* Tab Content */}
        <div style={{ padding: "var(--spacing-lg)" }} className="">
          {activeTab === "Payouts" && (
            <>
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: "var(--spacing-lg)" }}
              >
                <div className="flex items-center bg-[#0C0C0C] rounded-lg p-1">
                  {["Affiliates", "Instructors", "Platform"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveSubTab(tab)}
                      className={`text-sm font-medium cursor-pointer transition-colors rounded-md ${
                        activeSubTab === tab
                          ? "text-white bg-[#A333CF]"
                          : "text-[#A5A5A5]  hover:opacity-50"
                      }`}
                      style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Transaction Count Display */}
                <div className="hidden md:block text-sm text-[var(--text-secondary)]">
                  Showing {getCurrentTransactions().length} transactions
                </div>

                <select
                  className="hidden md:block bg-[#0C0C0C] outline-none text-[var(--text-primary)] rounded-lg focus:outline-none"
                  style={{
                    padding: "var(--spacing-sm) var(--spacing-md)",
                  }}
                >
                  <option>Sort By: Newest to Oldest</option>
                  <option>Sort By: Oldest to Newest</option>
                  <option>Sort By: Amount Low to High</option>
                  <option>Sort By: Amount High to Low</option>
                </select>
              </div>

              {/* Table */}
              {loading ? (
                <div className="text-center py-10">Loading transactions...</div>
              ) : error ? (
                <div className="text-center py-10 text-[var(--accent-red)]">
                  {error}
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr
                        style={{
                          borderBottom: "1px solid var(--border-primary)",
                        }}
                      >
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
                          Transaction ID
                        </th>
                        <th
                          className="text-left text-sm font-medium text-[var(--text-secondary)]"
                          style={{ padding: "var(--spacing-md)" }}
                        >
                          Amount
                        </th>
                        <th
                          className="text-left text-sm font-medium text-[var(--text-secondary)]"
                          style={{ padding: "var(--spacing-md)" }}
                        >
                          Date
                        </th>
                        <th
                          className="text-left text-sm font-medium text-[var(--text-secondary)]"
                          style={{ padding: "var(--spacing-md)" }}
                        >
                          Release Date
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
                      {getCurrentTransactions().length > 0 ? (
                        getCurrentTransactions().map((transaction, index) => (
                          <TransactionRow
                            key={transaction._id}
                            transaction={transaction}
                            index={index}
                            onClick={() => handleRowClick(transaction)}
                            onToggleDropdown={toggleDropdown}
                            isDropdownOpen={dropdownOpen === transaction._id}
                            onOpenRequest={handleOpenRequest}
                            onSendMessage={handleSendMessage}
                            onReject={handleReject}
                          />
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center py-10 text-[var(--text-secondary)]"
                          >
                            No transactions found for this month.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <TransactionDetailModal
        transaction={selectedTransaction}
        onClose={handleCloseModal}
      />
    </div>
  );
}
