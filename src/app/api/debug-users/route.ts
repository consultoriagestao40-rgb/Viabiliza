
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const email = 'cristiano.godoi@hotmail.com';
        const passwordRaw = 'Cs08501752*36';
        const hashedPassword = await bcrypt.hash(passwordRaw, 10);

        console.log(`Hashing password for ${email}...`);

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                role: 'ADMIN',
                name: 'Cristiano Godoi (Super Admin)'
            },
            create: {
                email,
                name: 'Cristiano Godoi (Super Admin)',
                password: hashedPassword,
                role: 'ADMIN',
            },
        });

        return NextResponse.json({
            message: 'User created/updated successfully DIRECTLY in Prod!',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
