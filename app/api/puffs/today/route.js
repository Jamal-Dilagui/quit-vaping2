import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]";
import PuffLog from "@/app/models/puffLog";
import { connectMongoDb } from "@/app/lib/mongodb";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await connectMongoDb();

    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Get all puffs for today
    const todayPuffs = await PuffLog.find({
      userId: session.user.id,
      date: { $gte: startOfDay, $lt: endOfDay }
    }).sort({ createdAt: -1 });

    // Calculate total count
    const totalCount = todayPuffs.reduce((sum, puff) => sum + puff.count, 0);

    // Get latest puff timestamp
    const latestPuff = todayPuffs[0];

    return new Response(JSON.stringify({
      success: true,
      data: {
        totalCount,
        latestPuff: latestPuff ? {
          timestamp: latestPuff.date,
          count: latestPuff.count,
          trigger: latestPuff.trigger
        } : null,
        puffCount: todayPuffs.length
      }
    }), { status: 200 });

  } catch (error) {
    console.error("GET /api/puffs/today error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 