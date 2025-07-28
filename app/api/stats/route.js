import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "@/app/lib/auth";
import PuffLog from "@/app/models/puffLog";
import { connectMongoDb } from "@/app/lib/mongodb";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await connectMongoDb();

    const userId = session.user.id;
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get 7-day puff counts
    const weeklyStats = await PuffLog.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalPuffs: { $sum: "$count" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get monthly total
    const monthlyTotal = await PuffLog.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$count" }
        }
      }
    ]);

    // Calculate weekly total and average
    const weeklyTotal = weeklyStats.reduce((sum, day) => sum + day.totalPuffs, 0);
    const weeklyAverage = weeklyStats.length > 0 ? weeklyTotal / weeklyStats.length : 0;

    // Calculate streak (consecutive days with goal hit)
    const streak = await calculateStreak(userId);

    // Format 7-day data to include all days
    const formattedWeeklyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = weeklyStats.find(day => day._id === dateStr);
      formattedWeeklyStats.push({
        date: dateStr,
        puffs: dayData ? dayData.totalPuffs : 0
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        weeklyStats: formattedWeeklyStats,
        weeklyTotal,
        weeklyAverage: Math.round(weeklyAverage * 100) / 100,
        monthlyTotal: monthlyTotal[0]?.total || 0,
        streak,
        lastUpdated: now
      }
    }), { status: 200 });

  } catch (error) {
    console.error("GET /api/stats error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// Helper function to calculate streak
async function calculateStreak(userId) {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Get daily totals for the last 30 days
    const dailyTotals = await PuffLog.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalPuffs: { $sum: "$count" }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    let streak = 0;
    let currentDate = startOfToday;

    for (const day of dailyTotals) {
      const dayDate = new Date(day._id);
      const dayDiff = Math.floor((currentDate - dayDate) / (24 * 60 * 60 * 1000));
      
      if (dayDiff === 0) {
        // Today
        if (day.totalPuffs > 0) {
          streak++;
          currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
        } else {
          break;
        }
      } else if (dayDiff === 1) {
        // Yesterday
        if (day.totalPuffs > 0) {
          streak++;
          currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
        } else {
          break;
        }
      } else {
        // Gap in days, break streak
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error("Streak calculation error:", error);
    return 0;
  }
} 