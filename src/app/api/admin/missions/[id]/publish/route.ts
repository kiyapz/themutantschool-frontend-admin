import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: missionId } = await params;

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

    const token = authHeader.substring(7); // Get the request body (optional)
    const url = `https://themutantschool-backend.onrender.com/api/admin/missions/${missionId}/publish`;

    // Get the request body (if present)
    let body = {};
    try {
      const contentType = request.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        body = await request.json();
      }
    } catch (error) {
      // If no body is provided, use default
      body = { isPublished: true };
    }
    console.log("Request body:", body);

    console.log("--- PUT Publish Mission API Call ---");
    console.log("Mission ID:", missionId);
    console.log("URL:", url);
    console.log("Token:", token.substring(0, 20) + "...");
    console.log("Body:", body);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("Backend Response Status:", response.status);
    console.log(
      "Backend Response Headers:",
      Object.fromEntries(response.headers.entries())
    );

    const data = await response.json();
    console.log("Backend Response Data:", data);

    if (response.ok) {
      console.log("✅ Mission published successfully");
      return NextResponse.json({
        success: true,
        message: "Mission published successfully",
        data: data,
      });
    } else {
      console.log("❌ Failed to publish mission:", data);
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to publish mission",
          error: data,
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("❌ Error publishing mission:", error);
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
