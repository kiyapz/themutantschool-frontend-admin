// This file uses client-side navigation and localStorage
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UserProfileTabs from "@/components/UserProfileTabs";

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if any user data exists in localStorage
    const hasInstructorData = localStorage.getItem("selectedInstructor");
    const hasStudentData = localStorage.getItem("selectedStudent");
    const hasAffiliateData = localStorage.getItem("selectedAffiliate");

    // If no data is found, redirect to the dashboard
    if (!hasInstructorData && !hasStudentData && !hasAffiliateData) {
      console.log("No user data found, redirecting to dashboard");
      router.push("/admin");
    }
  }, [router]);

  return (
    <div className="flex flex-col min-h-full">
      <UserProfileTabs />
    </div>
  );
}
