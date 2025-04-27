import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Import Prisma client
import { authenticate } from '@/utils/auth'; // Import authenticate middleware

// Handle GET request to fetch goals for authenticated users
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const userId = req.user?.id; // User info added by authenticate middleware

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const goals = await prisma.goal.findMany({
                where: {
                    createdById: userId, // Fetch goals for the authenticated user
                },
            });

            return res.status(200).json(goals);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to fetch goals' });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
};

// Apply the authenticate middleware to protect the route
export default (req: NextApiRequest, res: NextApiResponse) => {
    authenticate(req, res, () => handler(req, res));
};
