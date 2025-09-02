import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "analytic-service",
  brokers: ["localhost:9094"],
});

const consumer = kafka.consumer({ groupId: "analytic-service" });

const run = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: "payment-successful",
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value.toString();
        const { userId, cart } = JSON.parse(value);

        const totalVal = cart.reduce((acc, curr) => acc + curr.price, 0);
        console.log(`Analytic consumer: User ${userId} paid ${totalVal}`);
      },
    });
  } catch (error) {
    console.log("Error connecting to kafka", error);
  }
};
run();
