import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const maskData: FastifyPluginCallback = (fastify, options, done) => {
  fastify.addHook('onSend', async (request, reply, payload: string) => {
    const user = request.user;
    if (!user) return payload;

    try {
      const data = JSON.parse(payload);

      // Rule: Donors see recipients' first name + city only
      if (user.role === 'DONOR') {
        if (Array.isArray(data)) {
          return JSON.stringify(data.map(item => ({
            ...item,
            patientName: item.patientName?.split(' ')[0],
            address: undefined // mask full address
          })));
        }
      }

      // Rule: Hospitals see full details
      if (user.role === 'HOSPITAL' || user.role === 'ADMIN') {
        return payload;
      }

      return payload;
    } catch (e) {
      return payload;
    }
  });

  done();
};

export default fp(maskData);
