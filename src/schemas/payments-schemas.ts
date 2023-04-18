import Joi from 'joi';
import { PaymentTypeSchema } from '@/protocols';

export const createPaymentSchema = Joi.object<PaymentTypeSchema>({
  ticketId: Joi.number().required(),
  cardData: Joi.object().required(),
});
