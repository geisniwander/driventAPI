import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest, handleApplicationErrors } from '@/middlewares';
import paymentsService from '@/services/payments-service';
import { badRequestError } from '@/errors';
import { PaymentParams, UserIdRequest } from '@/protocols';

export async function findPayments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req as UserIdRequest;
  const ticketId = Number(req.query.ticketId);

  try {
    if (!ticketId) throw badRequestError();

    const [payments] = await paymentsService.findPayments({ userId, ticketId });

    return res.status(httpStatus.OK).send(payments);
  } catch (err) {
    return handleApplicationErrors(err, req, res, next);
  }
}

export async function createPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const paymentData = req.body as PaymentParams;
  const { userId } = req as UserIdRequest;

  try {
    const payment = await paymentsService.createPayment({ paymentData, userId });

    return res.status(httpStatus.OK).send(payment);
  } catch (err) {
    return handleApplicationErrors(err, req, res, next);
  }
}
