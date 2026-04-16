import express from "express";
import {
  findAll,
  findById,
  create,
  cancel,
  update,
} from "../controllers/comment.js";
import { authentication } from "../middleware/autentication.js";

const commentRouter = express.Router({ mergeParams: true });
commentRouter.get("/", findAll);
commentRouter.get("/:id", findById);
commentRouter.post("/", authentication, create);
commentRouter.delete("/:id", authentication, cancel);
commentRouter.put("/:id", authentication, update);
commentRouter.patch("/:id", authentication, update);
export default commentRouter;
