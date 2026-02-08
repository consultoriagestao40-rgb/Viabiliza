import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: { date: 'desc' }
        });
        return NextResponse.json(transactions);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching transactions" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Finance POST body:", body);
        const { description, category, amount, type, status, date } = body;

        const transaction = await prisma.transaction.create({
            data: {
                description,
                category,
                amount: parseFloat(amount),
                type,
                status,
                date: new Date(date)
            }
        });
        console.log("Transaction created:", transaction);

        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        console.error("Finance create error:", error);
        return NextResponse.json({ error: "Error creating transaction" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, ...data } = body;
        const transaction = await prisma.transaction.update({
            where: { id },
            data
        });
        return NextResponse.json(transaction);
    } catch (error) {
        return NextResponse.json({ error: "Error updating transaction" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await prisma.transaction.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Error deleting transaction" }, { status: 500 });
    }
}
