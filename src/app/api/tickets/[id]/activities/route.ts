import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { type, content, date } = body;

        const activity = await prisma.ticketActivity.create({
            data: {
                ticketId: params.id,
                userId: session.user.id,
                type,
                content,
                date: date ? new Date(date) : null
            }
        });

        return NextResponse.json(activity);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Creation failed" }, { status: 500 });
    }
}
