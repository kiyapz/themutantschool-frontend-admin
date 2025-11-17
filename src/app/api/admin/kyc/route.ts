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

    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    // Fetch real data from backend
    const backendResponse = await getKYCFromBackend(token, status, page, limit);

    // Backend already returns { success: true, data: [...], pagination: {...} }
    // Pass it through as-is
    return NextResponse.json(backendResponse);
  } catch (error) {
    console.error("Get KYC error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getKYCFromBackend(
  token: string,
  status: string,
  page: string,
  limit: string
) {
  try {
    console.log("=== CALLING REAL BACKEND API ===");
    
    // Build URL with query parameters
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    params.append("page", page);
    params.append("limit", limit);
    
    const url = `https://themutantschool-backend.onrender.com/api/kyc?${params.toString()}`;
    console.log("URL:", url);
    console.log("Token:", token);
    console.log("Status:", status);
    console.log("Page:", page);
    console.log("Limit:", limit);

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
    console.log("=== REAL BACKEND DATA ===");
    console.log("KYC from backend:", data);
    console.log("KYC data type:", typeof data);
    console.log("KYC data keys:", Object.keys(data));
    if (data.data) {
      console.log("KYC data.data:", data.data);
      console.log("KYC data.data type:", typeof data.data);
      if (Array.isArray(data.data)) {
        console.log("KYC count:", data.data.length);
        if (data.data.length > 0) {
          console.log("First KYC record:", data.data[0]);
        }
      }
    }
    if (data.pagination) {
      console.log("Pagination:", data.pagination);
    }
    console.log("=========================");

    // Return the data as-is since backend already returns the correct structure
    return data;
  } catch (error) {
    console.error("Error calling backend API:", error);
    throw error;
  }
}

