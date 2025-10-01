import { NextRequest, NextResponse } from "next/server";

interface Mission {
  _id: string;
  title: string;
  description: string;
  isPublished: boolean;
  status: string;
  price: number;
  isFree: boolean;
  category: string;
  skillLevel: string;
  duration: number;
  thumbnail?: {
    url: string;
    key: string;
  };
  instructor: string;
  levels: Array<{
    name: string;
    title: string;
    description: string;
  }>;
  reviews: Array<{
    rating: number;
    comment: string;
  }>;
  averageRating: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
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

    // Fetch real data from backend
    const missions = await getMissionsFromBackend(token);

    return NextResponse.json({
      success: true,
      data: missions,
      total: missions.length,
      message: "Missions retrieved successfully",
    });
  } catch (error) {
    console.error("Get missions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getMissionsFromBackend(token: string) {
  try {
    console.log("=== CALLING REAL BACKEND API ===");
    console.log(
      "URL: https://themutantschool-backend.onrender.com/api/admin/missions"
    );
    console.log("Token:", token);

    const response = await fetch(
      "https://themutantschool-backend.onrender.com/api/admin/missions",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

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
    console.log("Missions from backend:", data);
    console.log("Missions data type:", typeof data);
    console.log("Missions data keys:", Object.keys(data));
    if (data.data) {
      console.log("Missions data.data:", data.data);
      console.log("Missions data.data type:", typeof data.data);
      console.log("Missions data.data is array:", Array.isArray(data.data));
      if (Array.isArray(data.data)) {
        console.log("Missions count:", data.data.length);
        console.log("First mission:", data.data[0]);
        console.log(
          "Published missions:",
          data.data.filter((mission: Mission) => mission.isPublished).length
        );
        console.log(
          "Draft missions:",
          data.data.filter((mission: Mission) => !mission.isPublished).length
        );
      }
    }
    console.log("=========================");

    return data;
  } catch (error) {
    console.error("Error calling backend API:", error);
    throw error;
  }
}
