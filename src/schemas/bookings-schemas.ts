import Joi from 'joi';

export const bookingRoom = Joi.object({
  roomId: Joi.number().required(),
});
