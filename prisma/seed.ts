import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
     const adminEmail = 'admin@gmail.com';
     const adminPassword = 'AdminPassword';

       const admin = await prisma.admin.findUnique({
         where: { email: adminEmail },
       });

       if (admin) {
         console.log('Admin already exists.');
         return;
       }

       await prisma.admin.create({
         data: {
           email: adminEmail,
           password: await bcrypt.hash(adminPassword, 10),
         },
       });
        
    console.log(`Admin created`);
}

 main()
    .catch((error) => {
           console.error(error);
           process.exit(1);
    })
    .finally(async () => {
         await prisma.$disconnect();
    });