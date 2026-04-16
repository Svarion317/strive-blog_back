import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connect } from "./Db.js";
import authorRouter from "./routes/authors.js";
import blogPostRouter from "./routes/blogPosts.js";
import commentRouter from "./routes/comments.js";
import authRouter from "./routes/auth.js";

dotenv.config();
connect();

const app = express();

const defaultOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const corsOrigins = (process.env.CORS_ORIGINS || defaultOrigins.join(","))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin non consentita da CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "server funzionante" });
});

app.use("/authors", authorRouter);
app.use("/blogposts", blogPostRouter);
app.use("/blogposts/:blogPostId/comments", commentRouter);
app.use("/auth", authRouter);

app.listen(process.env.PORT, () => {
  console.log("server in ascolto");
});
