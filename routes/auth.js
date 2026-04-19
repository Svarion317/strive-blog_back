import express from "express";
import { login, me } from "../controllers/auth.js";
import { authentication } from "../middleware/autentication.js";

const authRouter = express.Router();
authRouter.post("/login", login);
authRouter.get("/me", authentication, me);

export default authRouter;
