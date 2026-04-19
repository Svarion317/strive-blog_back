import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Author from "../models/Author.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    let author = await Author.findOne({ email });
    if (!author) {
      res.status(401).json({ message: "credenziali errate" });
      return;
    }
    const result = await bcrypt.compare(password, author.password);
    if (!result) {
      res.status(401).json({
        message: "cedenziali errate",
      });
      return;
    }
    jwt.sign(
      {
        id: author.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "168h",
      },
      (error, jwtToekn) => {
        if (error) {
          res.status(500).json({
            message: error.message,
          });
        } else {
          res.json({
            token: jwtToekn,
          });
        }
      },
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function me(req, res) {
  try {
    return res.status(200).json(req.authUser);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
