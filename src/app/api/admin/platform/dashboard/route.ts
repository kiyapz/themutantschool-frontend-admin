import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // TODO: Validate the token with your backend
    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // TODO: Replace with your actual backend API call
    const dashboardData = await getPlatformDashboardFromBackend(token);

    return NextResponse.json({
      success: true,
      data: dashboardData,
      message: "Platform dashboard data retrieved successfully",
    });
  } catch (error) {
    console.error("Get platform dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Placeholder function - replace with your actual backend API call
async function getPlatformDashboardFromBackend(token: string) {
  // TODO: Replace with your actual backend API call
  // This could be:
  // - Direct database query
  // - External API call to your backend
  // - etc.

  // For demo purposes, return mock data
  // In production, you should fetch from your backend
  return {
    overview: {
      totalUsers: 2500,
      activeUsers: 1800,
      totalMissions: 45,
      activeMissions: 38,
      totalInstructors: 25,
      activeInstructors: 20,
      totalAffiliates: 15,
      activeAffiliates: 12,
      totalRevenue: 125000,
      monthlyRevenue: 25000,
      currency: "USD",
    },
    stats: {
      userGrowth: 15.2,
      missionGrowth: 8.5,
      revenueGrowth: 12.3,
      completionRate: 78.5,
      averageRating: 4.6,
      retentionRate: 85.2,
    },
    recentActivity: [
      {
        id: "1",
        type: "user_registration",
        description: "New user registered: Ahmed Hassan",
        timestamp: "2024-01-20T10:30:00Z",
        status: "success",
      },
      {
        id: "2",
        type: "mission_completion",
        description:
          "Mission completed: JavaScript Fundamental by Sarah Wilson",
        timestamp: "2024-01-20T09:15:00Z",
        status: "success",
      },
      {
        id: "3",
        type: "instructor_join",
        description: "New instructor joined: Omar Mahmoud",
        timestamp: "2024-01-19T16:45:00Z",
        status: "success",
      },
      {
        id: "4",
        type: "payment_received",
        description: "Payment received: $500 for Mobile App Design mission",
        timestamp: "2024-01-19T14:20:00Z",
        status: "success",
      },
      {
        id: "5",
        type: "affiliate_signup",
        description: "New affiliate joined: Lisa Garcia",
        timestamp: "2024-01-18T11:30:00Z",
        status: "success",
      },
    ],
    topPerformers: {
      instructors: [
        {
          id: "1",
          name: "Abdulrahman Raian",
          earnings: 12500,
          students: 245,
          rating: 4.8,
        },
        {
          id: "2",
          name: "Fatima Ali",
          earnings: 15200,
          students: 320,
          rating: 4.7,
        },
        {
          id: "3",
          name: "Shadia Mohammed",
          earnings: 8900,
          students: 180,
          rating: 4.9,
        },
      ],
      missions: [
        {
          id: "1",
          title: "Javascript Fundamental",
          enrollments: 500,
          revenue: 15000,
          completionRate: 85,
        },
        {
          id: "2",
          title: "React Advanced",
          enrollments: 400,
          revenue: 12000,
          completionRate: 78,
        },
        {
          id: "3",
          title: "Mobile App Design",
          enrollments: 350,
          revenue: 10000,
          completionRate: 82,
        },
      ],
      affiliates: [
        {
          id: "1",
          name: "Michael Brown",
          referrals: 78,
          earnings: 3900,
          conversionRate: 15.2,
        },
        {
          id: "2",
          name: "Sarah Wilson",
          referrals: 45,
          earnings: 2250,
          conversionRate: 12.5,
        },
        {
          id: "3",
          name: "Lisa Garcia",
          referrals: 23,
          earnings: 1150,
          conversionRate: 8.7,
        },
      ],
    },
    charts: {
      revenueTrend: [
        { month: "2023-08", revenue: 15000 },
        { month: "2023-09", revenue: 18000 },
        { month: "2023-10", revenue: 19000 },
        { month: "2023-11", revenue: 20000 },
        { month: "2023-12", revenue: 22000 },
        { month: "2024-01", revenue: 25000 },
      ],
      userGrowth: [
        { month: "2023-08", users: 1200 },
        { month: "2023-09", users: 1350 },
        { month: "2023-10", users: 1450 },
        { month: "2023-11", users: 1520 },
        { month: "2023-12", users: 1650 },
        { month: "2024-01", users: 1800 },
      ],
      missionCompletions: [
        { month: "2023-08", completions: 450 },
        { month: "2023-09", completions: 520 },
        { month: "2023-10", completions: 580 },
        { month: "2023-11", completions: 620 },
        { month: "2023-12", completions: 680 },
        { month: "2024-01", completions: 750 },
      ],
    },
  };
}
