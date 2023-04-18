import { prisma } from '@/config';
import { PaymentParams } from '@/protocols';

async function find() {
  return await prisma.payment.findMany();
}

async function create({ ticketId, cardData, value }: PaymentParams & { value: number }) {
  return await prisma.payment.create({
    data: {
      ticketId,
      cardIssuer: cardData.issuer,
      cardLastDigits: String(cardData.number).slice(-4),
      value: value,
    },
  });
}

const paymentsRepository = {
  find,
  create,
};

export default paymentsRepository;
