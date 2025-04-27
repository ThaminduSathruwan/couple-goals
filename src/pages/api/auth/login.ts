// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || "secret_code";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        try {
            // Find user by email
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Check if the password is correct
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Create JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email, isAdmin: user.isAdmin },
                JWT_SECRET, // Make sure to set a secret in your .env file
                { expiresIn: '1h' }
            );

            // Set JWT token in a cookie
            res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600;`);

            return res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            console.error('Error logging in user:', error);
            return res.status(500).json({ message: 'Failed to log in user' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
