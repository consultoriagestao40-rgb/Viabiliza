import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request, props: { params: Promise<{ activityId: string }> }) {
    const params = await props.params;
    try {
        const body = await req.json();
        const { done } = body;

        const activity = await prisma.ticketActivity.update({
            where: { id: params.activityId },
            data: { done }
        });

        return NextResponse.json(activity);
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
