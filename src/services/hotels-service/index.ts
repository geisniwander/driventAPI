import { notFoundError, paymentError } from '@/errors';
import { HotelRooms } from '@/protocols';
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

  const hotel = await hotelRepository.find();
  if (!hotel) throw notFoundError();

  return hotel;
}

async function findHotelsWithRooms({ userId, hotelId }: HotelRooms) {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status !== 'PAID') throw paymentError();

  const ticketType = await ticketRepository.findTypeById(ticket.ticketTypeId);
  if (ticketType.isRemote || !ticketType.includesHotel) throw paymentError();

  const hotelWithRooms = await hotelRepository.findHotelsWithRooms(hotelId);
  if (!hotelWithRooms) throw notFoundError();

  return hotelWithRooms;
}

const hotelService = {
  findHotels,
  findHotelsWithRooms,
};

export default hotelService;
