import { useState } from "react";
import { useLoaderData, useCatch, Form, Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { getSession, destroySession } from "~/sessions.server.js";
import Avatar from "../../components/avatar";
import { GrLinkedin } from "@react-icons/all-files/gr/GrLinkedin";
import { MdComputer } from "@react-icons/all-files/md/MdComputer";
import { AiTwotoneEdit } from "@react-icons/all-files/ai/AiTwotoneEdit";
import { BsFillTrashFill } from "@react-icons/all-files/bs/BsFillTrashFill";
import { BsFillBookmarkFill } from "@react-icons/all-files/bs/BsFillBookmarkFill";
export async function action({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  try {
    const user = await db.models.User.findByIdAndDelete({ _id: userId });

    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  } catch (error) {
    return json({ errorMessage: "Profile couldn't be deleted" }, { status: 400 });
  }
}

export async function loader({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("userId")) {
    const userId = session.get("userId");
    const user = await db.models.User.findById(userId);

    const posts = await db.models.CompanyPosts.find({ createdBy: userId });
    return json({ user: user, posts: posts });
  } else {
    return redirect("/");
  }
}

export default function ProfilePage() {
  const data = useLoaderData();
  const [saved, setSaved] = useState(data?.user?.savedBy?.length);

  return (
    <div className=" lg:h-screen overflow-auto">
      <div className="w-full bg-custom-salmon p-4 flex flex-col items-center relative ">
        <Avatar seedProp={data?.user?.avatarImage} className="w-full h-48 object-scale-down justify-center" />
        <div className="flex pt-4">
          <a href={`${data?.user?.linkedin}`} className="flex items-center text-custom-white font-bold">
            <GrLinkedin className="flex mr-2 w-8 h-8" /> Linkedin
          </a>
          <a href={`${data?.user?.portfolio}`} className="flex items-center text-custom-white font-bold ml-4">
            <MdComputer className="flex mr-2 w-8 h-8" /> Portfolio
          </a>
          <span className="flex items-center text-custom-white cursor-pointer">
            <BsFillBookmarkFill
              className={`${
                saved > 0 ? "flex" : "hidden"
              } mr-2 items-center text-custom-white font-bold ml-4 w-8 h-8`}
            />
            <p className="font-bold">{saved > 0 ? `Saved by: ${saved}` : ""}</p>
          </span>
        </div>
        <div className="flex items-center absolute right-2 top-2">
          <Link
            to="/profile/edit"
            className=" bg-custom-white hover:bg-custom-purple text-custom-salmon font-semibold hover:text-white py-2 px-3 lg:px-4 border border-custom-purple hover:border-transparent rounded"
          >
            <AiTwotoneEdit className=" lg:hidden" />
            <p className="hidden lg:block">Edit Profile</p>
          </Link>
          <Form method="post">
            <button
              type="submit"
              className=" ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 lg:px-4 border border-red-700 rounded"
            >
              <BsFillTrashFill className=" lg:hidden" />
              <p className="hidden lg:block">Delete Profile</p>
            </button>
          </Form>
        </div>
      </div>
      <div className="p-4 lg:flex">
        <div className="lg:w-1/2">
          <span className="text-lg opacity-50 ">{data?.user?.createdAt.split("T")[0]}</span>
          <h2 className="text-3xl font-bold">{data?.user?.name}</h2>
          <ul className="mt-6 lg:mt-12">
            <li className="flex flex-col pb-2 pt-1 border-b border-slate-200">
              <label className="text-lg opacity-50 ">Role:</label>
              <p className="text-lg font-semibold">{data?.user?.role}</p>
            </li>
            <li className="flex flex-col pb-2 pt-1 border-b border-slate-200">
              <label className="text-lg opacity-50 ">Education:</label>
              <p className="text-lg font-semibold">{data?.user?.education}</p>
            </li>
            <li className="flex flex-col pb-2 pt-1 border-b border-slate-200">
              <label className="text-lg opacity-50 ">Email:</label>
              <p className="text-lg font-semibold">{data?.user?.email}</p>
            </li>
          </ul>
        </div>
        <div className="lg:w-1/2 mt-4 lg:mt-0 lg:pl-12">
          <label className="text-lg opacity-50">Tags:</label>
          <div className="w-full flex flex-wrap items-start">
            {data?.user?.tags.map((tag, key) => {
              return (
                <span
                  key={key}
                  className="font-bold bg-custom-salmon text-custom-white py-1 px-3 rounded-2xl mr-2 mt-2"
                >
                  {tag.label}
                </span>
              );
            })}
          </div>
          <div className="flex flex-col pt-4">
            <label className="text-lg opacity-50">Bio:</label>
            <p className={`text-base italic`}>{data?.user?.bio}</p>
          </div>
        </div>
      </div>

      <div className={`${data?.user?.role === "company" ? "" : "hidden"} px-4`}>
        <h2 className="text-2xl font-bold">Your posts</h2>
        <div className="pt-4 lg:gap-4 lg:grid lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {data?.posts?.map((post) => {
            return (
              <Link key={post._id} to={`/company/${post?._id}`} className="">
                <div className="my-8 lg:my-0 bg-custom-white shadow-md group">
                  {post?.imageUrl ? (
                    <img className="w-full h-48 object-scale-down" src={post.imageUrl} alt="Post image" />
                  ) : (
                    <Avatar
                      seedProp={post?.avatarImage}
                      className="w-full h-48 object-scale-down justify-center"
                    />
                  )}
                  <div className="p-4 pt-0">
                    <h2 className="text-2xl font-bold pb-2 min-h-10 max-h-10 group-hover:underline whitespace-nowrap text-ellipsis overflow-hidden">
                      {post?.title}
                    </h2>

                    <p className="pb-2 font-bold opacity-30">{post?.createdAt.split("T")[0]}</p>
                  </div>
                </div>{" "}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
      <h2>{caught.data}</h2>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <h1 className="text-red-500 font-bold">
      {error.name}: {error.message}
    </h1>
  );
}
