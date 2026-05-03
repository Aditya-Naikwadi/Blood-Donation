import Fastify from 'fastify';
import mongoose from 'mongoose';
import logger from '../../../packages/shared-logger';

const fastify = Fastify();

// Blood Request Schema
const requestSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  bloodType: { type: String, required: true },
  urgency: { type: String, enum: ['CRITICAL', 'HIGH', 'NORMAL'], default: 'NORMAL' },
  location: {
    lat: Number,
    lng: Number
  },
  status: { type: String, enum: ['OPEN', 'MATCHED', 'FULFILLED'], default: 'OPEN' },
  requesterId: String,
  createdAt: { type: Date, default: Date.now, expires: 259200 } // 72h TTL
});

const BloodRequest = mongoose.model('BloodRequest', requestSchema);

fastify.post('/requests', async (request, reply) => {
  const { patientName, bloodType, urgency, location, requesterId } = request.body as any;
  
  const newRequest = new BloodRequest({ patientName, bloodType, urgency, location, requesterId });
  await newRequest.save();

  logger.info(`Request created in MongoDB: ${newRequest._id}`);
  return newRequest;
});

const start = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  await fastify.listen({ port: 3003, host: '0.0.0.0' });
  console.log('Request Service (MongoDB) running on port 3003');
};

start();
