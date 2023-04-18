import { prisma } from '@/config';

async function find() {
  return await prisma.ticket.findMany({
    include: {
      TicketType: true,
    },
  });
}

async function findById(ticketId: number) {
  return await prisma.ticket.findFirst({ where: { id: ticketId } });
}

async function findTypes() {
  return await prisma.ticketType.findMany();
}

async function findTypeById(ticketTypeId: number) {
  return await prisma.ticketType.findFirst({ where: { id: ticketTypeId } });
}

type CreateTicketType = { ticketTypeId: number; enrollmentId: number };

async function create(ticket: CreateTicketType) {
  return await prisma.ticket.create({
    data: {
      ...ticket,
      status: 'RESERVED',
    },
  });
}

async function updateById(ticketId: number) {
  return await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: 'PAID',
    },
  });
}

const ticketRepository = {
  find,
  findById,
  findTypes,
  findTypeById,
  create,
  updateById,
};

export default ticketRepository;
