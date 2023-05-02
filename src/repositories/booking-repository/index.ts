import { prisma } from '@/config';

async function find(userId: number) {
  return await prisma.booking.findFirst({
    where: { userId: userId },
    include: {
      Room: true,
    },
  });
}

async function findById(bookingId: number) {
  return await prisma.booking.findUnique({ where: { id: bookingId } });
}

async function putBooking(bookingId: number, roomId: number) {
  return await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId: roomId,
    },
  });
}

async function countBookingsByRoomId(roomId: number) {
  const result = await prisma.booking.count({
    where: {
      roomId: roomId,
    },
  });
  return result;
}

async function create(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
}

const bookingRepository = {
  find,
  putBooking,
  findById,
  countBookingsByRoomId,
  create,
};

export default bookingRepository;
