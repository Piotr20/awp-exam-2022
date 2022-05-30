import { useState } from "react";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { getSession, commitSession } from "~/sessions.server.js";
import connectDb from "~/db/connectDb.server.js";
import PostsList from "../components/postsList";
import LoadingCover from "../components/loadingCover";
import { MultiSelect } from "react-multi-select-component";
import { BsSearch } from "@react-icons/all-files/bs/BsSearch";

export async function action({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));

  try {
    const user = await db.models.User.create({
      password: hashedPassword,
    });

    return json({ errorMessage: "User couldn't be created" }, { status: 400 });
  } catch (error) {
    return json(
      {
        errorMessage: error.message ?? error.errors?.map((error) => error.message).join(", "),
      },
      { status: 400 }
    );
  }
}

export async function loader({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("userId")) {
    const userId = session.get("userId");
    const user = await db.models.User.findById(userId);
    if (user?.role === "student") {
      const companyPosts = await db.models.CompanyPosts.find();
      let savedByCurrentUser = [];
      for (const post of companyPosts) {
        for (let index = 0; index < post?.savedBy.length; index++) {
          const savedByUserId = post?.savedBy[index];
          if (savedByUserId === userId) {
            savedByCurrentUser.push(post);
          }
        }
      }

      return json({ userData: user, posts: savedByCurrentUser });
    }
    if (user?.role === "company") {
      const users = await db.models.User.find({ role: "student" });
      let savedByCurrentUser = [];
      for (const post of users) {
        for (let index = 0; index < post?.savedBy.length; index++) {
          const savedByUserId = post?.savedBy[index];
          if (savedByUserId === userId) {
            savedByCurrentUser.push(post);
          }
        }
      }
      return json({ userData: user, posts: savedByCurrentUser });
    }
  } else {
    return redirect("/");
  }
  return null;
}

export default function SavedProfiles() {
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const transition = useTransition();
  const [posts, setPosts] = useState(loaderData?.posts);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState([]);
  const options = [
    { label: "Web developer", value: "Web developer" },
    { label: "UX designer", value: "UX designer" },
    { label: "UI designer", value: "UI designer" },
    { label: "SoMe specialist", value: "SoMe specialist" },
  ];
  console.log(loaderData.posts.length);

  return (
    <div className="lg:h-screen overflow-auto bg-custom-white">
      <div className={`${loaderData?.posts ? "" : "hidden"} p-4 bg-custom-white`}>
        <div className=" relative lg:float-left">
          <input
            type="text"
            name="query"
            placeholder="Search postings..."
            defaultValue={null}
            className="block mb-3 mt-1 lg:m-0 border rounded px-2 py-2 pr-10 bg-custom-white border-zinc-300 w-full outline-blue-500"
            onChange={(e) => {
              setQuery(e.target.value);
              console.log(query);
            }}
          />
          <BsSearch className="absolute right-4 top-1/2 transform -translate-y-1/2" />
        </div>
        <MultiSelect
          className="lg:ml-4 lg:min-w-64 h-full lg:float-left bg-custom-white"
          options={options}
          value={filters}
          onChange={setFilters}
          labelledBy="Select"
        />
      </div>
      <div className="w-full h-full relative bg-custom-white text-custom-black p-4 lg:pt-12 pb-16 sm:pb-24 lg:pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 sm:gap-6 md:gap-8">
        <LoadingCover remixTransition={transition} />
        <p
          className={`${
            loaderData?.posts?.length > 0 ? "hidden" : ""
          }  w-full p-4 bg-custom-white -mt-8 h-screen`}
        >
          It looks like you don't have any posts saved yet.
        </p>
        <PostsList
          posts={posts
            ?.filter((post) => {
              if (query === null) {
                return post;
              } else {
                return (
                  post?.title?.toLowerCase().includes(query.toLowerCase()) ||
                  post?.name?.toLowerCase().includes(query.toLowerCase())
                );
              }
            })
            ?.filter((post) => {
              if (filters.length === 0) {
                return post;
              } else {
                let match = false;
                filters?.map((filter) => {
                  post?.tags.map((tag) => {
                    if (filter?.value === tag?.value) {
                      match = true;
                    }
                  });
                });
                if (match) {
                  return post;
                }
              }
            })}
        />
      </div>
    </div>
  );
}
