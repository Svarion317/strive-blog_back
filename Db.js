import { configDotenv } from "dotenv";
import mongoose from "mongoose";

export async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("database connesso");
  } catch (err) {
    (console.error("erroe della connessione Db"), err);
  }
}
