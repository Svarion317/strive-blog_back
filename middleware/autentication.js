import jwt from "jsonwebtoken";
import Author from "../models/Author.js";

export async function authentication(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "token mancante" });
    }

    const [scheme, jwtToken] = authHeader.split(" ");
    if (scheme !== "Bearer" || !jwtToken) {
      return res.status(401).json({ message: "token non valido" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET non configurata" });
    }

    jwt.verify(jwtToken, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        return res.status(401).json({ message: "token non valido" });
      }

      const author = await Author.findById(payload.id).select("-password");
      if (!author) {
        return res.status(401).json({ message: "utente non autorizzato" });
      }

      req.authUser = author;
      return next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
