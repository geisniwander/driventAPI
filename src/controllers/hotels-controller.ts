import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest, handleApplicationErrors } from '@/middlewares';
import hotelService from '@/services/hotels-service';
import { UserIdRequest } from '@/protocols';
import { notFoundError } from '@/errors';

export async function findHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req as UserIdRequest;

  try {
    const hotels = await hotelService.findHotels(userId);

    if (!hotels || hotels.length <= 0) {
      throw notFoundError();
    }

    return res.status(httpStatus.OK).send(hotels);
  } catch (err) {
    return handleApplicationErrors(err, req, res, next);
  }
}

export async function findHotelsWithRooms(req: AuthenticatedRequest, res: Response) {
  try {
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}
