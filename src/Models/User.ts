import mongoose from "mongoose";

const userSchema: mongoose.Schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String
      // required: true,
    },
    applications: {
      type: Array
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({ email: 1 });

export const UserModel = mongoose.model("user", userSchema);
