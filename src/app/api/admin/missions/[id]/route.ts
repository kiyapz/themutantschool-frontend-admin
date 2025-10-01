import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const missionId = params.id;

    if (!missionId) {
      return NextResponse.json(
        { success: false, message: "Mission ID is required" },
        { status: 400 }
      );
    }

    // Get the authorization token from the request headers
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authorization token required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const url = `https://themutantschool-backend.onrender.com/api/admin/missions/${missionId}`;

    console.log("--- DELETE Mission API Call ---");
    console.log("Mission ID:", missionId);
    console.log("URL:", url);
    console.log("Token:", token.substring(0, 20) + "...");

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Backend Response Status:", response.status);
    console.log(
      "Backend Response Headers:",
      Object.fromEntries(response.headers.entries())
    );

    const data = await response.json();
    console.log("Backend Response Data:", data);

    if (response.ok) {
      console.log("✅ Mission deleted successfully");
      return NextResponse.json({
        success: true,
        message: "Mission deleted successfully",
        data: data,
      });
    } else {
      console.log("❌ Failed to delete mission:", data);
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to delete mission",
          error: data,
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("❌ Error deleting mission:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
