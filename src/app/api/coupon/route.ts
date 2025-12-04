import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'https://themutantschool-backend.onrender.com';

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    // Call actual backend API
    const result = await createCouponInBackend(token, body);

    console.log("=== COUPON CREATED SUCCESSFULLY ===");
    console.log("Response:", result);
    console.log("================================");

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
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

    // Call actual backend API
    const coupons = await getCouponsFromBackend(token);

    console.log("=== COUPONS FETCHED SUCCESSFULLY ===");
    console.log("Response:", coupons);
    console.log("Total coupons:", coupons?.data?.length || coupons?.coupons?.length || 0);
    console.log("================================");

    return NextResponse.json(coupons);
  } catch (error: any) {
    console.error("Error listing coupons:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}

// Call actual backend API to create coupon
async function createCouponInBackend(token: string, couponData: any) {
  try {
    console.log("=== CALLING REAL BACKEND API TO CREATE COUPON ===");
    const url = `${BACKEND_BASE_URL}/api/coupon`;
    console.log("URL:", url);
    console.log("Token:", token ? "Present" : "Missing");
    console.log("Request Data:", couponData);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(couponData),
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
    console.log("Coupon created from backend:", data);
    console.log("Coupon data type:", typeof data);
    console.log("Coupon data keys:", Object.keys(data));
    console.log("=========================");

    return data;
  } catch (error) {
    console.error("Error calling backend API:", error);
    throw error;
  }
}

// Call actual backend API to get coupons
async function getCouponsFromBackend(token: string) {
  try {
    console.log("=== CALLING REAL BACKEND API TO GET COUPONS ===");
    const url = `${BACKEND_BASE_URL}/api/coupon`;
    console.log("URL:", url);
    console.log("Token:", token ? "Present" : "Missing");

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
      const error: any = new Error(`Backend API error: ${response.status} - ${errorText}`);
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    console.log("=== REAL BACKEND DATA ===");
    console.log("Coupons from backend:", data);
    console.log("Coupons data type:", typeof data);
    console.log("Coupons data keys:", Object.keys(data));
    if (data.data) {
      console.log("Coupons data.data:", data.data);
      console.log("Coupons data.data type:", typeof data.data);
      console.log("Coupons data.data is array:", Array.isArray(data.data));
      if (Array.isArray(data.data)) {
        console.log("Coupons count:", data.data.length);
        if (data.data.length > 0) {
          console.log("First coupon:", data.data[0]);
        }
      }
    }
    if (data.coupons) {
      console.log("Coupons array:", data.coupons);
      console.log("Coupons count:", data.coupons.length);
      if (data.coupons.length > 0) {
        console.log("First coupon:", data.coupons[0]);
      }
    }
    console.log("=========================");

    return data;
  } catch (error) {
    console.error("Error calling backend API:", error);
    throw error;
  }
}

