
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'cristiano.godoi@hotmail.com';
    const passwordRaw = 'Cs08501752*36';

    console.log(`Hashing password for ${email}...`);
    const hashedPassword = await bcrypt.hash(passwordRaw, 10);

    console.log('Upserting user...');
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

    console.log('✅ Super Admin user successfully configured:');
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
}

main()
    .catch((e) => {
        console.error('Error creating admin:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
