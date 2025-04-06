// app/api/user/update/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // make sure your db client is set up here

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name, username, email, image } = body;
    console.log("Received data:", body);
    if (!id || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        name,
        username,
        email,
        image,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
