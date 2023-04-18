import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { CreateTicketType } from '@/protocols';

async function findTickets(userId: number) {
  const { id: enrollmentId } = await enrollmentRepository.findByUserId(userId);

  if (!enrollmentId) throw notFoundError();

  return await ticketRepository.find();
}

async function findTypes() {
  return await ticketRepository.findTypes();
}

async function createTicket(ticketParams: CreateTicketType) {
  const { ticketTypeId, userId } = ticketParams;

  const { id: enrollmentId } = await enrollmentRepository.findByUserId(userId);

  if (!enrollmentId) throw notFoundError();

  const response = await ticketRepository.create({ ticketTypeId, enrollmentId });

  if (!response) throw notFoundError();

  return response;
}

async function getType(typeId: number) {
  return await ticketRepository.findTypeById(typeId);
}

const ticketsService = {
  createTicket,
  getType,
  findTickets,
  findTypes,
};

export default ticketsService;
