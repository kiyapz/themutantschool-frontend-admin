import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
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

    // TODO: Replace with your actual authentication logic
    // This is a placeholder - you should integrate with your backend service
    const isValidCredentials = await validateCredentials(email, password);

    if (!isValidCredentials) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate token (replace with your actual token generation)
    const token = generateToken(email);

    // Get user data with role (replace with your actual user data retrieval)
    const user = await getUserData(email);

    // Set cookie for authentication
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        accessToken: token,
        refreshToken: `refresh_${token}`,
        user: {
          email,
          role: user.role,
          id: user.id,
          name: user.name,
          // Add other user data as needed
        },
      },
      { status: 200 }
    );

    // Set HTTP-only cookie for security
    response.cookies.set("mutant_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Placeholder function - replace with your actual credential validation
async function validateCredentials(
  email: string,
  password: string
): Promise<boolean> {
  // TODO: Replace with your actual authentication logic
  // This could be:
  // - Database query
  // - External API call
  // - JWT verification
  // - etc.

  // For demo purposes, accept any email/password combination
  // In production, you should validate against your user database
  return email && password && email.length > 0 && password.length > 0;
}

// Placeholder function - replace with your actual user data retrieval
async function getUserData(email: string): Promise<{
  id: string;
  name: string;
  role: string;
}> {
  // TODO: Replace with your actual user data retrieval logic
  // This could be:
  // - Database query
  // - External API call
  // - etc.

  // For demo purposes, return mock user data
  // In production, you should fetch from your user database
  const mockUsers = {
    "admin@mutant.com": { id: "1", name: "Admin User", role: "admin" },
    "instructor@mutant.com": {
      id: "2",
      name: "Instructor User",
      role: "instructor",
    },
    "student@mutant.com": { id: "3", name: "Student User", role: "student" },
    "affiliate@mutant.com": {
      id: "4",
      name: "Affiliate User",
      role: "affiliate",
    },
  };

  // Return user data or default to admin if not found
  return (
    mockUsers[email as keyof typeof mockUsers] || {
      id: "1",
      name: "Admin User",
      role: "admin",
    }
  );
}

// Placeholder function - replace with your actual token generation
function generateToken(email: string): string {
  // TODO: Replace with your actual token generation logic
  // This could be:
  // - JWT token
  // - Session token
  // - etc.

  // For demo purposes, generate a simple token
  return `mutant_admin_${email}_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
}
