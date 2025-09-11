import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["localhost:9094"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "order-service" });

const run = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({
      topic: "payment-successful",
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, message, partition }) => {
        const value = message.value.toString();
        const { userId, cart } = JSON.parse(value);

        // TODo: Create the order on DB
        const dummyorderId = "4568978";
        console.log(
          `Order consumer: Order created successfully for user ${userId} with orderId ${dummyorderId}`
        );
        await producer.send({
          topic: "order-successful",
          messages: [
            { value: JSON.stringify({ userId, orderId: dummyorderId }) },
          ],
        });
      },
    });
  } catch (error) {
    console.log("Error connecting to kafka", error);
  }
};

run();
