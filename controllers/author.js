import mongoose from "mongoose";
import Author from "../models/Author.js";

export async function findAll(req, res) {
  try {
    const { page, limit } = req.query;
    const parsedPage = Number.parseInt(page, 10);
    const parsedLimit = Number.parseInt(limit, 10);

    const authorsQuery = Author.find().select("-password").lean();
    if (Number.isInteger(parsedPage) && parsedPage > 0 && Number.isInteger(parsedLimit) && parsedLimit > 0) {
      authorsQuery.skip((parsedPage - 1) * parsedLimit).limit(parsedLimit);
      //authorsQuery.skip((page - 1) * 1).limit(1);
    }
    const authors = await authorsQuery;
    res.status(200).json(authors);
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
      return res.status(400).json({ message: "invalid author id" });
    }
    const author = await Author.findById(req.params.id).select("-password");
    if (!author) {
      return res.status(404).json({
        message: "author not found",
      });
    }
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function create(req, res) {
  try {
    const { name, surname, email, birthDate, avatar, password } = req.body;
    const author = new Author({
      name,
      surname,
      email,
      birthDate,
      avatar,
      password,
    });
    const newAuthor = await author.save();
    const authorResponse = newAuthor.toObject();
    delete authorResponse.password;
    res.status(201).json(authorResponse);
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
      return res.status(400).json({ message: "invalid author id" });
    }
    const deletedAuthor = await Author.findByIdAndDelete(id);
    if (!deletedAuthor) {
      return res.status(404).json({
        message: "author not found",
      });
    }
    res.status(200).json({
      message: "author deleted",
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
        message: "invalid author id",
      });
    }

    const { name, surname, email, birthDate, avatar } = req.body;
    const updatedAuthor = await Author.findByIdAndUpdate(
      id,
      {
        name,
        surname,
        email,
        birthDate,
        avatar,
      },
      { returnDocument: "after" },
    ).select("-password");

    if (!updatedAuthor) {
      return res.status(404).json({
        message: "author not found",
      });
    }

    res.status(200).json(updatedAuthor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function uploadAvatar(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "invalid author id" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "error uploading file" });
    }
    const author = await Author.findByIdAndUpdate(
      id,
      {
        avatar: req.file.path,
      },
      { returnDocument: "after" },
    ).select("-password");
    if (!author) {
      return res.status(404).json({ message: "author not found" });
    }
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
