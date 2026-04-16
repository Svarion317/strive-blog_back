import mongoose from "mongoose";
import bcrypt from "bcrypt";
const AuthorSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  birthDate: String,
  avatar: String,
  password: String,
});

AuthorSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Author = mongoose.model("Author", AuthorSchema);

export default Author;
