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
      topics: ["payment-successful", "email-successful", "order-successful"],
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        switch (topic) {
          case "payment-successful":
            {
              const paymentValue = message.value.toString();
              const { userId, cart } = JSON.parse(value);

              const totalVal = cart.reduce((acc, curr) => acc + curr.price, 0);
              console.log(`Analytic consumer: User ${userId} paid ${totalVal}`);
            }
            break;
          case "order-successful":
            {
              const ordervalue = message.value.toString();
              const { userId, orderId } = JSON.parse(ordervalue);

              console.log(`Analytic consumer: User ${userId} paid ${totalVal}`);
            }
            break;
          case "email-successful":
            {
              const emailValue = message.value.toString();
              const { userId, emailId } = JSON.parse(emailValue);
            }
            break;
          default:
            break;
        }
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
