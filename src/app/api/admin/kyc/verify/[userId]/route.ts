import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
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

    // Get request body
    const body = await request.json();
    const { status, reason, adminId } = body;

    if (!status || !adminId) {
      return NextResponse.json(
        { error: "status and adminId are required" },
        { status: 400 }
      );
    }

    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json(
        { error: "status must be 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    // Get userId from params
    const { userId } = params;

    // Call backend API
    const result = await verifyKYCFromBackend(
      token,
      userId,
      status,
      reason,
      adminId
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Verify KYC error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function verifyKYCFromBackend(
  token: string,
  userId: string,
  status: string,
  reason: string | undefined,
  adminId: string
) {
  try {
    console.log("=== CALLING REAL BACKEND API ===");
    const url = `https://themutantschool-backend.onrender.com/api/kyc/verify/${userId}`;
    console.log("URL:", url);
    console.log("Status:", status);
    console.log("Reason:", reason);
    console.log("Admin ID:", adminId);

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        reason: reason || "",
        adminId,
      }),
    });

    console.log("Backend Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend API Error:", errorText);
      throw new Error(`Backend API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("=== REAL BACKEND DATA ===");
    console.log("KYC verification response:", data);
    console.log("=========================");

    return data;
  } catch (error) {
    console.error("Error calling backend API:", error);
    throw error;
  }
}

