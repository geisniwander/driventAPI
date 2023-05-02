import httpStatus from 'http-status';
import supertest from 'supertest';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import {
  createEnrollmentWithAddress,
  createHotel,
  createTicketType,
  createUser,
  createTicket,
  createTicketTypeRemote,
  createTicketTypeWithoutHotel,
  createTicketTypePaid,
  createRooms,
  createBooking,
  createRoomsWithoutVacancies,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 if there is no booking', async () => {
    const token = await generateValidToken();

    const response = await server.get(`/booking`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 200 and booking data if there is a booking', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotel();
    const room = await createRooms(hotel.id);
    const booking = await createBooking(user.id, room.id);
    const formattedRoom = {
      ...room,
      createdAt: room.createdAt.toISOString(),
      updatedAt: room.updatedAt.toISOString(),
    };

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({
      id: booking.id,
      Room: formattedRoom,
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking').set('Content-Type', 'application/json').send({ roomId: 1 });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server
      .post('/booking')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ roomId: 1 });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server
      .post('/booking')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ roomId: 1 });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 403 if ticket does not include hotel:', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const userEnrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithoutHotel();
    const ticket = await createTicket(userEnrollment.id, ticketType.id, 'PAID');

    const response = await server
      .post('/booking')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ roomId: 1 });

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 403 if ticket has not been paid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const userEnrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(userEnrollment.id, ticketType.id, 'RESERVED');

    const response = await server
      .post('/booking')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ roomId: 1 });

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 403 if ticket is remote', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const userEnrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeRemote();
    const ticket = await createTicket(userEnrollment.id, ticketType.id, 'PAID');

    const response = await server
      .post('/booking')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ roomId: 1 });

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 404 if there is no booking', async () => {
    const token = await generateValidToken();

    const response = await server
      .post(`/booking`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ roomId: 1 });

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 if room does not exists', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotel();
    const room = await createRooms(hotel.id);
    const booking = await createBooking(user.id, room.id);

    const response = await server
      .post('/booking')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ roomId: room.id + 1 });

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 200 and bookingId if the booking was created', async () => {
    await cleanDb();

    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotel();
    const userEnrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypePaid();
    const ticket = await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);
    const room = await createRooms(hotel.id);
    const booking = await createBooking(user.id, room.id);
    const formattedRoom = {
      ...room,
      createdAt: room.createdAt.toISOString(),
      updatedAt: room.updatedAt.toISOString(),
    };

    const response = await server
      .post('/booking')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ roomId: room.id });

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({
      bookingId: expect.any(Number),
    });
  });
});

describe('PUT /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking').set('Content-Type', 'application/json').send({ roomId: 1 });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.put('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server
      .put('/booking')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ roomId: 1 });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 if there is no booking', async () => {
    const token = await generateValidToken();

    const response = await server
      .put(`/booking/1`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ roomId: 1 });

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 if room does not exists', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotel();
    const room = await createRooms(hotel.id);
    const booking = await createBooking(user.id, room.id);

    const response = await server
      .put('/booking')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ roomId: room.id + 1 });

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 403 if the room has no vacancies', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotel();
    const userEnrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypePaid();
    const ticket = await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);
    const room = await createRoomsWithoutVacancies(hotel.id);
    const booking = await createBooking(user.id, room.id);

    const response = await server
      .put(`/booking/${booking.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ roomId: room.id });

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 401 if the user is not the booking owner', async () => {
    const user = await createUser();
    const token = await generateValidToken();
    const hotel = await createHotel();
    const userEnrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypePaid();
    const ticket = await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);
    const room = await createRooms(hotel.id);
    const booking = await createBooking(user.id, room.id);
    const formattedRoom = {
      ...room,
      createdAt: room.createdAt.toISOString(),
      updatedAt: room.updatedAt.toISOString(),
    };

    const response = await server
      .put(`/booking/${booking.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ roomId: room.id });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 200 and bookingId if booking was updated', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotel();
    const userEnrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypePaid();
    const ticket = await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);
    const room = await createRooms(hotel.id);
    const booking = await createBooking(user.id, room.id);
    const formattedRoom = {
      ...room,
      createdAt: room.createdAt.toISOString(),
      updatedAt: room.updatedAt.toISOString(),
    };

    const response = await server
      .put(`/booking/${booking.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ roomId: room.id });

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({
      bookingId: booking.id,
    });
  });
});
