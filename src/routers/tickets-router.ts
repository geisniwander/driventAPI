import { Router } from 'express';
import { createTicket, findTickets, findTypes } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/', findTickets)
  .get('/types', findTypes)
  .post('/', validateBody(createTicketSchema), createTicket);

export { ticketsRouter };
