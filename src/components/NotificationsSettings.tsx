"use client";

import { useState } from "react";

interface ToggleSwitchProps {
  isActive: boolean;
  onChange: (active: boolean) => void;
  label: string;
}

function ToggleSwitch({ isActive, onChange, label }: ToggleSwitchProps) {
  return (
    <div
      className="flex items-center gap-5"
      style={{ marginBottom: "var(--spacing-lg)" }}
    >
     
      <button
        onClick={() => onChange(!isActive)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] ${
          isActive ? "bg-[var(--accent-purple)]" : "bg-[var(--bg-tertiary)]"
        }`}
        style={{ border: "none" }}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className="text-sm text-[var(--text-primary)]">{label}</span> 
    </div>
  );
}

interface SettingsSectionProps {
  title: string;
  description: string;
  toggles: Array<{
    id: string;
    label: string;
    isActive: boolean;
    onChange: (active: boolean) => void;
  }>;
}

function SettingsSection({
  title,
  description,
  toggles,
}: SettingsSectionProps) {
  return (
    <div style={{ marginBottom: "var(--spacing-2xl)" }}>
      <h3
        className="text-lg font-semibold text-[var(--text-primary)]"
        style={{ marginBottom: "var(--spacing-sm)" }}
      >
        {title}
      </h3>
      <p
        className="text-sm text-[var(--text-secondary)]"
        style={{ marginBottom: "var(--spacing-lg)" }}
      >
        {description}
      </p>
      <div style={{ padding: "var(--spacing-md) 0" }}>
        {toggles.map((toggle) => (
          <ToggleSwitch
            key={toggle.id}
            isActive={toggle.isActive}
            onChange={toggle.onChange}
            label={toggle.label}
          />
        ))}
      </div>
    </div>
  );
}

export default function NotificationsSettings() {
  const [securityAlerts, setSecurityAlerts] = useState({
    newDeviceLogin: true,
    unusualActivities: false,
  });

  const [newsUpdates, setNewsUpdates] = useState({
    newFeatures: false,
    tipsNews: false,
  });

  const handleSecurityAlertChange = (key: string, value: boolean) => {
    console.log(`Security alert ${key} changed to:`, value);
    setSecurityAlerts((prev) => ({ ...prev, [key]: value }));
  };

  const handleNewsUpdateChange = (key: string, value: boolean) => {
    console.log(`News update ${key} changed to:`, value);
    setNewsUpdates((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="bg-[#0F0F0F] rounded-lg"
      style={{ padding: "var(--spacing-xl)" }}
    >
      <h2
        className="text-xl font-bold text-[var(--text-primary)]"
        style={{ marginBottom: "var(--spacing-xl)" }}
      >
        Notifications Settings
      </h2>

      {/* Security Alerts Section */}
      <SettingsSection
        title="Security Alerts"
        description="Set up the security alerts you want to receive"
        toggles={[
          {
            id: "newDeviceLogin",
            label: "Notify me of a new device login",
            isActive: securityAlerts.newDeviceLogin,
            onChange: (active) =>
              handleSecurityAlertChange("newDeviceLogin", active),
          },
          {
            id: "unusualActivities",
            label: "Email me when unusual activities are encountered",
            isActive: securityAlerts.unusualActivities,
            onChange: (active) =>
              handleSecurityAlertChange("unusualActivities", active),
          },
        ]}
      />

      {/* News and Updates Section */}
      <SettingsSection
        title="News and Updates"
        description="Set up newsletter alerts you want to receive"
        toggles={[
          {
            id: "newFeatures",
            label:
              "Send me notifications of new features and updates through email",
            isActive: newsUpdates.newFeatures,
            onChange: (active) => handleNewsUpdateChange("newFeatures", active),
          },
          {
            id: "tipsNews",
            label: "Send me tips and latest news",
            isActive: newsUpdates.tipsNews,
            onChange: (active) => handleNewsUpdateChange("tipsNews", active),
          },
        ]}
      />
    </div>
  );
}
