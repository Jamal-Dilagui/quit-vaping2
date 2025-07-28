import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]";
import Goal from "@/app/models/goal";
import { connectMongoDb } from "@/app/lib/mongodb";

// GET - Get current goal
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await connectMongoDb();

    const goal = await Goal.findOne({ userId: session.user.id, isActive: true });

    return new Response(JSON.stringify({
      success: true,
      data: goal || null
    }), { status: 200 });

  } catch (error) {
    console.error("GET /api/goal error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// POST - Create or update goal
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { type = "daily", targetPuffs } = await req.json();

    if (targetPuffs === undefined || targetPuffs < 0) {
      return new Response(JSON.stringify({ error: "Invalid target puffs" }), { status: 400 });
    }

    if (!["daily", "weekly", "monthly"].includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid goal type" }), { status: 400 });
    }

    await connectMongoDb();

    // Deactivate any existing active goals
    await Goal.updateMany(
      { userId: session.user.id, isActive: true },
      { isActive: false }
    );

    // Create new goal
    const goal = await Goal.create({
      userId: session.user.id,
      type,
      targetPuffs,
      isActive: true
    });

    return new Response(JSON.stringify({
      success: true,
      data: goal
    }), { status: 201 });

  } catch (error) {
    console.error("POST /api/goal error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 