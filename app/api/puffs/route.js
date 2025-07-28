import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "@/app/lib/auth";
import PuffLog from "@/app/models/puffLog";
import Badge from "@/app/models/badge";
import { connectMongoDb } from "@/app/lib/mongodb";

// POST - Add a new puff
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { count = 1, trigger = 'other' } = await req.json();

    if (!count || count < 1) {
      return new Response(JSON.stringify({ error: "Invalid count" }), { status: 400 });
    }

    await connectMongoDb();

    // Create new puff log
    const puffLog = await PuffLog.create({
      userId: session.user.id,
      count,
      trigger,
      date: new Date(),
    });

    // Check for achievements
    await checkAndAwardBadges(session.user.id);

    return new Response(JSON.stringify({ success: true, puffLog }), { status: 201 });
  } catch (error) {
    console.error("POST /api/puffs error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// DELETE - Remove most recent puff for today
export async function DELETE(req) {
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

    // Find and delete the most recent puff for today
    const deletedPuff = await PuffLog.findOneAndDelete({
      userId: session.user.id,
      date: { $gte: startOfDay, $lt: endOfDay }
    }).sort({ createdAt: -1 });

    if (!deletedPuff) {
      return new Response(JSON.stringify({ error: "No puffs found for today" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, deletedPuff }), { status: 200 });
  } catch (error) {
    console.error("DELETE /api/puffs error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// Helper function to check and award badges
async function checkAndAwardBadges(userId) {
  try {
    // Check for first puff badge
    const totalPuffs = await PuffLog.countDocuments({ userId });
    if (totalPuffs === 1) {
      await Badge.findOneAndUpdate(
        { userId, type: 'first_puff' },
        {
          userId,
          type: 'first_puff',
          description: 'First puff tracked!',
          icon: '🎯'
        },
        { upsert: true }
      );
    }

    // Check for 3-day streak
    const last3Days = await PuffLog.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } } } },
      { $sort: { _id: -1 } },
      { $limit: 3 }
    ]);

    if (last3Days.length === 3) {
      await Badge.findOneAndUpdate(
        { userId, type: 'three_day_streak' },
        {
          userId,
          type: 'three_day_streak',
          description: '3 days tracked in a row!',
          icon: '🔥'
        },
        { upsert: true }
      );
    }

    // Check for goal hit 3 days (simplified - you might want to add goal checking logic)
    // This would require checking against the user's daily goal

  } catch (error) {
    console.error("Badge check error:", error);
  }
} 