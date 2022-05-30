import { useState, useEffect } from "react";
import { useLoaderData, useActionData, useCatch, Form, Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { getSession } from "~/sessions.server.js";
import { GrLinkedin } from "@react-icons/all-files/gr/GrLinkedin";
import { MdComputer } from "@react-icons/all-files/md/MdComputer";
import { AiTwotoneEdit } from "@react-icons/all-files/ai/AiTwotoneEdit";
import { BsFillTrashFill } from "@react-icons/all-files/bs/BsFillTrashFill";
import { BsFillBookmarkFill } from "@react-icons/all-files/bs/BsFillBookmarkFill";
import { BsBookmark } from "@react-icons/all-files/bs/BsBookmark";

export async function action({ request, params }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const form = await request.formData();
  if (form.get("deletePost") === "delete") {
    try {
      const user = await db.models.CompanyPosts.findByIdAndDelete({ _id: params.companyPostId });

      return redirect("/");
    } catch (error) {
      return json({ errorMessage: "Profile couldn't be deleted" }, { status: 400 });
    }
  }
  if (form.get("actionSave") === "savePost") {
    const savedCheck = form.get("save");
    const activePostId = form.get("currentPostId");
    const companyPost = await db.models.CompanyPosts.findById(activePostId);
    let savedByArray = companyPost?.savedBy;

    for (let i = 0; i < savedByArray.length; i++) {
      if (savedByArray[i] === userId) {
        savedByArray.splice(i, 1);
      }
    }
    if (savedCheck === "false") {
      savedByArray?.push(userId);
    }

    try {
      const updatedPost = await db.models.CompanyPosts.findByIdAndUpdate(activePostId, {
        savedBy: savedByArray,
      });
      return json(updatedPost);
    } catch (error) {
      return json({ errorMessage: "Profile couldn't be saved" }, { status: 400 });
    }
  }
}

export async function loader({ request, params }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("userId")) {
    const companyPost = await db.models.CompanyPosts.findById(params.companyPostId);
    return json({ companyPost: companyPost, userId: session.get("userId") });
  } else {
    return redirect("/");
  }
}

export default function CompanyPostDetailPage() {
  const data = useLoaderData();
  const actionData = useActionData();
  const [saved, setSaved] = useState(false);
  // * for a unknown reason state is not dynamicaly being updated when unsaving it
  // * it is working when saving a candidate profile but not here, but works when you unsave and refresh

  useEffect(() => {
    for (let index = 0; index < data?.companyPost?.savedBy?.length; index++) {
      const savedById = data?.companyPost?.savedBy[index];
      console.log(savedById);

      if (savedById === data?.userId) {
        console.log("if");
        setSaved(true);
      } else {
        console.log("else");
        setSaved(false);
      }
    }
  }, [data, actionData]);

  return (
    <div className=" lg:h-screen overflow-auto">
      <div className="w-full bg-custom-salmon p-4 flex flex-col items-center relative ">
        <img className="w-full h-48 object-scale-down" src={data.companyPost.imageUrl} alt="Post image" />
        <div className="flex pt-4">
          <a href={`${data.companyPost.linkedin}`} className="flex items-center text-custom-white font-bold">
            <GrLinkedin className="flex mr-2 w-8 h-8" /> Linkedin
          </a>
          <Form method="post">
            <input type="hidden" name="actionSave" defaultValue="savePost" />
            <input type="hidden" name="save" defaultValue={saved} />
            <input type="hidden" name="currentPostId" defaultValue={data?.companyPost?._id} />
            <button
              type="submit"
              className={` items-center text-custom-white cursor-pointer ${
                data.companyPost.createdBy === data.userId ? "hidden" : "flex"
              }`}
            >
              <BsBookmark
                className={`${
                  saved ? "hidden" : "flex"
                } mr-2 items-center text-custom-white font-bold ml-4 w-8 h-8`}
              />
              <BsFillBookmarkFill
                className={`${
                  saved ? "flex" : "hidden"
                } mr-2 items-center text-custom-white font-bold ml-4 w-8 h-8`}
              />
              <p className="font-bold">{saved ? "Saved" : "Save"}</p>
            </button>
          </Form>
        </div>
        <div
          className={`${
            data.companyPost.createdBy === data.userId ? "flex" : "hidden"
          } items-center absolute right-2 top-2`}
        >
          <Link
            to={`/company/${data.companyPost._id}/edit`}
            className=" bg-custom-white hover:bg-custom-purple text-custom-salmon font-semibold hover:text-white py-2 px-3 lg:px-4 border border-custom-purple hover:border-transparent rounded"
          >
            <AiTwotoneEdit className=" lg:hidden" />
            <p className="hidden lg:block">Edit Profile</p>
          </Link>
          <Form method="post">
            <input type="hidden" name="deletePost" defaultValue="delete" />
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
          <span className="text-lg opacity-50 ">{data?.companyPost?.createdAt.split("T")[0]}</span>
          <h2 className="text-3xl font-bold">{data?.companyPost?.title}</h2>
          <ul className="mt-6 lg:mt-12">
            <li className="flex flex-col pb-2 pt-1 border-b border-slate-200">
              <label className="text-lg opacity-50 ">Contact person:</label>
              <p className="text-lg font-semibold">{data?.companyPost?.contactPerson}</p>
            </li>
            <li className="flex flex-col pb-2 pt-1 border-b border-slate-200">
              <label className="text-lg opacity-50 ">Contact email:</label>
              <p className="text-lg font-semibold">{data?.companyPost?.contactEmail}</p>
            </li>
            <li className="flex flex-col pb-2 pt-1 border-b border-slate-200">
              <label className="text-lg opacity-50 ">Position:</label>
              <p className="text-lg font-semibold">{data?.companyPost?.position}</p>
            </li>
          </ul>
        </div>
        <div className="lg:w-1/2 mt-4 lg:mt-0 lg:pl-12">
          <label className="text-lg opacity-50">Tags:</label>
          <div className="w-full flex flex-wrap items-start">
            {data.companyPost.tags.map((tag, key) => {
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
            <label className="text-lg opacity-50">Description:</label>
            <p className={`text-base italic`}>{data.companyPost.description}</p>
          </div>
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
