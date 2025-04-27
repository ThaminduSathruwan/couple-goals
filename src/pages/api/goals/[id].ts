import { NextApiRequest, NextApiResponse } from 'next';
import { authenticate } from '@/utils/auth'; // Import the authentication middleware
import prisma from '@/lib/prisma'; // Make sure Prisma is correctly set up

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        authenticate(req, res, async () => { // Protect this route with the authenticate middleware
            const { id } = req.query; // Get the goal ID from the query parameter

            if (!id) {
                return res.status(400).json({ message: 'Goal ID is required' });
            }

            try {
                const goal = await prisma.goal.findUnique({
                    where: { id: parseInt(id as string, 10) },
                });

                if (!goal) {
                    return res.status(404).json({ message: 'Goal not found' });
                }

                return res.status(200).json(goal);
            } catch (error) {
                return res.status(500).json({ message: 'Failed to fetch goal' });
            }
        });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
