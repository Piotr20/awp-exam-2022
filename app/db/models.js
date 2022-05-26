import { mongoose } from "mongoose";

const { Schema } = mongoose;

const companyPostsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [3, "That's too short"],
    },
    tags: {
      type: Array,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: String,
    },
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
    name: "CompanyPosts",
    schema: companyPostsSchema,
    collection: "companyPosts",
  },
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  },
];
