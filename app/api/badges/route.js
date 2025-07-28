import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]";
import Badge from "@/app/models/badge";
import { connectMongoDb } from "@/app/lib/mongodb";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await connectMongoDb();

    const badges = await Badge.find({ userId: session.user.id })
      .sort({ unlockedAt: -1 });

    return new Response(JSON.stringify({
      success: true,
      data: badges
    }), { status: 200 });

  } catch (error) {
    console.error("GET /api/badges error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 