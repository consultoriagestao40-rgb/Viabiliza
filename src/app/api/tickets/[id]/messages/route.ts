import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const messages = await prisma.message.findMany({
            where: { ticketId: params.id },
            orderBy: { createdAt: 'asc' },
            include: { sender: { select: { name: true, role: true } } }
        });

        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: "Fetch Error" }, { status: 500 });
    }
}

export async function POST(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { content } = body;

        const message = await prisma.message.create({
            data: {
                content,
                ticketId: params.id,
                senderId: session.user.id,
                senderType: 'USER' // Can differentiate ADMIN/TECHNICIAN if needed
            },
            include: { sender: { select: { name: true } } }
        });

        return NextResponse.json(message);
    } catch (error) {
        return NextResponse.json({ error: "Send Error" }, { status: 500 });
    }
}
