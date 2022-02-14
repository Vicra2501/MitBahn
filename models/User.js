const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    password: String,
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email:{
      type: String,
      required: true,
    },
    rating: Number,
    profilePicture: String,
    role: String // to be able to assign admins who can delete every group
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
