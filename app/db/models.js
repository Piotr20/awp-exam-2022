import { mongoose } from "mongoose";

const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [3, "That's too short"],
    },
    // TODO: add a `userId` property of type Schema.Types.ObjectId with a `ref` to the User model:
    // https://mongoosejs.com/docs/populate.html
  },
  { timestamps: true }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Gotta have a name"],
      minLength: [3, "That's too short"],
    },
    role: {
      type: String,
      required: [true, "Gotta have a role"],
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    tags: {
      type: Array,
    },
    avatarImage: {
      type: String,
    },
  },
  { timestamps: true }
);

export const models = [
  {
    name: "Book",
    schema: bookSchema,
    collection: "books",
  },
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  },
];
