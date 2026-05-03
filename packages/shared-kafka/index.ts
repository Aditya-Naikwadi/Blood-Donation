import { Kafka, Producer, Consumer, EachMessageHandler } from 'kafkajs';

class KafkaClient {
  private kafka: Kafka;
  private producer: Producer;

  constructor(clientId: string, brokers: string[] = (process.env.KAFKA_BROKERS || 'localhost:9094').split(',')) {
    this.kafka = new Kafka({ clientId, brokers });
    this.producer = this.kafka.producer();
  }

  public async connect() {
    await this.producer.connect();
  }

  public async produce(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  public async createConsumer(groupId: string, topic: string, onMessage: EachMessageHandler) {
    const consumer = this.kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: false });
    await consumer.run({ eachMessage: onMessage });
    return consumer;
  }
}

export default KafkaClient;
export { EachMessageHandler };
