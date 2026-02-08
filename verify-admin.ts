
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'cristiano.godoi@hotmail.com';
    const passwordRaw = 'Cs08501752*36';

    console.log(`🔍 Verifying user: ${email}`);

    // 1. Check if user exists
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.error('❌ User NOT FOUND in database!');
        return;
    }

    console.log('✅ User FOUND in database.');
    console.log(`   ID: ${user.id}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password Hash: ${user.password?.substring(0, 10)}...`);

    // 2. Check password
    if (!user.password) {
        console.error('❌ User has NO PASSWORD set!');
        return;
    }

    const isValid = await bcrypt.compare(passwordRaw, user.password);

    if (isValid) {
        console.log('✅ Password matches! Login SHOULD be working.');
    } else {
        console.error('❌ Password DOES NOT MATCH hash!');

        // Debugging: Hash the password again to see what it should look like (first few chars)
        const newHash = await bcrypt.hash(passwordRaw, 10);
        console.log(`   Expected something like: ${newHash.substring(0, 10)}...`);
    }
}

main()
    .catch((e) => {
        console.error('Error verifying user:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
