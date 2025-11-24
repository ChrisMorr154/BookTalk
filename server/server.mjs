import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import user from "./routes/users.mjs";

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;

console.log("MongoDB Connection String:", process.env.ATLAS_URI);

mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => {
    console.error("Could not connect to MongoDB...", err);
    process.exit(1);
  });

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

// Routes
app.use("/users", user);

// Handle Erros
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

//Start the Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});