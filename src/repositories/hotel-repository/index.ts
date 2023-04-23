import { prisma } from '@/config';

async function find() {
  return await prisma.hotel.findMany();
}

const hotelRepository = {
  find,
};

export default hotelRepository;
