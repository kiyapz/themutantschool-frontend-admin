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
    const instructors = await getInstructorsFromBackend(token);

    const response = {
      success: true,
      data: instructors,
      total: instructors.length,
      message: "Instructors retrieved successfully",
    };

    console.log("=== INSTRUCTORS API RESPONSE ===");
    console.log("Response:", response);
    console.log("Total instructors:", instructors.length);
    console.log("================================");

    return NextResponse.json(response);
  } catch (error) {
    console.error("Get instructors error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Call your actual backend API
async function getInstructorsFromBackend(token: string) {
  try {
    console.log("=== CALLING REAL BACKEND API ===");
    console.log(
      "URL: https://themutantschool-backend.onrender.com/api/admin/users/instructors"
    );
    console.log("Token:", token);

    const response = await fetch(
      "https://themutantschool-backend.onrender.com/api/admin/users/instructors",
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
    console.log("Instructors from backend:", data);
    console.log("Instructors data type:", typeof data);
    console.log("Instructors data keys:", Object.keys(data));
    if (data.data) {
      console.log("Instructors data.data:", data.data);
      console.log("Instructors data.data type:", typeof data.data);
      console.log("Instructors data.data is array:", Array.isArray(data.data));
      if (Array.isArray(data.data)) {
        console.log("Instructors count:", data.data.length);
        console.log("First instructor:", data.data[0]);
      }
    }
    console.log("=========================");

    return data;
  } catch (error) {
    console.error("Error calling backend API:", error);
    throw error;
  }
}
