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

const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://strive-blog-front.vercel.app",
];
const envOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const corsOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

const isAllowedVercelPreviewOrigin = (origin) => {
  try {
    const { protocol, hostname } = new URL(origin);
    return protocol === "https:" && /^strive-blog-front.*\.vercel\.app$/i.test(hostname);
  } catch {
    return false;
  }
};

const corsOptions = {
  origin(origin, callback) {
    if (!origin || corsOrigins.includes(origin) || isAllowedVercelPreviewOrigin(origin)) {
      callback(null, true);
      return;
    }

    console.warn(`[CORS] Origin bloccata: ${origin}`);
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

const parsedPort = Number.parseInt(process.env.PORT, 10);
const port = Number.isInteger(parsedPort) && parsedPort >= 0 && parsedPort <= 65535 ? parsedPort : 3000;

app.listen(port, () => {
  console.log(`server in ascolto sulla porta ${port}`);
});
