import { prisma } from '@/config';

async function find() {
  return await prisma.hotel.findMany();
}

async function findHotelsWithRooms(hotelId: number) {
  return await prisma.hotel.findUnique({
    where: { id: hotelId },
    include: {
      Rooms: true,
    },
  });
}
async function findRoom(roomId: number) {
  return await prisma.room.findUnique({ where: { id: roomId } });
}
const hotelRepository = {
  find,
  findHotelsWithRooms,
  findRoom,
};

export default hotelRepository;
