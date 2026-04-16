import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 300,
    },
    author: String,
  },
  {
    timestamps: true,
  },
);
const BlogPostSchema = new mongoose.Schema({
  category: String,
  title: String,
  cover: String,
  readTime: {
    value: Number,
    unit: String,
  },
  author: String,
  content: String,
  comments: [CommentSchema],
});

const Post = mongoose.model("BlogPost", BlogPostSchema);

export default Post;
