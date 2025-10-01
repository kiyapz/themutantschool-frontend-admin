import { NextRequest, NextResponse } from "next/server";

async function getPlatformEarningsFromBackend(token: string) {
  try {
    console.log("=== CALLING REAL BACKEND API FOR PLATFORM EARNINGS ===");
    const url =
      "https://themutantschool-backend.onrender.com/api/admin/earnings/platform";
    console.log("URL:", url);
    console.log("Token:", token);

    const response = await fetch(url, {
      method: "GET",
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend API Error:", errorText);
      throw new Error(`Backend API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("=== REAL BACKEND DATA (Platform Earnings) ===");
    console.log("Platform Earnings from backend:", data);
    console.log("============================================");
    return data;
  } catch (error) {
    console.error("Error calling backend API for platform earnings:", error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }
    const token = authHeader.substring(7);

    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const earningsData = await getPlatformEarningsFromBackend(token);

    console.log("=== PLATFORM EARNINGS API RESPONSE ===");
    console.log("Response data:", earningsData);
    console.log("======================================");

    return NextResponse.json(earningsData);
  } catch (error) {
    console.error("Get platform earnings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
