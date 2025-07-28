import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "@/app/lib/auth";
import User from "@/app/models/users";
import { connectMongoDb } from "@/app/lib/mongodb";

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { name, quitDate } = await req.json();

    // Validate quitDate if provided
    if (quitDate && isNaN(Date.parse(quitDate))) {
      return new Response(JSON.stringify({ error: "Invalid quit date format" }), { status: 400 });
    }

    await connectMongoDb();

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (quitDate !== undefined) updateData.quitDate = quitDate ? new Date(quitDate) : null;

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ error: "No valid fields to update" }), { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        quitDate: updatedUser.quitDate
      }
    }), { status: 200 });

  } catch (error) {
    console.error("PATCH /api/profile error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 