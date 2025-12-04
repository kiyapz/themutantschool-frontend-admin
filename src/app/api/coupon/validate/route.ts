import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'https://themutantschool-backend.onrender.com';

export async function POST(request: NextRequest) {
  try {
    // Get authorization header (optional for validation endpoint, but good to have)
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const body = await request.json();

    // Call actual backend API
    const result = await validateCouponInBackend(token, body);

    console.log("=== COUPON VALIDATION SUCCESSFUL ===");
    console.log("Response:", result);
    console.log("================================");

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}

// Call actual backend API to validate coupon
async function validateCouponInBackend(token: string | null, validationData: any) {
  try {
    console.log("=== CALLING REAL BACKEND API TO VALIDATE COUPON ===");
    const url = `${BACKEND_BASE_URL}/api/coupon/validate`;
    console.log("URL:", url);
    console.log("Token:", token ? "Present" : "Missing");
    console.log("Request Data:", validationData);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(validationData),
    });

    console.log("Backend Response Status:", response.status);
    console.log(
      "Backend Response Headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend API Error:", errorText);
      const error: any = new Error(`Backend API error: ${response.status} - ${errorText}`);
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    console.log("=== REAL BACKEND DATA ===");
    console.log("Validation response from backend:", data);
    console.log("Response data type:", typeof data);
    console.log("Response data keys:", Object.keys(data));
    console.log("=========================");

    return data;
  } catch (error) {
    console.error("Error calling backend API:", error);
    throw error;
  }
}

