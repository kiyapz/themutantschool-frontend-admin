import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'https://themutantschool-backend.onrender.com';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params;

    // Call actual backend API
    const result = await getCouponByIdFromBackend(token, id);

    console.log(`=== COUPON ${id} FETCHED SUCCESSFULLY ===`);
    console.log("Response:", result);
    console.log("================================");

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`Error fetching coupon:`, error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params;
    const body = await request.json();

    // Call actual backend API
    const result = await updateCouponInBackend(token, id, body);

    console.log(`=== COUPON ${id} UPDATED SUCCESSFULLY ===`);
    console.log("Response:", result);
    console.log("================================");

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`Error updating coupon:`, error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params;

    // Call actual backend API
    const result = await deleteCouponFromBackend(token, id);

    console.log(`=== COUPON ${id} DELETED SUCCESSFULLY ===`);
    console.log("Response:", result);
    console.log("================================");

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`Error deleting coupon:`, error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}

// Call actual backend API to get coupon by ID or code
async function getCouponByIdFromBackend(token: string, id: string) {
  try {
    console.log("=== CALLING REAL BACKEND API TO GET COUPON ===");
    const url = `${BACKEND_BASE_URL}/api/coupon/${id}`;
    console.log("URL:", url);
    console.log("Token:", token ? "Present" : "Missing");
    console.log("Coupon ID/Code:", id);

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
    console.log("Coupon from backend:", data);
    console.log("Coupon data type:", typeof data);
    console.log("Coupon data keys:", Object.keys(data));
    console.log("=========================");

    return data;
  } catch (error) {
    console.error("Error calling backend API:", error);
    throw error;
  }
}

// Call actual backend API to update coupon
async function updateCouponInBackend(token: string, id: string, couponData: any) {
  try {
    console.log("=== CALLING REAL BACKEND API TO UPDATE COUPON ===");
    const url = `${BACKEND_BASE_URL}/api/coupon/${id}`;
    console.log("URL:", url);
    console.log("Token:", token ? "Present" : "Missing");
    console.log("Coupon ID:", id);
    console.log("Request Data:", couponData);

    const response = await fetch(url, {
      method: "PUT",
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
    console.log("Updated coupon from backend:", data);
    console.log("Coupon data type:", typeof data);
    console.log("Coupon data keys:", Object.keys(data));
    console.log("=========================");

    return data;
  } catch (error) {
    console.error("Error calling backend API:", error);
    throw error;
  }
}

// Call actual backend API to delete coupon
async function deleteCouponFromBackend(token: string, id: string) {
  try {
    console.log("=== CALLING REAL BACKEND API TO DELETE COUPON ===");
    const url = `${BACKEND_BASE_URL}/api/coupon/${id}`;
    console.log("URL:", url);
    console.log("Token:", token ? "Present" : "Missing");
    console.log("Coupon ID:", id);

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend API Error:", errorText);
      const error: any = new Error(`Backend API error: ${response.status} - ${errorText}`);
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    console.log("=== REAL BACKEND DATA ===");
    console.log("Delete response from backend:", data);
    console.log("Response data type:", typeof data);
    console.log("Response data keys:", Object.keys(data));
    console.log("=========================");

    return data;
  } catch (error) {
    console.error("Error calling backend API:", error);
    throw error;
  }
}

