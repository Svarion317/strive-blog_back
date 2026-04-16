import BlogPost from "../models/BlogPost.js";
import mongoose from "mongoose";

export async function findAll(req, res) {
  try {
    const { blogPostId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(blogPostId)) {
      return res.status(400).json({ message: "invalid blogPostId" });
    }
    const post = await BlogPost.findById(blogPostId);
    if (!post) {
      return res.status(404).json({ message: "blogPost not found" });
    }
    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function findById(req, res) {
  try {
    const { blogPostId, id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(blogPostId)) {
      return res.status(400).json({ message: "invalid blogPostId" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "invalid comment id" });
    }
    const post = await BlogPost.findById(blogPostId);
    if (!post) {
      return res.status(404).json({ message: "blogPost not found" });
    }
    const comment = post.comments.id(id);
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function create(req, res) {
  try {
    const { blogPostId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(blogPostId)) {
      return res.status(400).json({ message: "invalid blogPostId" });
    }
    const { text, author } = req.body;
    const post = await BlogPost.findById(blogPostId);
    if (!post) {
      return res.status(404).json({ message: "blogPost not found" });
    }
    post.comments.push({
      text,
      author,
    });
    await post.save();
    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function cancel(req, res) {
  try {
    const { blogPostId, id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(blogPostId)) {
      return res.status(400).json({ message: "invalid blogPostId" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "invalid comment id" });
    }
    const post = await BlogPost.findById(blogPostId);
    if (!post) {
      return res.status(404).json({ message: "blogPost not found" });
    }
    const comment = post.comments.id(id);
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }
    comment.deleteOne();
    await post.save();
    res.status(200).json({ message: "comment deleted" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function update(req, res) {
  try {
    const { blogPostId, id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(blogPostId)) {
      return res.status(400).json({ message: "invalid blogPostId" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "invalid comment id" });
    }
    const post = await BlogPost.findById(blogPostId);
    if (!post) {
      return res.status(404).json({ message: "blogPost not found" });
    }
    const comment = post.comments.id(id);
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }
    const { text, author } = req.body;
    if (text !== undefined) {
      comment.text = text;
    }
    if (author !== undefined) {
      comment.author = author;
    }
    await post.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
