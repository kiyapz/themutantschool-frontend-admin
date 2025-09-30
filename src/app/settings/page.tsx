import NotificationsSettings from "@/components/NotificationsSettings";

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Notifications Settings */}
      <div className="flex-1">
        <NotificationsSettings />
      </div>
    </div>
  );
}
