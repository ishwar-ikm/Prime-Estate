import express from "express";
import dotenv from "dotenv"

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  return res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});