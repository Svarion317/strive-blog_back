import mongoose from "mongoose";
import BlogPost from "../models/BlogPost.js";

export async function findAll(req, res) {
  try {
    const { page, limit } = req.query;
    const blogPostsQuery = BlogPost.find();
    if (page && limit) {
      blogPostsQuery.skip((page - 1) * limit).limit(limit);
    }
    const blogPosts = await blogPostsQuery;
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function findById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "invalid blogpost id" });
    }
    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return res.status(404).json({
        message: "blogpost not found",
      });
    }
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function create(req, res) {
  try {
    const { category, title, cover, readTime, author, content } = req.body;
    const blogPost = new BlogPost({
      category,
      title,
      cover,
      readTime,
      author,
      content,
    });
    const newBlogPost = await blogPost.save();
    res.status(201).json(newBlogPost);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function cancel(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "invalid blogpost id" });
    }
    const deletedBlogPost = await BlogPost.findByIdAndDelete(id);
    if (!deletedBlogPost) {
      return res.status(404).json({
        message: "blogpost not found",
      });
    }
    res.status(200).json({
      message: "blogpost deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function update(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "invalid blogpost id",
      });
    }

    const { category, title, cover, readTime, author, content } = req.body;
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      id,
      {
        category,
        title,
        cover,
        readTime,
        author,
        content,
      },
      { returnDocument: "after" },
    );

    if (!updatedBlogPost) {
      return res.status(404).json({
        message: "blogpost not found",
      });
    }

    res.status(200).json(updatedBlogPost);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function uploadBlogPostCover(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "invalid post id" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "error uploading file" });
    }
    const post = await BlogPost.findByIdAndUpdate(
      id,
      {
        cover: req.file.path,
      },
      { returnDocument: "after" },
    );
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
