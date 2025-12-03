import { NextRequest, NextResponse } from "next/server";

async function rejectRefundFromBackend(
  token: string,
  refundId: string
) {
  try {
    console.log("=== CALLING REAL BACKEND API TO REJECT REFUND ===");
    const url = `https://themutantschool-backend.onrender.com/api/payment/refund/${refundId}/reject`;
    console.log("URL:", url);
    console.log("Token:", token);
    console.log("Refund ID:", refundId);

    const response = await fetch(url, {
      method: "PUT",
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
    console.log("=== REAL BACKEND DATA (Reject Refund) ===");
    console.log("Reject refund response:", data);
    console.log("============================================");
    return data;
  } catch (error) {
    console.error("Error calling backend API to reject refund:", error);
    throw error;
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ refundId: string }> }
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

    const { refundId } = await params;

    if (!refundId) {
      return NextResponse.json(
        { error: "Refund ID is required" },
        { status: 400 }
      );
    }

    // Call backend API to reject refund
    const backendResponse = await rejectRefundFromBackend(
      token,
      refundId
    );

    return NextResponse.json(backendResponse);
  } catch (error) {
    console.error("Reject refund error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

