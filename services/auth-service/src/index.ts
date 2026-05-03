import Fastify from 'fastify';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../../../packages/shared-logger';

const fastify = Fastify();

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['DONOR', 'RECIPIENT', 'HOSPITAL', 'ADMIN'], default: 'DONOR' },
  bloodType: String,
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Register
fastify.post('/auth/register', async (request, reply) => {
  const { email, password, name, role, bloodType } = request.body as any;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ email, password: hashedPassword, name, role, bloodType });
    await user.save();
    return { success: true, userId: user._id };
  } catch (error) {
    return reply.status(400).send({ error: 'User already exists' });
  }
});

// Login
fastify.post('/auth/login', async (request, reply) => {
  const { email, password } = request.body as any;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return reply.status(401).send({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!);
  return { token, user: { id: user._id, name: user.name, role: user.role } };
});

const start = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('Connected to MongoDB');
  await fastify.listen({ port: 3001, host: '0.0.0.0' });
};

start();
