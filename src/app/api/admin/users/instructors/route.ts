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

    // TODO: Validate the token with your backend
    // For now, we'll just check if it exists
    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // TODO: Replace with your actual backend API call
    // This is a placeholder - you should call your backend API
    const instructors = await getInstructorsFromBackend();

    return NextResponse.json({
      success: true,
      data: instructors,
      total: instructors.length,
      message: "Instructors retrieved successfully",
    });
  } catch (error) {
    console.error("Get instructors error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Placeholder function - replace with your actual backend API call
async function getInstructorsFromBackend() {
  // TODO: Replace with your actual backend API call
  // This could be:
  // - Direct database query
  // - External API call to your backend
  // - etc.

  // For demo purposes, return mock data
  // In production, you should fetch from your backend
  return [
    {
      _id: "1",
      firstName: "Abdulrahman",
      lastName: "Raian",
      email: "abdulrahman.raian@example.com",
      username: "abdulrahman_raian",
      role: "instructor",
      status: "active",
      joinDate: "2023-12-01T09:00:00Z",
      lastLogin: "2024-01-20T16:30:00Z",
      profile: {
        avatar: null,
        phone: "+1234567800",
        country: "Egypt",
        city: "Cairo",
        bio: "Senior Full-Stack Developer with 8+ years of experience in JavaScript, React, Node.js, and Python.",
        specialties: [
          "JavaScript",
          "React",
          "Node.js",
          "Python",
          "Web Development",
        ],
        socialLinks: {
          linkedin: "https://linkedin.com/in/abdulrahman-raian",
          github: "https://github.com/abdulrahman-raian",
          twitter: "https://twitter.com/abdulrahman_raian",
        },
      },
      stats: {
        totalMissions: 8,
        activeMissions: 6,
        completedMissions: 2,
        totalStudents: 245,
        averageRating: 4.8,
        totalReviews: 89,
      },
      earnings: {
        totalEarnings: 12500,
        monthlyEarnings: 2100,
        currency: "USD",
      },
      subscription: {
        type: "Premium",
        status: "active",
        expiresAt: "2024-12-31T23:59:59Z",
      },
    },
    {
      _id: "2",
      firstName: "Shadia",
      lastName: "Mohammed",
      email: "shadia.mohammed@example.com",
      username: "shadia_mohammed",
      role: "instructor",
      status: "active",
      joinDate: "2023-11-15T10:30:00Z",
      lastLogin: "2024-01-19T14:20:00Z",
      profile: {
        avatar: null,
        phone: "+1234567801",
        country: "Saudi Arabia",
        city: "Riyadh",
        bio: "UI/UX Designer and Frontend Developer specializing in modern design systems and user experience.",
        specialties: [
          "UI/UX Design",
          "Figma",
          "Adobe Creative Suite",
          "CSS",
          "Design Systems",
        ],
        socialLinks: {
          linkedin: "https://linkedin.com/in/shadia-mohammed",
          behance: "https://behance.net/shadia-mohammed",
          dribbble: "https://dribbble.com/shadia-mohammed",
        },
      },
      stats: {
        totalMissions: 5,
        activeMissions: 4,
        completedMissions: 1,
        totalStudents: 180,
        averageRating: 4.9,
        totalReviews: 67,
      },
      earnings: {
        totalEarnings: 8900,
        monthlyEarnings: 1650,
        currency: "USD",
      },
      subscription: {
        type: "Premium",
        status: "active",
        expiresAt: "2024-12-31T23:59:59Z",
      },
    },
    {
      _id: "3",
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed.hassan@example.com",
      username: "ahmed_hassan",
      role: "instructor",
      status: "inactive",
      joinDate: "2023-10-20T08:45:00Z",
      lastLogin: "2024-01-15T11:10:00Z",
      profile: {
        avatar: null,
        phone: "+1234567802",
        country: "UAE",
        city: "Dubai",
        bio: "Mobile App Developer and Flutter expert with extensive experience in cross-platform development.",
        specialties: [
          "Flutter",
          "Dart",
          "Mobile Development",
          "Firebase",
          "API Integration",
        ],
        socialLinks: {
          linkedin: "https://linkedin.com/in/ahmed-hassan",
          github: "https://github.com/ahmed-hassan",
          medium: "https://medium.com/@ahmed-hassan",
        },
      },
      stats: {
        totalMissions: 3,
        activeMissions: 1,
        completedMissions: 2,
        totalStudents: 95,
        averageRating: 4.6,
        totalReviews: 34,
      },
      earnings: {
        totalEarnings: 4200,
        monthlyEarnings: 0,
        currency: "USD",
      },
      subscription: {
        type: "Basic",
        status: "inactive",
        expiresAt: "2024-01-10T23:59:59Z",
      },
    },
    {
      _id: "4",
      firstName: "Fatima",
      lastName: "Ali",
      email: "fatima.ali@example.com",
      username: "fatima_ali",
      role: "instructor",
      status: "active",
      joinDate: "2023-09-10T12:00:00Z",
      lastLogin: "2024-01-20T09:45:00Z",
      profile: {
        avatar: null,
        phone: "+1234567803",
        country: "Jordan",
        city: "Amman",
        bio: "Data Science and Machine Learning expert with a passion for teaching AI and analytics.",
        specialties: [
          "Python",
          "Machine Learning",
          "Data Science",
          "TensorFlow",
          "Pandas",
          "NumPy",
        ],
        socialLinks: {
          linkedin: "https://linkedin.com/in/fatima-ali",
          github: "https://github.com/fatima-ali",
          kaggle: "https://kaggle.com/fatima-ali",
        },
      },
      stats: {
        totalMissions: 6,
        activeMissions: 5,
        completedMissions: 1,
        totalStudents: 320,
        averageRating: 4.7,
        totalReviews: 112,
      },
      earnings: {
        totalEarnings: 15200,
        monthlyEarnings: 2800,
        currency: "USD",
      },
      subscription: {
        type: "Premium",
        status: "active",
        expiresAt: "2024-12-31T23:59:59Z",
      },
    },
    {
      _id: "5",
      firstName: "Omar",
      lastName: "Mahmoud",
      email: "omar.mahmoud@example.com",
      username: "omar_mahmoud",
      role: "instructor",
      status: "active",
      joinDate: "2024-01-05T14:20:00Z",
      lastLogin: "2024-01-20T13:15:00Z",
      profile: {
        avatar: null,
        phone: "+1234567804",
        country: "Kuwait",
        city: "Kuwait City",
        bio: "DevOps Engineer and Cloud Computing specialist focused on scalable infrastructure and automation.",
        specialties: [
          "AWS",
          "Docker",
          "Kubernetes",
          "CI/CD",
          "Linux",
          "Terraform",
        ],
        socialLinks: {
          linkedin: "https://linkedin.com/in/omar-mahmoud",
          github: "https://github.com/omar-mahmoud",
          dev: "https://dev.to/omar-mahmoud",
        },
      },
      stats: {
        totalMissions: 2,
        activeMissions: 2,
        completedMissions: 0,
        totalStudents: 45,
        averageRating: 4.5,
        totalReviews: 18,
      },
      earnings: {
        totalEarnings: 1800,
        monthlyEarnings: 900,
        currency: "USD",
      },
      subscription: {
        type: "Basic",
        status: "active",
        expiresAt: "2024-06-30T23:59:59Z",
      },
    },
  ];
}
