import { forbiddenError, noContentError, notFoundError, unauthorizedError } from '@/errors';
import { bookingRooms, putBooking } from '@/protocols';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotel-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function findBookings(userId: number) {
  const booking = await bookingRepository.find(userId);
  if (!booking) throw notFoundError();

  return booking;
}

async function putBooking({ userId, bookingId, roomId }: putBooking) {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) throw notFoundError();
  if (booking.userId !== userId) throw unauthorizedError();

  const room = await hotelRepository.findRoom(roomId);
  if (!room) throw notFoundError();

  const bookingsInARoom = await bookingRepository.countBookingsByRoomId(roomId);
  if (room.capacity === 0 || room.capacity === null || room.capacity - bookingsInARoom <= 0) throw forbiddenError();

  const bookingEdited = await bookingRepository.putBooking(bookingId, roomId);

  return bookingEdited;
}

async function createBooking({ userId, roomId }: bookingRooms) {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status !== 'PAID') throw forbiddenError();

  const ticketType = await ticketRepository.findTypeById(ticket.ticketTypeId);
  if (ticketType.isRemote || !ticketType.includesHotel) throw forbiddenError();

  const room = await hotelRepository.findRoom(roomId);
  if (!room) throw forbiddenError();

  const bookingsInARoom = await bookingRepository.countBookingsByRoomId(roomId);
  if (room.capacity === 0 || room.capacity === null || room.capacity - bookingsInARoom <= 0) throw forbiddenError();

  const booking = await bookingRepository.create(userId, roomId);
  if (!booking) throw notFoundError();

  return booking;
}

const bookingService = {
  findBookings,
  createBooking,
  putBooking,
};

export default bookingService;
