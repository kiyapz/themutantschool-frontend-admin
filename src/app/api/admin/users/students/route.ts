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
    // For now, we'll just check if it exists
    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // TODO: Replace with your actual backend API call
    // This is a placeholder - you should call your backend API
    const students = await getStudentsFromBackend(token);

    return NextResponse.json({
      success: true,
      data: students,
      total: students.length,
      message: "Students retrieved successfully",
    });
  } catch (error) {
    console.error("Get students error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Placeholder function - replace with your actual backend API call
async function getStudentsFromBackend(token: string) {
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
    {
      _id: "3",
      firstName: "Omar",
      lastName: "Mahmoud",
      email: "omar.mahmoud@example.com",
      username: "omar_mahmoud",
      role: "student",
      status: "inactive",
      joinDate: "2024-01-10T11:30:00Z",
      lastLogin: "2024-01-18T10:20:00Z",
      profile: {
        avatar: null,
        phone: "+1234567892",
        country: "UAE",
        city: "Dubai",
      },
      progress: {
        completedMissions: 2,
        totalMissions: 5,
        completionRate: 40,
        currentLevel: "Beginner",
      },
      enrollment: {
        enrolledMissions: 4,
        certificates: 2,
        badges: 1,
      },
      subscription: {
        type: "Premium",
        status: "expired",
        expiresAt: "2024-01-15T23:59:59Z",
      },
    },
    {
      _id: "4",
      firstName: "Aisha",
      lastName: "Mohammed",
      email: "aisha.mohammed@example.com",
      username: "aisha_mohammed",
      role: "student",
      status: "active",
      joinDate: "2024-01-12T14:20:00Z",
      lastLogin: "2024-01-20T09:10:00Z",
      profile: {
        avatar: null,
        phone: "+1234567893",
        country: "Jordan",
        city: "Amman",
      },
      progress: {
        completedMissions: 4,
        totalMissions: 5,
        completionRate: 80,
        currentLevel: "Advanced",
      },
      enrollment: {
        enrolledMissions: 5,
        certificates: 4,
        badges: 3,
      },
      subscription: {
        type: "Premium",
        status: "active",
        expiresAt: "2024-12-31T23:59:59Z",
      },
    },
    {
      _id: "5",
      firstName: "Khalid",
      lastName: "Ibrahim",
      email: "khalid.ibrahim@example.com",
      username: "khalid_ibrahim",
      role: "student",
      status: "active",
      joinDate: "2024-01-18T16:45:00Z",
      lastLogin: "2024-01-20T12:30:00Z",
      profile: {
        avatar: null,
        phone: "+1234567894",
        country: "Kuwait",
        city: "Kuwait City",
      },
      progress: {
        completedMissions: 0,
        totalMissions: 5,
        completionRate: 0,
        currentLevel: "Beginner",
      },
      enrollment: {
        enrolledMissions: 1,
        certificates: 0,
        badges: 0,
      },
      subscription: {
        type: "Free",
        status: "active",
        expiresAt: null,
      },
    },
  ];
}
