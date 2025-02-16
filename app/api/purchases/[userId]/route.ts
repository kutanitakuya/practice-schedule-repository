import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request, 
    { params }: { params: { userId: string } }
) {
    const userId = params.userId; // `await` は不要

    try {
        const purchases = await prisma.purchase.findMany({
            where: { userId },
        });

        return NextResponse.json({ purchases }, { status: 200 });
    } catch (err) {
        console.error("Error fetching purchases:", err);
        return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
    }
}