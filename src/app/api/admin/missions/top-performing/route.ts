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

    // Call your actual backend API
    const topMissions = await getTopPerformingMissionsFromBackend(token);

    const response = {
      success: true,
      data: topMissions,
      total: topMissions.length,
      message: "Top performing missions retrieved successfully",
    };

    console.log("=== TOP PERFORMING MISSIONS API RESPONSE ===");
    console.log("Response:", response);
    console.log("Total missions:", topMissions.length);
    console.log("===========================================");

    return NextResponse.json(response);
  } catch (error) {
    console.error("Get top performing missions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Call your actual backend API
async function getTopPerformingMissionsFromBackend(token: string) {
  try {
    console.log("=== CALLING REAL BACKEND API ===");
    console.log(
      "URL: https://themutantschool-backend.onrender.com/api/admin/missions"
    );
    console.log("Token:", token);

    const response = await fetch(
      "https://themutantschool-backend.onrender.com/api/admin/missions",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Backend Response Status:", response.status);
    console.log(
      "Backend Response Headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend API Error:", errorText);
      throw new Error(`Backend API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("=== REAL BACKEND DATA ===");
    console.log("Missions from backend:", data);
    console.log("Missions data type:", typeof data);
    console.log("Missions data keys:", Object.keys(data));
    if (data.data) {
      console.log("Missions data.data:", data.data);
      console.log("Missions data.data type:", typeof data.data);
      console.log("Missions data.data is array:", Array.isArray(data.data));
      if (Array.isArray(data.data)) {
        console.log("Missions count:", data.data.length);
        console.log("First mission:", data.data[0]);
        console.log(
          "Published missions:",
          data.data.filter(
            (m: { isPublished: boolean }) => m.isPublished === true
          ).length
        );
        console.log(
          "Draft missions:",
          data.data.filter(
            (m: { isPublished: boolean }) => m.isPublished === false
          ).length
        );
      }
    }
    console.log("=========================");

    return data;
  } catch (error) {
    console.error("Error calling backend API:", error);
    throw error;
  }
}
