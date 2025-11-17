import KYCList from "@/components/KYCList";

export default function KYCPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* KYC List */}
      <div className="flex-1">
        <KYCList />
      </div>
    </div>
  );
}

