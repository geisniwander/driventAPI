import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { findHotels, findHotelsWithRooms } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', findHotels).get('/:hotelId', findHotelsWithRooms);

export { hotelsRouter };
