"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

interface PaymentRequest {
  id: number;
  ticketId: string;
  userName: string;
  date?: string;
  balance: string;
  payoutRequest: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface StatusTagProps {
  status: "Pending" | "Approved" | "Rejected";
}

function StatusTag({ status }: StatusTagProps) {
  const getStatusColor = () => {
    switch (status) {
      case "Pending":
        return "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]";
      case "Approved":
        return "bg-[var(--accent-green)] text-white";
      case "Rejected":
        return "bg-[var(--accent-red)] text-white";
      default:
        return "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]";
    }
  };

  return (
    <span
      className={`rounded-full text-xs font-medium ${getStatusColor()}`}
      style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
    >
      {status}
    </span>
  );
}

function PaymentRequestRow({ request }: { request: PaymentRequest }) {
  return (
    <tr
      style={{ borderBottom: "1px solid var(--border-primary)" }}
      className="hover:bg-[var(--bg-tertiary)] transition-colors"
    >
      <td
        className="text-sm text-[var(--text-secondary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {request.id}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {request.ticketId}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        <div>
          <div className="font-medium">{request.userName}</div>
          {request.date && (
            <div className="text-xs text-[var(--text-secondary)]">
              {request.date}
            </div>
          )}
        </div>
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {request.balance}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {request.payoutRequest}
      </td>
      <td className="text-sm" style={{ padding: "var(--spacing-md)" }}>
        <StatusTag status={request.status} />
      </td>
      <td
        className="text-sm text-[var(--text-secondary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </td>
    </tr>
  );
}

export default function PaymentTabs() {
  const [activeTab, setActiveTab] = useState("Payouts");

  const paymentRequests: PaymentRequest[] = [
    {
      id: 1,
      ticketId: "02045",
      userName: "Abdulrahman Assan",
      date: "20/02/2020",
      balance: "$200.22",
      payoutRequest: "$300.22",
      status: "Pending",
    },
    {
      id: 2,
      ticketId: "02046",
      userName: "Shaibu Mohammed",
      balance: "$500",
      payoutRequest: "$500",
      status: "Pending",
    },
    {
      id: 3,
      ticketId: "02047",
      userName: "Sharon Fletcher",
      balance: "$50",
      payoutRequest: "$50",
      status: "Pending",
    },
    {
      id: 4,
      ticketId: "02048",
      userName: "Ekanem E. Ekanam",
      balance: "$211.00",
      payoutRequest: "$211.00",
      status: "Pending",
    },
    {
      id: 5,
      ticketId: "02049",
      userName: "Kwame Dutse",
      balance: "$20",
      payoutRequest: "$20",
      status: "Approved",
    },
    {
      id: 6,
      ticketId: "02050",
      userName: "Abdulrahman Assan",
      balance: "$200.22",
      payoutRequest: "$300.22",
      status: "Approved",
    },
    {
      id: 7,
      ticketId: "02051",
      userName: "Shaibu Mohammed",
      balance: "$500",
      payoutRequest: "$500",
      status: "Rejected",
    },
  ];

  return (
    <div className="bg-[var(--bg-card)] rounded-lg">
      {/* Tabs */}
      <div
        className="flex"
        style={{ borderBottom: "1px solid var(--border-primary)" }}
      >
        <button
          onClick={() => setActiveTab("Payouts")}
          className={`text-sm font-medium transition-colors ${
            activeTab === "Payouts"
              ? "text-[var(--accent-purple)] bg-[var(--bg-tertiary)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
          style={{ padding: "var(--spacing-md) var(--spacing-lg)" }}
        >
          Payouts
        </button>
        <button
          onClick={() => setActiveTab("Payments Received")}
          className={`text-sm font-medium transition-colors ${
            activeTab === "Payments Received"
              ? "text-[var(--accent-purple)] bg-[var(--bg-tertiary)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
          style={{ padding: "var(--spacing-md) var(--spacing-lg)" }}
        >
          Payments Received
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ padding: "var(--spacing-lg)" }}>
        {activeTab === "Payouts" && (
          <>
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: "var(--spacing-lg)" }}
            >
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Payment Request
              </h2>
              <select
                className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg focus:outline-none"
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  border: "1px solid var(--border-primary)",
                }}
              >
                <option>Sort By: Oldest to Newest</option>
                <option>Sort By: Newest to Oldest</option>
                <option>Sort By: Amount Low to High</option>
                <option>Sort By: Amount High to Low</option>
              </select>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid var(--border-primary)" }}
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
                      Ticket ID
                    </th>
                    <th
                      className="text-left text-sm font-medium text-[var(--text-secondary)]"
                      style={{ padding: "var(--spacing-md)" }}
                    >
                      User Name
                    </th>
                    <th
                      className="text-left text-sm font-medium text-[var(--text-secondary)]"
                      style={{ padding: "var(--spacing-md)" }}
                    >
                      Balance
                    </th>
                    <th
                      className="text-left text-sm font-medium text-[var(--text-secondary)]"
                      style={{ padding: "var(--spacing-md)" }}
                    >
                      Payout Request
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
                  {paymentRequests.map((request) => (
                    <PaymentRequestRow key={request.id} request={request} />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "Payments Received" && (
          <div className="flex flex-col" style={{ gap: "var(--spacing-lg)" }}>
            {/* Payment Request Header */}
            <div
              className="bg-[var(--bg-tertiary)] rounded-lg"
              style={{ padding: "var(--spacing-xl)" }}
            >
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: "var(--spacing-lg)" }}
              >
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    <span className="text-[var(--accent-purple)]">
                      @Abdulrahmanassan
                    </span>{" "}
                    Payment Request of{" "}
                    <span className="text-[var(--accent-purple)]">$100</span>
                  </h2>
                </div>
                <div
                  className="flex items-center"
                  style={{ gap: "var(--spacing-sm)" }}
                >
                  <div className="text-right">
                    <div className="text-sm text-[var(--text-secondary)]">
                      25/02/2025
                    </div>
                  </div>
                  <div className="flex" style={{ gap: "var(--spacing-sm)" }}>
                    <button
                      className="bg-[var(--accent-red)] text-white rounded-lg hover:bg-red-600 transition-colors"
                      style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                    >
                      Reject
                    </button>
                    <button
                      className="bg-[var(--accent-green)] text-white rounded-lg hover:bg-green-600 transition-colors"
                      style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div
                className="grid grid-cols-1 md:grid-cols-2"
                style={{ gap: "var(--spacing-lg)" }}
              >
                <div>
                  <div
                    className="text-sm text-[var(--text-secondary)]"
                    style={{ marginBottom: "var(--spacing-xs)" }}
                  >
                    Ticket ID:
                  </div>
                  <div className="text-lg font-semibold text-[var(--text-primary)]">
                    #ID2045
                  </div>
                </div>
                <div>
                  <div
                    className="text-sm text-[var(--text-secondary)]"
                    style={{ marginBottom: "var(--spacing-xs)" }}
                  >
                    Balance:
                  </div>
                  <div className="text-lg font-semibold text-[var(--text-primary)]">
                    $202.22
                  </div>
                </div>
                <div>
                  <div
                    className="text-sm text-[var(--text-secondary)]"
                    style={{ marginBottom: "var(--spacing-xs)" }}
                  >
                    Amount:
                  </div>
                  <div className="text-lg font-semibold text-[var(--text-primary)]">
                    $100
                  </div>
                </div>
                <div>
                  <div
                    className="text-sm text-[var(--text-secondary)]"
                    style={{ marginBottom: "var(--spacing-xs)" }}
                  >
                    Account Number:
                  </div>
                  <div className="text-lg font-semibold text-[var(--text-primary)]">
                    3195480945
                  </div>
                </div>
                <div>
                  <div
                    className="text-sm text-[var(--text-secondary)]"
                    style={{ marginBottom: "var(--spacing-xs)" }}
                  >
                    Account Type:
                  </div>
                  <div className="text-lg font-semibold text-[var(--text-primary)]">
                    Firstbank
                  </div>
                </div>
                <div>
                  <div
                    className="text-sm text-[var(--text-secondary)]"
                    style={{ marginBottom: "var(--spacing-xs)" }}
                  >
                    Account Name:
                  </div>
                  <div className="text-lg font-semibold text-[var(--text-primary)]">
                    Etieno Douglas
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
