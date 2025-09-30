import { NextRequest, NextResponse } from "next/server";

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

    // TODO: Validate the token with your backend
    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { email, firstName, lastName, role, username, password } = body;

    // Validate required fields
    if (!email || !firstName || !lastName || !role || !username || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // TODO: Replace with your actual backend API call
    const success = await createAdminFromBackend(token, {
      email,
      firstName,
      lastName,
      role,
      username,
      password,
    });

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Admin created successfully",
        data: {
          email,
          firstName,
          lastName,
          role,
          username,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Failed to create admin" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Placeholder function - replace with your actual backend API call
async function createAdminFromBackend(
  token: string,
  adminData: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    username: string;
    password: string;
  }
) {
  // TODO: Replace with your actual backend API call
  // This could be:
  // - Direct database query
  // - External API call to your backend
  // - etc.

  // For demo purposes, return true
  // In production, you should call your backend API to create the admin
  console.log("Creating admin with data:", {
    email: adminData.email,
    firstName: adminData.firstName,
    lastName: adminData.lastName,
    role: adminData.role,
    username: adminData.username,
    // Don't log password for security
  });
  return true;
}
