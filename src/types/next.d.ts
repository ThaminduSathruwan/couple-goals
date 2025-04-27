// types/next.d.ts

import { User } from '@prisma/client'; // Adjust this if needed, depending on your User model type
import { NextApiRequest } from 'next';

declare module 'next' {
    interface NextApiRequest {
        user?: User; // You can use the correct User type based on your Prisma model
    }
}