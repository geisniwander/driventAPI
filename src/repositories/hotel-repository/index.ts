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
const hotelRepository = {
  find,
  findHotelsWithRooms,
};

export default hotelRepository;
