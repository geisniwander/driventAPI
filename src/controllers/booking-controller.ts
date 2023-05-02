import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest, handleApplicationErrors } from '@/middlewares';
import { UserIdRequest } from '@/protocols';
import { notFoundError } from '@/errors';
import bookingService from '@/services/booking-service';

export async function findBookings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req as UserIdRequest;

  try {
    const booking = await bookingService.findBookings(userId);

    return res.status(httpStatus.OK).send({ id: booking.id, Room: booking.Room });
  } catch (err) {
    return handleApplicationErrors(err, req, res, next);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req as UserIdRequest;
  const roomId = Number(req.body.roomId);

  try {
    const booking = await bookingService.createBooking({ userId, roomId });

    return res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (err) {
    return handleApplicationErrors(err, req, res, next);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req as UserIdRequest;
  const bookingId = Number(req.params.bookingId);
  const roomId = Number(req.body.roomId);

  try {
    const booking = await bookingService.putBooking({ userId, bookingId, roomId });

    if (!booking) {
      throw notFoundError();
    }

    return res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (err) {
    return handleApplicationErrors(err, req, res, next);
  }
}
