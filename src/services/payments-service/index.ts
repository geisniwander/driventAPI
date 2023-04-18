import { notFoundError, unauthorizedError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentsRepository from '@/repositories/payments-repository';
import { FindPaymentsType, PaymentTypeParams } from '@/protocols';

async function findPayments({ userId, ticketId }: FindPaymentsType) {
  const ticket = await ticketRepository.findById(ticketId);

  if (!ticket) throw notFoundError();

  const enrollment = await enrollmentRepository.findById(ticket.enrollmentId);

  if (!enrollment) throw notFoundError();

  if (enrollment.userId !== userId) throw unauthorizedError();

  return await paymentsRepository.find();
}

async function createPayment({ paymentData, userId }: PaymentTypeParams) {
  const { ticketId, cardData } = paymentData;

  const ticket = await ticketRepository.findById(ticketId);

  if (!ticket) throw notFoundError();

  const type = await ticketRepository.findTypeById(ticket.ticketTypeId);

  const enrollment = await enrollmentRepository.findById(ticket.enrollmentId);

  if (!enrollment) throw notFoundError();

  if (enrollment.userId !== userId) throw unauthorizedError();

  await ticketRepository.updateById(ticketId);

  return await paymentsRepository.create({ ticketId, cardData, value: type.price });
}

const paymentsService = {
  findPayments,
  createPayment,
};

export default paymentsService;
