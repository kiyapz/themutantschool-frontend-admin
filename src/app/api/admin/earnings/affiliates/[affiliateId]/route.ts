import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { affiliateId: string } }
) {
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

    // Get affiliate ID from params
    const { affiliateId } = params;

    if (!affiliateId) {
      return NextResponse.json(
        { error: "Affiliate ID is required" },
        { status: 400 }
      );
    }

    // TODO: Replace with your actual backend API call
    const earnings = await getAffiliateEarningsFromBackend(token, affiliateId);

    return NextResponse.json({
      success: true,
      data: earnings,
      message: "Affiliate earnings retrieved successfully",
    });
  } catch (error) {
    console.error("Get affiliate earnings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Placeholder function - replace with your actual backend API call
async function getAffiliateEarningsFromBackend(
  token: string,
  affiliateId: string
) {
  // TODO: Replace with your actual backend API call
  // This could be:
  // - Direct database query
  // - External API call to your backend
  // - etc.

  // For demo purposes, return mock data
  // In production, you should fetch from your backend
  return {
    affiliateId,
    totalEarnings: 2250,
    monthlyEarnings: 450,
    currency: "USD",
    totalReferrals: 45,
    activeReferrals: 32,
    conversionRate: 12.5,
    commissionRate: 15,
    earningsHistory: [
      {
        date: "2024-01-01",
        amount: 450,
        referrals: 8,
        description: "Monthly commission for January 2024",
      },
      {
        date: "2023-12-01",
        amount: 380,
        referrals: 6,
        description: "Monthly commission for December 2023",
      },
      {
        date: "2023-11-01",
        amount: 520,
        referrals: 10,
        description: "Monthly commission for November 2023",
      },
    ],
    recentTransactions: [
      {
        id: "1",
        date: "2024-01-20T10:30:00Z",
        amount: 75,
        type: "commission",
        description: "Commission from referral #45",
        status: "completed",
      },
      {
        id: "2",
        date: "2024-01-18T14:20:00Z",
        amount: 50,
        type: "bonus",
        description: "Performance bonus for Q1 2024",
        status: "completed",
      },
      {
        id: "3",
        date: "2024-01-15T09:15:00Z",
        amount: 100,
        type: "commission",
        description: "Commission from referral #44",
        status: "pending",
      },
    ],
  };
}
