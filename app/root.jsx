import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";

import styles from "~/tailwind.css";
import stylesGlobal from "./styles/global.css";
import { BsFillBookmarkFill } from "@react-icons/all-files/bs/BsFillBookmarkFill";
import { AiFillHome } from "@react-icons/all-files/ai/AiFillHome";
import { FaUser } from "@react-icons/all-files/fa/FaUser";
import { AiFillPlusCircle } from "@react-icons/all-files/ai/AiFillPlusCircle";
import { RiLogoutBoxRFill } from "@react-icons/all-files/ri/RiLogoutBoxRFill";
import { RiLoginBoxFill } from "@react-icons/all-files/ri/RiLoginBoxFill";

import connectDb from "~/db/connectDb.server.js";
import { getSession, destroySession } from "~/sessions.server.js";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
  {
    rel: "stylesheet",
    href: stylesGlobal,
  },
];

export function meta() {
  return {
    charset: "utf-8",
    title: "Remix + MongoDB",
    viewport: "width=device-width,initial-scale=1",
  };
}

export async function loader({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("userId")) {
    const userId = session.get("userId");
    const user = await db.models.User.findById(userId);
    return json(user);
  } else {
    return null;
  }
}

export default function App() {
  const user = useLoaderData();
  console.log(user);
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="pb-28 lg:pb-0 lg:flex">
        {/* <header className="pb-3 mb-4 border-b-2">
          <Link to="/" className="hover:underline text-blue-600">
            Home
          </Link>
          <Link to="/users/new" className="ml-3 hover:underline text-blue-600">
            New user
          </Link>
        </header> */}
        <nav className="w-full lg:h-screen group lg:w-24 lg:hover:w-48 lg:transition-all lg:duration-300 cursor-pointer fixed lg:static bottom-0 left-0 px-12 py-6 lg:px-6 bg-custom-black flex flex-col justify-between">
          <ul className="flex justify-between lg:flex-col lg:items-center lg:justify-start">
            <li className="lg:my-3 w-full">
              <Link className="flex items-center  custom-underline" to="/">
                <AiFillHome className="w-8 h-8 lg:w-6 lg:h-6 text-white " />
                <p className="text-white pl-4 text-xl hidden  group-hover:block ">Home</p>
              </Link>
            </li>
            <li className="lg:my-3 w-full">
              <Link className="flex items-center  custom-underline" to="/">
                <BsFillBookmarkFill className="w-8 h-8 lg:w-6 lg:h-6 text-white " />
                <p className="text-white pl-4 text-xl hidden group-hover:block">Saved</p>
              </Link>
            </li>
            <li className="lg:my-3 w-full">
              <Link className="flex items-center  custom-underline" to="/profile">
                <FaUser className="w-8 h-8 lg:w-6 lg:h-6 text-white" />
                <p className="text-white pl-4 text-xl hidden group-hover:block">Profile</p>
              </Link>
            </li>
            {user?.role === "company" ? (
              <li className="lg:my-3 w-full justify-self-end ">
                <Link className="flex items-center  custom-underline" to="/profile">
                  <AiFillPlusCircle className="w-8 h-8 lg:w-6 lg:h-6 text-white" />
                  <p className="text-white pl-4 text-xl hidden group-hover:block">Post</p>
                </Link>
              </li>
            ) : (
              ""
            )}
          </ul>
          {user ? (
            <div className="hidden lg:block lg:my-3 w-full justify-self-end">
              <Link className="flex items-center  custom-underline" to="/logout">
                <RiLogoutBoxRFill className="w-8 h-8 lg:w-6 lg:h-6 text-white" />
                <p className="text-white pl-4 text-xl hidden group-hover:block whitespace-nowrap">Log out</p>
              </Link>
            </div>
          ) : (
            <div className="hidden lg:block lg:my-3 w-full justify-self-end">
              <Link className="flex items-center  custom-underline" to="/login">
                <RiLoginBoxFill className="w-8 h-8 lg:w-6 lg:h-6 text-white" />
                <p className="text-white pl-4 text-xl hidden group-hover:block whitespace-nowrap">Log in</p>
              </Link>
            </div>
          )}
        </nav>
        <nain className="p-4">
          <Outlet />
        </nain>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
