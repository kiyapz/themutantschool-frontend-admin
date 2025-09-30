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
    const enrolledStudents = await getEnrolledStudentsFromBackend(token);

    return NextResponse.json({
      success: true,
      data: enrolledStudents,
      total: enrolledStudents.length,
      message: "Enrolled students retrieved successfully",
    });
  } catch (error) {
    console.error("Get enrolled students error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Placeholder function - replace with your actual backend API call
async function getEnrolledStudentsFromBackend(token: string) {
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
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed.hassan@example.com",
      username: "ahmed_hassan",
      role: "student",
      status: "active",
      joinDate: "2024-01-15T10:00:00Z",
      lastLogin: "2024-01-20T14:30:00Z",
      profile: {
        avatar: null,
        phone: "+1234567890",
        country: "Egypt",
        city: "Cairo",
      },
      progress: {
        completedMissions: 3,
        totalMissions: 5,
        completionRate: 60,
        currentLevel: "Intermediate",
      },
      enrollment: {
        enrolledMissions: 5,
        certificates: 3,
        badges: 2,
      },
      subscription: {
        type: "Premium",
        status: "active",
        expiresAt: "2024-12-31T23:59:59Z",
      },
    },
    {
      _id: "2",
      firstName: "Fatima",
      lastName: "Ali",
      email: "fatima.ali@example.com",
      username: "fatima_ali",
      role: "student",
      status: "active",
      joinDate: "2024-01-16T09:15:00Z",
      lastLogin: "2024-01-19T16:45:00Z",
      profile: {
        avatar: null,
        phone: "+1234567891",
        country: "Saudi Arabia",
        city: "Riyadh",
      },
      progress: {
        completedMissions: 1,
        totalMissions: 5,
        completionRate: 20,
        currentLevel: "Beginner",
      },
      enrollment: {
        enrolledMissions: 3,
        certificates: 1,
        badges: 0,
      },
      subscription: {
        type: "Basic",
        status: "active",
        expiresAt: "2024-06-30T23:59:59Z",
      },
    },
  ];
}
