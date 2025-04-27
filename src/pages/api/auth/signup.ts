// pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password, isAdmin = false } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        try {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    isAdmin,
                },
            });

            return res.status(201).json(newUser);
        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(500).json({ message: 'Failed to register user' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
