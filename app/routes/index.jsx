import { useState, useEffect } from "react";
import { useLoaderData, useActionData, useTransition } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { json } from "@remix-run/node";
import { getSession } from "~/sessions.server.js";
import PostsList from "../components/postsList";
import HomepageNav from "../components/homepageNav";
import LoadingCover from "../components/loadingCover";

export async function action({ request }) {
  const db = await connectDb();
  const form = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const users = await db.models.User.find({ role: "student" });
  const companyPosts = await db.models.CompanyPosts.find();
  const filterPostsBy = form.get("type");
  if (userId && filterPostsBy === "company") {
    return json({ posts: companyPosts, userId: userId });
  }
  if (userId && filterPostsBy === "student") {
    return json({ posts: users, userId: userId });
  }
  if (!userId && filterPostsBy === "student") {
    return json({ posts: users });
  }
  if (!userId && filterPostsBy === "company") {
    return json({ posts: companyPosts });
  } else {
    return json({
      usersProfiles: users,
      companyPosts: companyPosts,
      userId: userId,
      filterBy: filterPostsBy,
    });
  }
  return json({ usersProfiles: users, companyPosts: companyPosts, userId: userId, filterBy: filterPostsBy });
}

export async function loader({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("userId")) {
    const userId = session.get("userId");
    const user = await db.models.User.findById(userId);
    if (user.role === "student") {
      const companyPosts = await db.models.CompanyPosts.find();
      return json({ userData: user, posts: companyPosts });
    }
    if (user.role === "company") {
      const users = await db.models.User.find({ role: "student" });
      return json({ userData: user, posts: users });
    }
  } else {
    return null;
  }
}

export default function Index() {
  const user = useLoaderData();
  const allPosts = useActionData();
  const transition = useTransition();
  const [posts, setPosts] = useState(user?.posts);

  useEffect(() => {
    if (allPosts) {
      setPosts(allPosts?.posts);
    } else {
      setPosts(user?.posts);
    }
  }, [allPosts]);
  return (
    <div className=" w-full h-full lg:h-screen flex flex-col">
      <div className="w-full bg-custom-white text-custom-black shadow-md z-10">
        <h1 className="text-center text-2xl font-bold pt-2">Feed</h1>
        <HomepageNav user={user} role={user?.userData?.role} />
      </div>

      <div className="w-full h-full relative bg-custom-white text-custom-black p-4 lg: pt-8 lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-8 overflow-y-auto">
        <LoadingCover remixTransition={transition} />
        <PostsList posts={posts} />
      </div>
    </div>
  );
}
