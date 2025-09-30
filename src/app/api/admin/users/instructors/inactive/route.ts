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
    const inactiveInstructors = await getInactiveInstructorsFromBackend(token);

    return NextResponse.json({
      success: true,
      data: inactiveInstructors,
      total: inactiveInstructors.length,
      message: "Inactive instructors retrieved successfully",
    });
  } catch (error) {
    console.error("Get inactive instructors error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Placeholder function - replace with your actual backend API call
async function getInactiveInstructorsFromBackend(token: string) {
  // TODO: Replace with your actual backend API call
  // This could be:
  // - Direct database query
  // - External API call to your backend
  // - etc.

  // For demo purposes, return mock data
  // In production, you should fetch from your backend
  return [
    {
      _id: "3",
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed.hassan@example.com",
      username: "ahmed_hassan",
      role: "instructor",
      status: "inactive",
      joinDate: "2023-10-20T08:45:00Z",
      lastLogin: "2024-01-15T11:10:00Z",
      profile: {
        avatar: null,
        phone: "+1234567802",
        country: "UAE",
        city: "Dubai",
        bio: "Mobile App Developer and Flutter expert with extensive experience in cross-platform development.",
        specialties: [
          "Flutter",
          "Dart",
          "Mobile Development",
          "Firebase",
          "API Integration",
        ],
        socialLinks: {
          linkedin: "https://linkedin.com/in/ahmed-hassan",
          github: "https://github.com/ahmed-hassan",
          medium: "https://medium.com/@ahmed-hassan",
        },
      },
      stats: {
        totalMissions: 3,
        activeMissions: 1,
        completedMissions: 2,
        totalStudents: 95,
        averageRating: 4.6,
        totalReviews: 34,
      },
      earnings: {
        totalEarnings: 4200,
        monthlyEarnings: 0,
        currency: "USD",
      },
      subscription: {
        type: "Basic",
        status: "inactive",
        expiresAt: "2024-01-10T23:59:59Z",
      },
    },
  ];
}
