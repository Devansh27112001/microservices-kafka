import express from "express";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.post("/payment-service", async (req, res) => {
  const { cart } = req.body;
  // ASSUMEN THAT WE ARE GETTING THE USERid and THE DECRPYTED COOKIE
});
app.use((err, req, res, next) => {
  res.status(err.status || 5000).send(err.message);
});
app.listen(8000, () => {
  console.log("Payment service is running on PORT 8000");
});
