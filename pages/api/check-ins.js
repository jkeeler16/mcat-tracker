import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { name, date } = req.query;
      
      // Build filter criteria
      const where = {};
      
      if (name) {
        where.name = name;
      }
      
      if (date) {
        // Parse date range or specific date
        if (date.includes(',')) {
          const [start, end] = date.split(',');
          where.date = {
            gte: new Date(start),
            lte: new Date(end),
          };
        } else {
          const queryDate = new Date(date);
          const nextDay = new Date(queryDate);
          nextDay.setDate(nextDay.getDate() + 1);
          
          where.date = {
            gte: queryDate,
            lt: nextDay,
          };
        }
      }
      
      // Fetch check-ins, sort by date descending
      const checkIns = await prisma.checkIn.findMany({
        where,
        orderBy: {
          date: 'desc',
        },
      });
      
      res.status(200).json(checkIns);
    } catch (error) {
      console.error('Error fetching check-ins:', error);
      res.status(500).json({ message: 'Failed to fetch check-ins' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 