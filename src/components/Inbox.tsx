import { DollarSign, Hash, Reply, Trash2 } from "lucide-react";

interface InboxItem {
  id: string;
  type: "payout" | "purchase" | "ticket";
  icon: React.ReactNode;
  recipient?: string;
  purchaser?: string;
  sender?: string;
  message: string;
  time: string;
  showActions?: boolean;
}

interface InboxItemProps {
  item: InboxItem;
}

function InboxItemComponent({ item }: InboxItemProps) {
  const getIconColor = () => {
    switch (item.type) {
      case "payout":
        return "text-[var(--accent-green)]";
      case "purchase":
        return "text-[var(--accent-blue)]";
      case "ticket":
        return "text-[var(--text-secondary)]";
      default:
        return "text-[var(--text-secondary)]";
    }
  };

  const getTextColor = () => {
    switch (item.type) {
      case "payout":
        return "text-[var(--accent-green)]";
      case "purchase":
        return "text-[var(--accent-blue)]";
      default:
        return "text-[var(--text-primary)]";
    }
  };

  return (
    <div
      className="bg-[var(--bg-card)] rounded-lg transition-colors"
      style={{ padding: "var(--spacing-md)" }}
    >
      <div className="flex items-start" style={{ gap: "var(--spacing-sm)" }}>
        {/* Icon */}
        <div className={`flex-shrink-0 ${getIconColor()}`}>{item.icon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div
            className="flex items-center justify-end"
            style={{ marginBottom: "var(--spacing-xs)" }}
          >
            <span className="text-xs text-[var(--text-muted)]">
              {item.time}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-xs)",
            }}
          >
            {item.recipient && (
              <p className={`text-sm font-medium ${getTextColor()}`}>
                {item.recipient}
              </p>
            )}
            {item.purchaser && (
              <p className={`text-sm font-medium ${getTextColor()}`}>
                {item.purchaser}
              </p>
            )}
            {item.sender && (
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {item.sender}
              </p>
            )}
            <p className="text-sm text-[var(--text-secondary)]">
              {item.message}
            </p>
          </div>

          {/* Actions */}
          {item.showActions && (
            <div
              className="flex"
              style={{
                gap: "var(--spacing-sm)",
                marginTop: "var(--spacing-sm)",
              }}
            >
              <button
                className="text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded hover:bg-[var(--border-secondary)] transition-colors"
                style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
              >
                Reply
              </button>
              <button
                className="text-xs bg-[var(--accent-red)] text-white rounded hover:bg-red-600 transition-colors"
                style={{ padding: "var(--spacing-xs) var(--spacing-sm)" }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Inbox() {
  const inboxItems: InboxItem[] = [
    {
      id: "1",
      type: "payout",
      icon: <DollarSign size={16} />,
      recipient: "Bola Ahmed Josiah",
      message: "Instructor withdrawal of $500.",
      time: "5:25 PM",
    },
    {
      id: "2",
      type: "purchase",
      icon: <DollarSign size={16} />,
      purchaser: "Etieno Ekanem",
      message: "Purchased Mission Javascript...",
      time: "5:25 PM",
      showActions: true,
    },
    {
      id: "3",
      type: "ticket",
      icon: <Hash size={16} />,
      sender: "Bola Ahmed Josiah",
      message: "I've made payment but it's no...",
      time: "5:25 PM",
    },
    {
      id: "4",
      type: "payout",
      icon: <DollarSign size={16} />,
      recipient: "Bola Ahmed Josiah",
      message: "Instructor withdrawal of $500.",
      time: "5:25 PM",
    },
  ];

  return (
    <div className="bg-[var(--bg-card)] rounded-lg">
      <div style={{ padding: "var(--spacing-lg)" }}>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Inbox
        </h2>
      </div>
      <div
        style={{
          padding: "var(--spacing-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-md)",
        }}
      >
        {inboxItems.map((item) => (
          <InboxItemComponent key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
