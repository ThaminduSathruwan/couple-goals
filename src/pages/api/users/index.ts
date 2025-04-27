// pages/api/users/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // assuming you have a prisma.ts file for client setup

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // Create a new user
        const { email, password } = req.body;
        try {
            const user = await prisma.user.create({
                data: {
                    email,
                    password, // You may want to hash this password before saving
                },
            });
            return res.status(201).json(user);
        } catch (error) {
            return res.status(500).json({ error: 'Error creating user' });
        }
    }

    if (req.method === 'GET') {
        // Fetch all users (or a single user if specified)
        const { id } = req.query;
        try {
            const user = id
                ? await prisma.user.findUnique({ where: { id: Number(id) } })
                : await prisma.user.findMany();
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching users' });
        }
    }
}
