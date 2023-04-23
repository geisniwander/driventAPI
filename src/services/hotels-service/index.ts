import { notFoundError, paymentError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotel-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function findHotels(userId: number) {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status !== 'PAID') throw paymentError();

  const ticketType = await ticketRepository.findTypeById(ticket.ticketTypeId);
  if (ticketType.isRemote || !ticketType.includesHotel) throw paymentError();

  const result = await hotelRepository.find();
  if (!result) throw notFoundError();

  return result;
}

const hotelService = {
  findHotels,
};

export default hotelService;
