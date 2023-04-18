import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest, handleApplicationErrors } from '@/middlewares';
import enrollmentsService from '@/services/enrollments-service';

export async function getEnrollmentByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const adress = await enrollmentsService.getAddressByUserId(userId);

    return res.status(httpStatus.OK).send(adress);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function postCreateOrUpdateEnrollment(req: AuthenticatedRequest, res: Response) {
  try {
    await enrollmentsService.createOrUpdateEnrollmentWithAddress({
      ...req.body,
      userId: req.userId,
    });

    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getAddressFromCEP(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { cep } = req.query as Record<string, string>;

  if (!cep) {
    return res.status(httpStatus.NO_CONTENT).send('CEP inválido');
  }

  try {
    const address = await enrollmentsService.getAddressFromCEP(cep);
    res.status(httpStatus.OK).send(address);
  } catch (err) {
    return handleApplicationErrors(err, req, res, next);
  }
}
