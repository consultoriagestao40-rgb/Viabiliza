import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth"; // Assuming authOptions is exported
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { serviceType, description, location, urgency, scheduledDate } = await req.json();

        if (!serviceType || !description || !location) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const ticket = await prisma.ticket.create({
            data: {
                userId: session.user.id,
                serviceType,
                description,
                location,
                urgency,
                scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
                status: "OPEN"
            },
        });

        return NextResponse.json(
            { message: "Ticket created successfully", ticket },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create ticket error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
