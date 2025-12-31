
import { auth } from "@/auth";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { avatarUrl } = await req.json();

        if (!avatarUrl) {
            return NextResponse.json({ message: "Avatar URL is required" }, { status: 400 });
        }

        // Update database
        await query(
            'UPDATE users SET image = $1 WHERE id = $2',
            [avatarUrl, session.user.id]
        );

        return NextResponse.json({ message: "Update success" });
    } catch (error) {
        console.error("Error updating avatar:", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
