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
    const missions = await getMissionsFromBackend();

    return NextResponse.json({
      success: true,
      data: missions,
      total: missions.length,
      message: "Missions retrieved successfully",
    });
  } catch (error) {
    console.error("Get missions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Placeholder function - replace with your actual backend API call
async function getMissionsFromBackend() {
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
      title: "Javascript Fundamental",
      instructor: "Abdulrahman Raian",
      category: "Coding",
      levels: 5,
      capsules: 2,
      recruits: 20,
      price: 30,
      priceType: "Lifetime",
      status: "Active",
      description: "Learn JavaScript from the ground up",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
    },
    {
      _id: "2",
      title: "Mobile App Design",
      instructor: "Shadia Mohammed",
      category: "Design",
      levels: 5,
      capsules: 3,
      recruits: 30,
      price: 500,
      priceType: "Lifetime",
      status: "Active",
      description: "Master mobile app design principles",
      createdAt: "2024-01-16T10:00:00Z",
      updatedAt: "2024-01-16T10:00:00Z",
    },
    {
      _id: "3",
      title: "Flutter - Masterclass",
      instructor: "Abdulrahman Raian",
      category: "Coding",
      levels: 5,
      capsules: 3,
      recruits: 20,
      price: 0,
      priceType: "Limited offer",
      status: "Pending",
      description: "Complete Flutter development course",
      createdAt: "2024-01-17T10:00:00Z",
      updatedAt: "2024-01-17T10:00:00Z",
    },
    {
      _id: "4",
      title: "HTML, Basics",
      instructor: "Abdulrahman Raian",
      category: "Coding",
      levels: 5,
      capsules: 2,
      recruits: 20,
      price: 0,
      priceType: "Limited offer",
      status: "Active",
      description: "HTML fundamentals for beginners",
      createdAt: "2024-01-18T10:00:00Z",
      updatedAt: "2024-01-18T10:00:00Z",
    },
    {
      _id: "5",
      title: "Atomic Habit Book Review",
      instructor: "Abdulrahman Raian",
      category: "Growth",
      levels: 5,
      capsules: 3,
      recruits: 20,
      price: 20,
      priceType: "Lifetime",
      status: "Pending",
      description: "Deep dive into Atomic Habits book",
      createdAt: "2024-01-19T10:00:00Z",
      updatedAt: "2024-01-19T10:00:00Z",
    },
  ];
}
