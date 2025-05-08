import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, questionsCompleted, questionsReviewed, takeaway } = req.body;

      // Validation
      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }

      if (typeof questionsCompleted !== 'number' || questionsCompleted < 0) {
        return res.status(400).json({ message: 'Questions completed must be a positive number' });
      }

      if (typeof questionsReviewed !== 'number' || questionsReviewed < 0) {
        return res.status(400).json({ message: 'Questions reviewed must be a positive number' });
      }

      if (!takeaway || takeaway.length < 10) {
        return res.status(400).json({ message: 'Takeaway must be at least 10 characters' });
      }

      // Create check-in in database
      const checkIn = await prisma.checkIn.create({
        data: {
          name,
          questionsCompleted,
          questionsReviewed,
          takeaway,
        },
      });

      res.status(201).json(checkIn);
    } catch (error) {
      console.error('Error creating check-in:', error);
      res.status(500).json({ message: 'Failed to create check-in' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 