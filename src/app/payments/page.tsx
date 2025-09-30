import PaymentStats from "@/components/PaymentStats";
import PaymentTabs from "@/components/PaymentTabs";

export default function PaymentsPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Payment Stats Cards */}
      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <PaymentStats />
      </div>

      {/* Payment Tabs */}
      <div className="flex-1">
        <PaymentTabs />
      </div>
    </div>
  );
}
