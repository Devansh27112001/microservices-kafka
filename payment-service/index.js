import express from "express";
import cors from "cors";
import { Kafka } from "kafkajs";
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: ["localhost:9094"],
});

const producer = kafka.producer();

const connectToKafka = async () => {
  try {
    await producer.connect();
    console.log("Producer connected");
  } catch (error) {
    console.log("Error connecting to Kafka", error);
  }
};
app.post("/payment-service", async (req, res) => {
  const { cart } = req.body;
  console.log(cart);
  // ASSUMEING THAT WE ARE GETTING THE USERid and THE DECRPYTED COOKIE
  const userId = "123";

  // TODO: PAYMENT
  console.log("API endpoint hit");
  // KAFKA
  await producer.send({
    topic: "payment-successful",
    messages: [{ value: JSON.stringify({ cart, userId }) }],
  });

  return res.status(200).send("Payment successful");
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message);
});
app.listen(8000, () => {
  connectToKafka();
  console.log("Payment service is running on PORT 8000");
});
