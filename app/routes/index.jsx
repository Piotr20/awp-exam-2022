import { useLoaderData, useActionData, Link, Form } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { json } from "@remix-run/node";
import { getSession } from "~/sessions.server.js";

export async function action({ request }) {
  const db = await connectDb();
  const form = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const users = await db.models.User.find();
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
      const users = await db.models.User.find();
      return json({ userData: user, posts: users });
    }
  } else {
    return null;
  }
}

export default function Index() {
  const user = useLoaderData();
  const allPosts = useActionData();
  console.log(allPosts);
  console.log("user", user);

  return (
    <div className=" bg-custom-purple text-custom-white w-full">
      <h1 className="text-center">Feed</h1>

      {user?.userData?.role === "studemt" ? (
        <div className="flex w-full justify-between ">
          <Form className="w-full" method="post">
            <input type="hidden" name="type" defaultValue="company" />
            <button className="w-full text-center py-4 pb-2" type="submit">
              Internship Posts
            </button>
          </Form>
        </div>
      ) : (
        ""
      )}
      {user?.userData?.role === "company" ? (
        <div className="flex w-full justify-between ">
          <Form className="w-full" method="post">
            <input type="hidden" name="type" defaultValue="student" />
            <button className="w-full text-center py-4 pb-2" type="submit">
              Student Profiles
            </button>
          </Form>
        </div>
      ) : (
        ""
      )}
      {user?.userData?.role ? (
        ""
      ) : (
        <div className="flex w-full justify-between ">
          <Form className="w-full" method="post">
            <input type="hidden" name="type" defaultValue="student" />
            <button className="w-full text-center py-4 pb-2" type="submit">
              Student Profiles
            </button>
          </Form>
          <Form className="w-full" method="post">
            <input type="hidden" name="type" defaultValue="company" />
            <button className="w-full text-center py-4 pb-2" type="submit">
              Internship Posts
            </button>
          </Form>
        </div>
      )}

      <div className="w-full bg-custom-white text-custom-black">
        {allPosts
          ? allPosts?.posts?.map((post) => {
              return <div key={post._id}>{post?.title || post?.name}</div>;
            })
          : user?.posts.map((post) => {
              return <div key={post._id}>{post?.title || post?.name}</div>;
            })}
      </div>
    </div>
  );
}
