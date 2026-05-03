import request from 'supertest';
import KafkaClient from '../packages/shared-kafka';
import RedisClient from '../packages/shared-redis';

// Mocking dependencies for integration testing
jest.mock('../packages/shared-kafka');
jest.mock('../packages/shared-redis');

describe('Blood Request Flow Integration (Chain B)', () => {
  let kafka: any;
  let redis: any;

  beforeAll(() => {
    kafka = new KafkaClient('test');
    redis = RedisClient.getInstance();
  });

  it('should publish request.created when a new blood request is POSTed', async () => {
    const mockRequest = {
      patientName: 'Jane Doe',
      bloodType: 'O_NEGATIVE',
      units: 2,
      urgency: 'CRITICAL',
      hospital: 'City Hospital',
      location: { lat: 40.7128, lng: -74.0060 },
      city: 'New York'
    };

    // This would ideally hit the actual request-service endpoint
    // Here we simulate the logic
    const response = await request('http://localhost:3003')
      .post('/requests')
      .send(mockRequest);

    expect(response.status).toBe(200);
    expect(kafka.produce).toHaveBeenCalledWith('request.created', expect.any(Object));
  });

  it('should broadcast via Redis Pub/Sub for real-time frontend updates', async () => {
    expect(RedisClient.publish).toHaveBeenCalledWith(
      'blood-requests:broadcast',
      expect.objectContaining({ bloodType: 'O_NEGATIVE' })
    );
  });
});
