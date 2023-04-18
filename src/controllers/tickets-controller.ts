import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';
import { UserIdRequest } from '@/protocols';

export async function findTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as UserIdRequest;
  try {
    const [tickets] = await ticketsService.findTickets(userId);
    if (tickets) {
      return res.status(httpStatus.OK).send(tickets);
    } else {
      throw new Error();
    }
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function findTypes(_req: AuthenticatedRequest, res: Response) {
  try {
    const types = await ticketsService.findTypes();
    return res.status(httpStatus.OK).send(types);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body;
  const { userId } = req as UserIdRequest;

  try {
    const response = await ticketsService.createTicket({ ticketTypeId, userId });
    const typeResponse = await ticketsService.getType(ticketTypeId);

    return res.status(httpStatus.CREATED).send({
      ...response,
      TicketType: { ...typeResponse },
    });
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send(error.message);
  }
}
