import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        console.log("Register API call started");
        const body = await req.json();
        console.log("Request body parsed:", { ...body, password: "***" });

        const { name, email, password, role, specialty, phone } = body;

        if (!email || !password) {
            console.log("Missing fields");
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        console.log("Checking for existing user...");
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        console.log("Existing user check complete:", !!existingUser);

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed");

        console.log("Creating user in DB...");
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "USER",
                specialty: specialty || null,
                phone: phone || null
            },
        });
        console.log("User created:", user.id);

        return NextResponse.json(
            { message: "User created successfully", user: { id: user.id, email: user.email } },
            { status: 201 }
        );
    } catch (error) {
        console.error("CRITICAL REGISTRATION ERROR:", error);
        return NextResponse.json(
            { message: "Internal server error: " + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}
