const request = require('supertest');
const app = require('../src/server');

describe('Calculator API Integration Tests', () => {
  beforeEach(async () => {
    // Clear history before each test
    await request(app).delete('/api/history');
  });

  describe('GET /api/health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('POST /api/calculate', () => {
    test('should add two numbers', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({ operation: 'add', a: 5, b: 3 });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(8);
      expect(response.body.operation).toBe('add');
    });

    test('should subtract two numbers', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({ operation: 'subtract', a: 10, b: 3 });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(7);
    });

    test('should multiply two numbers', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({ operation: 'multiply', a: 5, b: 3 });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(15);
    });

    test('should divide two numbers', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({ operation: 'divide', a: 15, b: 3 });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(5);
    });

    test('should return error for division by zero', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({ operation: 'divide', a: 10, b: 0 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Division by zero');
    });

    test('should calculate power', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({ operation: 'power', a: 2, b: 3 });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(8);
    });

    test('should calculate square root', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({ operation: 'sqrt', a: 9 });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(3);
    });

    test('should return error for invalid operation', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({ operation: 'invalid', a: 5, b: 3 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid operation');
    });

    test('should return error for missing operation', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({ a: 5, b: 3 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Operation is required');
    });
  });

  describe('GET /api/history', () => {
    test('should return empty history initially', async () => {
      const response = await request(app).get('/api/history');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('should return calculation history', async () => {
      // Perform calculations
      await request(app).post('/api/calculate').send({ operation: 'add', a: 5, b: 3 });
      await request(app).post('/api/calculate').send({ operation: 'multiply', a: 2, b: 4 });

      const response = await request(app).get('/api/history');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].operation).toBe('add');
      expect(response.body[1].operation).toBe('multiply');
    });
  });

  describe('DELETE /api/history', () => {
    test('should clear history', async () => {
      // Add some calculations
      await request(app).post('/api/calculate').send({ operation: 'add', a: 5, b: 3 });

      // Clear history
      const deleteResponse = await request(app).delete('/api/history');
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.message).toBe('History cleared');

      // Verify history is empty
      const historyResponse = await request(app).get('/api/history');
      expect(historyResponse.body).toEqual([]);
    });
  });

  describe('404 Handler', () => {
    test('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not found');
    });
  });
});
