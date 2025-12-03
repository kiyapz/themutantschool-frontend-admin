import { NextRequest, NextResponse } from "next/server";

async function getRefundsFromBackend(token: string, status?: string) {
  try {
    console.log("=== CALLING REAL BACKEND API FOR REFUNDS ===");
    
    // Build URL with query parameters
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    
    const url = `https://themutantschool-backend.onrender.com/api/payment/refund${params.toString() ? `?${params.toString()}` : ""}`;
    console.log("URL:", url);
    console.log("Token:", token);
    console.log("Status:", status);

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
    console.log("=== REAL BACKEND DATA (Refunds) ===");
    console.log("Refunds from backend:", data);
    console.log("============================================");
    return data;
  } catch (error) {
    console.error("Error calling backend API for refunds:", error);
    throw error;
  }
}

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

    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;

    // Fetch real data from backend
    const backendResponse = await getRefundsFromBackend(token, status);

    // Backend already returns the correct structure
    return NextResponse.json(backendResponse);
  } catch (error) {
    console.error("Get refunds error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

