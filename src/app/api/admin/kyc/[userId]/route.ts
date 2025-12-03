import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
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

    // Get userId from params (await the Promise in Next.js 15)
    const { userId } = await params;

    // Call backend API
    const result = await deleteKYCFromBackend(token, userId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Delete KYC error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function deleteKYCFromBackend(token: string, userId: string) {
  try {
    console.log("=== CALLING REAL BACKEND API ===");
    const url = `https://themutantschool-backend.onrender.com/api/kyc/${userId}`;
    console.log("URL:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Backend Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend API Error:", errorText);
      throw new Error(`Backend API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("=== REAL BACKEND DATA ===");
    console.log("KYC delete response:", data);
    console.log("=========================");

    return data;
  } catch (error) {
    console.error("Error calling backend API:", error);
    throw error;
  }
}


