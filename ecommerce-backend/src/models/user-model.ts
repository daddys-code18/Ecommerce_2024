import mongoose, { Schema } from "mongoose";
import validator from "validator";

interface Iuser extends Document {
  _id: string;
  name: string;
  photo: string;
  email: string;
  role: "admin" | "user";
  gender: "male" | "female";
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
  // Virtual attribute
  age: number;
}

const userShema = new Schema(
  {
    _id: {
      type: String,
      required: [true, "Please provide an ID"],
    },
    name: {
      type: String,
      required: [true, "Please  enter your name"],
    },
    email: {
      type: String,
      unique: [true, "Email already Exists"],
      required: [true, "Please  enter your Email"],
      validate: validator.default.isEmail,
    },
    photo: {
      type: String,
      required: [true, "Please add Photo"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Please  enter your Gender"],
    },
    dob: {
      type: Date,
      required: [true, "Please  enter your Date of Brith"],
    },
  },
  { timestamps: true }
);

userShema.virtual("age").get(function () {
  const today = new Date();
  const dob = this.dob;
  let age = today.getFullYear() - dob.getFullYear();
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }
  return age;
});

export const User = mongoose.model<Iuser>("User", userShema);
