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
    const platformEarnings = await getPlatformEarningsFromBackend(token);

    return NextResponse.json({
      success: true,
      data: platformEarnings,
      message: "Platform earnings retrieved successfully",
    });
  } catch (error) {
    console.error("Get platform earnings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Placeholder function - replace with your actual backend API call
async function getPlatformEarningsFromBackend(token: string) {
  // TODO: Replace with your actual backend API call
  // This could be:
  // - Direct database query
  // - External API call to your backend
  // - etc.

  // For demo purposes, return mock data
  // In production, you should fetch from your backend
  return {
    totalRevenue: 125000,
    monthlyRevenue: 25000,
    currency: "USD",
    totalUsers: 2500,
    activeUsers: 1800,
    totalMissions: 45,
    activeMissions: 38,
    totalInstructors: 25,
    activeInstructors: 20,
    totalAffiliates: 15,
    activeAffiliates: 12,
    revenueBreakdown: {
      missionSales: 80000,
      subscriptions: 30000,
      affiliateCommissions: 10000,
      other: 5000,
    },
    monthlyTrends: [
      {
        month: "2024-01",
        revenue: 25000,
        users: 1800,
        missions: 38,
        growth: 12.5,
      },
      {
        month: "2023-12",
        revenue: 22000,
        users: 1650,
        missions: 35,
        growth: 8.3,
      },
      {
        month: "2023-11",
        revenue: 20000,
        users: 1520,
        missions: 32,
        growth: 15.2,
      },
    ],
    topPerformingMissions: [
      {
        missionId: "1",
        title: "Javascript Fundamental",
        revenue: 15000,
        enrollments: 500,
        completionRate: 85,
      },
      {
        missionId: "2",
        title: "React Advanced",
        revenue: 12000,
        enrollments: 400,
        completionRate: 78,
      },
      {
        missionId: "3",
        title: "Mobile App Design",
        revenue: 10000,
        enrollments: 350,
        completionRate: 82,
      },
    ],
    recentTransactions: [
      {
        id: "1",
        date: "2024-01-20T10:30:00Z",
        amount: 500,
        type: "mission_sale",
        description: "Mobile App Design mission sale",
        status: "completed",
      },
      {
        id: "2",
        date: "2024-01-19T14:20:00Z",
        amount: 1200,
        type: "subscription",
        description: "Premium subscription payment",
        status: "completed",
      },
      {
        id: "3",
        date: "2024-01-18T09:15:00Z",
        amount: 300,
        type: "affiliate_commission",
        description: "Affiliate commission payout",
        status: "pending",
      },
    ],
  };
}
