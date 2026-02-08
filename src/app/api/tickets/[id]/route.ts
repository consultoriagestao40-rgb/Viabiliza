import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { status, scheduledDate, value, technicianId, review, rating } = body;

        const data: any = {};
        if (status) data.status = status;
        if (value) data.value = parseFloat(value);
        if (technicianId !== undefined) data.technicianId = technicianId;
        if (review) data.review = review;
        if (rating) data.rating = parseInt(rating);
        if (scheduledDate) {
            data.scheduledDate = new Date(scheduledDate);
            data.status = 'SCHEDULED';
        }

        // If completing and has value, create transaction
        if (status === 'COMPLETED' && value) {
            console.log("Completing ticket with value:", value);
            // Fetch ticket with user to get contact info
            const ticket = await prisma.ticket.findUnique({
                where: { id },
                include: { user: true }
            });

            if (ticket) {
                // 1. Create Transaction
                try {
                    const transaction = await prisma.transaction.create({
                        data: {
                            description: `Serviço Chamado #${ticket.id.slice(-4)}`,
                            category: 'Serviço',
                            amount: parseFloat(value),
                            type: 'IN',
                            status: 'PAID',
                            date: new Date(),
                            ticketId: ticket.id
                        }
                    });
                    console.log("Transaction created:", transaction);
                } catch (e) {
                    console.error("Failed to create transaction:", e);
                }

                // 2. Send Notifications (Mock)
                const ratingLink = `http://localhost:3000/chamados/${ticket.id}`;
                const message = `Olá ${ticket.user.name}, seu serviço foi concluído! Por favor, avalie o atendimento no link: ${ratingLink}`;

                console.log("---------------------------------------------------");
                console.log(`[EMAIL DISPATCH] To: ${ticket.user.email}`);
                console.log(`[EMAIL BODY] ${message}`);
                console.log("---------------------------------------------------");

                if (ticket.user.phone) {
                    console.log(`[WHATSAPP DISPATCH] To: ${ticket.user.phone}`);
                    console.log(`[WHATSAPP BODY] ${message}`);
                    console.log("---------------------------------------------------");
                } else {
                    console.log("[WHATSAPP SKIPPED] User has no phone registered.");
                }
            }
        }

        const ticket = await prisma.ticket.update({
            where: { id },
            data
        });

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("Error updating ticket:", error);
        return NextResponse.json({ error: "Error updating ticket" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.ticket.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Error deleting ticket" }, { status: 500 });
    }
}
