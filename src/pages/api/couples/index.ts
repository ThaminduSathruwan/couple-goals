// pages/api/couples/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // Create a new couple
        const { partnerOneId, partnerTwoId } = req.body;
        try {
            const couple = await prisma.couple.create({
                data: {
                    partnerOne: {
                        connect: { id: partnerOneId },
                    },
                    partnerTwo: {
                        connect: { id: partnerTwoId },
                    },
                },
            });
            return res.status(201).json(couple);
        } catch (error) {
            return res.status(500).json({ error: 'Error creating couple' });
        }
    }

    if (req.method === 'GET') {
        // Fetch all couples or a specific couple by ID
        const { id } = req.query;
        try {
            const couple = id
                ? await prisma.couple.findUnique({ where: { id: Number(id) } })
                : await prisma.couple.findMany();
            return res.status(200).json(couple);
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching couples' });
        }
    }
}
