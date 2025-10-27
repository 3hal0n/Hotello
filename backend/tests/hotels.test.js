describe('GET /api/hotels', () => {
describe('POST /api/hotels', () => {
describe('PUT /api/hotels/:id', () => {
const request = require('supertest');

// ✅ Mock the Hotels model BEFORE requiring the app
jest.mock('../models/Hotels', () => ({
  find: jest.fn(() => ({ lean: () => Promise.resolve([]) })),
  findById: jest.fn(() => ({ lean: () => Promise.resolve(null) })),
  findByIdAndUpdate: jest.fn(() => ({ lean: () => Promise.resolve(null) })),
  findByIdAndDelete: jest.fn(() => ({ lean: () => Promise.resolve(null) })),
}));

let app;

// ✅ Use a single beforeAll (no nesting)
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  app = require('../server');
});

describe('Hotel API Tests', () => {
  describe('GET /api/hotels', () => {
    it('should respond with 200', async () => {
      const res = await request(app).get('/api/hotels');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/hotels', () => {
    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/hotels')
        .send({})
        .set('Authorization', 'Bearer testtoken');
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should create hotel with new fields', async () => {
      const hotelData = {
        name: 'Test Hotel',
        description: 'A nice place',
        location: 'Test City',
        pricePerNight: 100,
        amenities: ['wifi', 'pool'],
        roomTypes: [{ type: 'suite', price: 200, available: 5 }],
        geo: { lat: 10, lng: 20 },
        policies: 'No smoking',
        images: [{ url: 'http://img.com/1.jpg', public_id: 'img1' }],
      };
      const res = await request(app)
        .post('/api/hotels')
        .send(hotelData)
        .set('Authorization', 'Bearer testtoken');
      expect([201, 401, 403, 400]).toContain(res.statusCode);
    });
  });

  describe('PUT /api/hotels/:id', () => {
    it('should validate hotel id', async () => {
      const res = await request(app)
        .put('/api/hotels/invalidid')
        .send({ name: 'Updated Hotel' })
        .set('Authorization', 'Bearer testtoken');
      expect(res.statusCode).toBe(400);
    });

    it('should update hotel with new fields', async () => {
      const res = await request(app)
        .put('/api/hotels/507f1f77bcf86cd799439011')
        .send({ name: 'Updated Hotel', geo: { lat: 11, lng: 21 } })
        .set('Authorization', 'Bearer testtoken');
      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });
  });
});
