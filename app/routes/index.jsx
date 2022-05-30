import { useState, useEffect } from "react";
import { useLoaderData, useActionData, useTransition, Form, useSearchParams } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { json } from "@remix-run/node";
import { getSession } from "~/sessions.server.js";
import PostsList from "../components/postsList";
import HomepageNav from "../components/homepageNav";
import LoadingCover from "../components/loadingCover";
import { MultiSelect } from "react-multi-select-component";
import { BsSearch } from "@react-icons/all-files/bs/BsSearch";

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
}

export async function loader({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("userId")) {
    const userId = session.get("userId");
    const user = await db.models.User.findById(userId);
    if (user?.role === "student") {
      const companyPosts = await db.models.CompanyPosts.find();
      return json({ userData: user, posts: companyPosts });
    }
    if (user?.role === "company") {
      const users = await db.models.User.find({ role: "student" });
      return json({ userData: user, posts: users });
    }
  } else {
    return null;
  }
  return null;
}

export default function Index() {
  const user = useLoaderData();
  const allPosts = useActionData();
  const transition = useTransition();
  const [posts, setPosts] = useState(user?.posts);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState([]);
  const options = [
    { label: "Web developer", value: "Web developer" },
    { label: "UX designer", value: "UX designer" },
    { label: "UI designer", value: "UI designer" },
    { label: "SoMe specialist", value: "SoMe specialist" },
  ];
  useEffect(() => {
    if (allPosts) {
      setPosts(allPosts?.posts);
    } else {
      setPosts(user?.posts);
    }
  }, [allPosts]);

  return (
    <div className=" w-full h-full lg:h-screen flex flex-col ">
      <div className="w-full bg-custom-white text-custom-black shadow-md z-10">
        <h1 className="text-center text-2xl font-bold pt-2">Feed</h1>
        <HomepageNav user={user} role={user?.userData?.role} />
      </div>
      <div className={`${allPosts ? "" : "hidden"} p-4 bg-custom-white`}>
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
          className="lg:ml-4 lg:min-w-64 h-full lg:float-left"
          options={options}
          value={filters}
          onChange={setFilters}
          labelledBy="Select"
        />
      </div>
      <p className={`${allPosts || user !== null ? "hidden" : ""}  w-full p-4 bg-custom-white`}>
        Welcome to our internship posting portal😊. <br /> Feel free to explore it and find your either dream
        internship or perfect inernship/student job candidate.
      </p>
      <div className="w-full h-full relative bg-custom-white text-custom-black p-4 pb-16 sm:pb-24 lg:pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 sm:gap-6 md:gap-8 overflow-y-auto">
        <LoadingCover remixTransition={transition} />
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
