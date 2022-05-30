import { Form, Link, useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import seeUsers from "../db/seedUsers.json";
import seePosts from "../db/seedPosts.json";

export async function action() {
  const db = await connectDb();
  try {
    await db.models.User.deleteMany({});
    await db.models.CompanyPosts.deleteMany({});
    await db.models.User.insertMany(seeUsers, {});
    await db.models.CompanyPosts.insertMany(seePosts, {});
    return redirect("/");
  } catch (error) {
    throw new Error("Error");
  }
}
export async function loader() {
  const db = await connectDb();
  const currentUsersCount = await db.models.User.find().estimatedDocumentCount();
  const currentPostsCount = await db.models.User.find().estimatedDocumentCount();
  const seededUsers = seeUsers;
  const seededPosts = seePosts;
  return {
    seededUsers,
    seededPosts,
    currentUsersCount,
    currentPostsCount,
  };
}

export default function Seed() {
  const { seededUsers, seededPosts, currentUsersCount, currentPostsCount } = useLoaderData();
  return (
    <div className="wrapper p-4">
      <div className="wrapper-inner">
        <h2 className="text-3xl font-bold mb-4">Re-seed your snippets</h2>
        <p>
          You currently have {currentUsersCount} users and {currentPostsCount} posts
        </p>
        <p>
          Do you want to delete your users and posts and re-seed with {seededUsers.length} users and{" "}
          {seededPosts.length} posts?
        </p>
        <div className="flex gap-3 mt-3 items-center">
          <Form method="post">
            <button
              type="submit"
              className="p-2 px-4 border rounded bg-custom-black text-custom-white font-bold"
            >
              Yes
            </button>
          </Form>
          <Link to="/">
            <button className="underline">No</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
