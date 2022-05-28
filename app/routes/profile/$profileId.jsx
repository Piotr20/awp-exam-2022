import { useLoaderData, useCatch, Form, Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { getSession, destroySession } from "~/sessions.server.js";
import Avatar from "../../components/avatar";
import { GrLinkedin } from "@react-icons/all-files/gr/GrLinkedin";
import { MdComputer } from "@react-icons/all-files/md/MdComputer";

export async function action({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  try {
  } catch (error) {
    return json({ errorMessage: "Profile couldn't be deleted" }, { status: 400 });
  }
}

export async function loader({ request, params }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("userId")) {
    const user = await db.models.User.findById(params.profileId);
    return json(user);
  } else {
    return redirect("/");
  }
}

export default function CompanyPostDetailPage() {
  const user = useLoaderData();
  console.log(user);
  return (
    <div className="">
      <div className="w-full bg-custom-salmon p-4 flex flex-col items-center">
        <Avatar seedProp={user?.avatarImage} className="w-full h-48 object-scale-down justify-center" />
        <div className="flex pt-4">
          <a href={`${user.linkedin}`} className="flex items-center text-custom-white font-bold">
            <GrLinkedin className="flex mr-2 w-8 h-8" /> Linkedin
          </a>
          <a href={`${user.portfolio}`} className="flex items-center text-custom-white font-bold ml-4">
            <MdComputer className="flex mr-2 w-8 h-8" /> Portfolio
          </a>
        </div>
      </div>
      <div className="p-4 lg:flex">
        <div className="lg:w-1/2">
          <span className="text-lg opacity-50 ">{user.createdAt.split("T")[0]}</span>
          <h2 className="text-3xl font-bold">{user.name}</h2>
          <ul className="mt-6 lg:mt-12">
            <li className="flex flex-col pb-2 pt-1 border-b border-slate-200">
              <label className="text-lg opacity-50 ">Role:</label>
              <p className="text-lg font-semibold">{user.role}</p>
            </li>
            <li className="flex flex-col pb-2 pt-1 border-b border-slate-200">
              <label className="text-lg opacity-50 ">Education:</label>
              <p className="text-lg font-semibold">Business Academy Aarhus</p>
            </li>
            <li className="flex flex-col pb-2 pt-1 border-b border-slate-200">
              <label className="text-lg opacity-50 ">Email:</label>
              <p className="text-lg font-semibold">{user.email}</p>
            </li>
          </ul>
        </div>
        <div className="lg:w-1/2 mt-4 lg:mt-0 lg:pl-12">
          <label className="text-lg opacity-50">Tags:</label>
          <div className="w-full flex flex-wrap items-start">
            {user.tags.map((tag, key) => {
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
            <p className={`text-base italic`}>{user.bio}</p>
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
