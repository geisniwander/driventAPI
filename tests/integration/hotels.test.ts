import httpStatus from 'http-status';
import supertest from 'supertest';
import { createHotel } from '../factories';
import { cleanDb } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotel', () => {
  it('should respond with status 404 if there is no hotel', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 200 and hotel data if there is a hotel', async () => {
    const hotel = await createHotel();

    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.OK);

    expect(response.body).toEqual({
      id: hotel.id,
      name: hotel.name,
      image: hotel.image,
      createdAt: hotel.createdAt.toISOString(),
      updatedAt: hotel.updatedAt.toISOString(),
    });
  });
});
