import express from "express";
import {
  findAll,
  findById,
  create,
  cancel,
  update,
  uploadBlogPostCover,
} from "../controllers/blogPost.js";
import parser from "../middleware/cloudinary.js";
import { authentication } from "../middleware/autentication.js";

const blogPostRouter = express.Router();
blogPostRouter.get("/", findAll);
blogPostRouter.get("/:id", findById);
blogPostRouter.post("/", authentication, create);
blogPostRouter.delete("/:id", authentication, cancel);
blogPostRouter.put("/:id", authentication, update);
blogPostRouter.patch(
  "/:id/cover",
  authentication,
  parser.single("cover"),
  uploadBlogPostCover,
);

export default blogPostRouter;
