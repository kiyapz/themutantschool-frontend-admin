import AffiliateStats from "@/components/AffiliateStats";
import AffiliatesList from "@/components/AffiliatesList";

export default function AffiliatesPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Affiliate Stats Cards */}
      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <AffiliateStats />
      </div>

      {/* Affiliates List */}
      <div className="flex-1">
        <AffiliatesList />
      </div>
    </div>
  );
}
