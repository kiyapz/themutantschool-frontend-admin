import { MoreHorizontal } from "lucide-react";

interface Affiliate {
  id: number;
  name: string;
  location: string;
  referrals: number;
  enrolments: number;
  commissions: string;
  cashout: string;
}

function AffiliateRow({ affiliate }: { affiliate: Affiliate }) {
  return (
    <tr
      style={{ borderBottom: "1px solid var(--border-primary)" }}
      className="hover:bg-[var(--bg-tertiary)] transition-colors"
    >
      <td
        className="text-sm text-[var(--text-secondary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {affiliate.id}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        <div>
          <div className="font-medium">{affiliate.name}</div>
          <div className="text-xs text-[var(--text-secondary)]">
            {affiliate.location}
          </div>
        </div>
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {affiliate.referrals}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        {affiliate.enrolments}
      </td>
      <td
        className="text-sm text-[var(--text-primary)]"
        style={{ padding: "var(--spacing-md)" }}
      >
        <div>{affiliate.commissions}</div>
        <div className="text-xs text-[var(--text-secondary)]">
          Cashout: {affiliate.cashout}
        </div>
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

export default function AffiliatesList() {
  const affiliates: Affiliate[] = [
    {
      id: 1,
      name: "Abdulrahman Assan",
      location: "Dubai, UAE",
      referrals: 20,
      enrolments: 5,
      commissions: "$200.22",
      cashout: "$80",
    },
    {
      id: 2,
      name: "Shaibu Mohammed",
      location: "Lagos, Nigeria",
      referrals: 20,
      enrolments: 5,
      commissions: "$500",
      cashout: "$0",
    },
    {
      id: 3,
      name: "Sharon Fletcher",
      location: "London, United Kingdom",
      referrals: 20,
      enrolments: 5,
      commissions: "$50",
      cashout: "$0",
    },
    {
      id: 4,
      name: "Etieno Ekanem",
      location: "Uyo, Nigeria",
      referrals: 20,
      enrolments: 5,
      commissions: "$31.00",
      cashout: "$0",
    },
    {
      id: 5,
      name: "Kwame Dutse",
      location: "Accra, Ghana",
      referrals: 20,
      enrolments: 5,
      commissions: "$20",
      cashout: "$0",
    },
    {
      id: 6,
      name: "Abdulrahman Assan",
      location: "Dubai, UAE",
      referrals: 20,
      enrolments: 5,
      commissions: "$200.22",
      cashout: "$80",
    },
    {
      id: 7,
      name: "Shaibu Mohammed",
      location: "Lagos, Nigeria",
      referrals: 20,
      enrolments: 5,
      commissions: "$500",
      cashout: "$0",
    },
    {
      id: 8,
      name: "Sharon Fletcher",
      location: "London, United Kingdom",
      referrals: 20,
      enrolments: 5,
      commissions: "$50",
      cashout: "$0",
    },
    {
      id: 9,
      name: "Etieno Ekanem",
      location: "Uyo, Nigeria",
      referrals: 20,
      enrolments: 5,
      commissions: "$31.00",
      cashout: "$0",
    },
    {
      id: 10,
      name: "Kwame Dutse",
      location: "Accra, Ghana",
      referrals: 20,
      enrolments: 5,
      commissions: "$20",
      cashout: "$0",
    },
  ];

  return (
    <div className="bg-[var(--bg-card)] rounded-lg">
      <div
        className="flex items-center justify-between"
        style={{ padding: "var(--spacing-lg)" }}
      >
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Affiliate List
        </h2>
        <div className="flex items-center" style={{ gap: "var(--spacing-sm)" }}>
          <button
            className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--border-secondary)] transition-colors"
            style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
          >
            Filter
          </button>
          <select
            className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg focus:outline-none"
            style={{
              padding: "var(--spacing-sm) var(--spacing-md)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <option>Sort By: Oldest to Newest</option>
            <option>Sort By: Newest to Oldest</option>
            <option>Sort By: Name A-Z</option>
            <option>Sort By: Name Z-A</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-primary)" }}>
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
                Affiliates
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Referrals
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Enrolments
              </th>
              <th
                className="text-left text-sm font-medium text-[var(--text-secondary)]"
                style={{ padding: "var(--spacing-md)" }}
              >
                Commissions
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
            {affiliates.map((affiliate) => (
              <AffiliateRow key={affiliate.id} affiliate={affiliate} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "var(--spacing-lg)",
          borderTop: "1px solid var(--border-primary)",
        }}
      >
        <div className="text-sm text-[var(--text-secondary)]">
          Showing results from 1-10 of 21 entries
        </div>
        <div className="flex items-center" style={{ gap: "var(--spacing-sm)" }}>
          <button
            className="text-sm text-[var(--text-muted)] bg-[var(--bg-tertiary)] rounded-lg cursor-not-allowed"
            style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
          >
            Previous
          </button>
          <button
            className="text-sm text-white bg-[var(--accent-purple)] rounded-lg hover:bg-[var(--accent-purple-light)] transition-colors"
            style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
