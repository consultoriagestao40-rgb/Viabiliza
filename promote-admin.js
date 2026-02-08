const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log('Current users:', users);

    if (users.length > 0) {
        const userToPromote = users.find(u => u.email.includes('cristiano')) || users[0];
        console.log(`Promoting user ${userToPromote.email} to ADMIN...`);

        await prisma.user.update({
            where: { id: userToPromote.id },
            data: { role: 'ADMIN' }
        });
        console.log('User promoted successfully.');
    } else {
        console.log('No users found.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
