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
    const affiliates = await getAffiliatesFromBackend(token);

    return NextResponse.json({
      success: true,
      data: affiliates,
      total: affiliates.length,
      message: "Affiliates retrieved successfully",
    });
  } catch (error) {
    console.error("Get affiliates error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Placeholder function - replace with your actual backend API call
async function getAffiliatesFromBackend(token: string) {
  // TODO: Replace with your actual backend API call
  // This could be:
  // - Direct database query
  // - External API call to your backend
  // - etc.

  // For demo purposes, return mock data
  // In production, you should fetch from your backend
  return [
    {
      _id: "1",
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah.wilson@example.com",
      username: "sarah_wilson",
      role: "affiliate",
      status: "active",
      joinDate: "2023-12-01T09:00:00Z",
      lastLogin: "2024-01-20T16:30:00Z",
      profile: {
        avatar: null,
        phone: "+1234567900",
        country: "USA",
        city: "New York",
        bio: "Digital Marketing Specialist and Content Creator",
        specialties: [
          "Digital Marketing",
          "Content Creation",
          "Social Media",
          "SEO",
        ],
        socialLinks: {
          linkedin: "https://linkedin.com/in/sarah-wilson",
          twitter: "https://twitter.com/sarah_wilson",
          instagram: "https://instagram.com/sarah_wilson",
        },
      },
      stats: {
        totalReferrals: 45,
        activeReferrals: 32,
        totalEarnings: 2250,
        monthlyEarnings: 450,
        conversionRate: 12.5,
      },
      earnings: {
        totalEarnings: 2250,
        monthlyEarnings: 450,
        currency: "USD",
      },
      subscription: {
        type: "Affiliate",
        status: "active",
        expiresAt: "2024-12-31T23:59:59Z",
      },
    },
    {
      _id: "2",
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@example.com",
      username: "michael_brown",
      role: "affiliate",
      status: "active",
      joinDate: "2023-11-15T10:30:00Z",
      lastLogin: "2024-01-19T14:20:00Z",
      profile: {
        avatar: null,
        phone: "+1234567901",
        country: "Canada",
        city: "Toronto",
        bio: "Tech Blogger and Influencer",
        specialties: [
          "Tech Blogging",
          "Influencer Marketing",
          "YouTube",
          "Podcasting",
        ],
        socialLinks: {
          linkedin: "https://linkedin.com/in/michael-brown",
          youtube: "https://youtube.com/@michael-brown",
          twitter: "https://twitter.com/michael_brown",
        },
      },
      stats: {
        totalReferrals: 78,
        activeReferrals: 56,
        totalEarnings: 3900,
        monthlyEarnings: 780,
        conversionRate: 15.2,
      },
      earnings: {
        totalEarnings: 3900,
        monthlyEarnings: 780,
        currency: "USD",
      },
      subscription: {
        type: "Affiliate",
        status: "active",
        expiresAt: "2024-12-31T23:59:59Z",
      },
    },
    {
      _id: "3",
      firstName: "Lisa",
      lastName: "Garcia",
      email: "lisa.garcia@example.com",
      username: "lisa_garcia",
      role: "affiliate",
      status: "inactive",
      joinDate: "2023-10-20T08:45:00Z",
      lastLogin: "2024-01-10T11:10:00Z",
      profile: {
        avatar: null,
        phone: "+1234567902",
        country: "Spain",
        city: "Madrid",
        bio: "Educational Content Creator",
        specialties: ["Education", "Online Courses", "E-learning", "Tutoring"],
        socialLinks: {
          linkedin: "https://linkedin.com/in/lisa-garcia",
          twitter: "https://twitter.com/lisa_garcia",
          tiktok: "https://tiktok.com/@lisa_garcia",
        },
      },
      stats: {
        totalReferrals: 23,
        activeReferrals: 8,
        totalEarnings: 1150,
        monthlyEarnings: 0,
        conversionRate: 8.7,
      },
      earnings: {
        totalEarnings: 1150,
        monthlyEarnings: 0,
        currency: "USD",
      },
      subscription: {
        type: "Affiliate",
        status: "inactive",
        expiresAt: "2024-01-15T23:59:59Z",
      },
    },
  ];
}
