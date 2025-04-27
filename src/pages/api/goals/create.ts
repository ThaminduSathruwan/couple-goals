// pages/api/goals/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticate } from '@/utils/auth'; // Import authentication middleware
import prisma from '@/lib/prisma'; // Import Prisma client

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        authenticate(req, res, async () => { // Protect this route with authenticate middleware
            const { description, category, isPrivate, coupleId } = req.body;

            // Validate that required fields are present
            if (!description || !category || !coupleId) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Check if the user is authenticated and has an id
            if (!req.user?.id) {
                return res.status(401).json({ message: 'User is not authenticated' });
            }

            try {
                const newGoal = await prisma.goal.create({
                    data: {
                        description,
                        category,
                        isPrivate,
                        coupleId,
                        createdById: req.user.id, // Safe to access as req.user.id is guaranteed to be a number now
                    },
                });

                return res.status(201).json(newGoal);
            } catch (error) {
                return res.status(500).json({ message: 'Failed to create goal' });
            }
        });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
