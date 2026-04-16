import express from "express";
import {
  findAll,
  findById,
  create,
  cancel,
  update,
  uploadAvatar,
} from "../controllers/author.js";
import parser from "../middleware/cloudinary.js";
import { authentication } from "../middleware/autentication.js";

const authorRouter = express.Router();
authorRouter.get("/", findAll);
authorRouter.get("/:id", findById);
authorRouter.post("/", authentication, create);
authorRouter.delete("/:id", authentication, cancel);
authorRouter.put("/:id", authentication, update);
authorRouter.patch(
  "/:id/avatar",
  authentication,
  parser.single("avatar"),
  uploadAvatar,
);
export default authorRouter;
