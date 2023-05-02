import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { findBookings, putBooking, createBooking } from '@/controllers';
import { bookingRoom } from '@/schemas';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('/', findBookings)
  .put('/:bookingId', validateBody(bookingRoom), putBooking)
  .post('/', validateBody(bookingRoom), createBooking);

export { bookingsRouter };
