import { mongoose } from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [3, "That's too short"],
    },
  },
  { timestamps: true }
);

export const models = [
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  },
];
