const request = require('supertest');

// Mock the Hotels model to avoid connecting to a real MongoDB during tests
jest.mock('../models/Hotels', () => {
  return {
    find: jest.fn(() => ({ lean: () => Promise.resolve([]) })),
    findById: jest.fn(() => ({ lean: () => Promise.resolve(null) })),
    findByIdAndUpdate: jest.fn(() => ({ lean: () => Promise.resolve(null) })),
    findByIdAndDelete: jest.fn(() => ({ lean: () => Promise.resolve(null) })),
  };
});

let app;

beforeAll(() => {
  process.env.NODE_ENV = 'test';
  app = require('../server');
});

describe('GET /api/hotels', () => {
  it('should respond with 200', async () => {
    const res = await request(app).get('/api/hotels');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success');
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
