import { Links, Link, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import styles from "~/tailwind.css";
import { BsFillBookmarkFill } from "@react-icons/all-files/bs/BsFillBookmarkFill";
import { AiFillHome } from "@react-icons/all-files/ai/AiFillHome";
import { FaUser } from "@react-icons/all-files/fa/FaUser";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export function meta() {
  return {
    charset: "utf-8",
    title: "Remix + MongoDB",
    viewport: "width=device-width,initial-scale=1",
  };
}

export default function App() {
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
        <nav className="w-full lg:h-screen group lg:w-24 lg:hover:w-48 lg:transition-all lg:duration-300 cursor-pointer fixed lg:static bottom-0 left-0 px-12 py-6 lg:px-6 bg-custom-black">
          <ul className="flex justify-between lg:flex-col lg:items-center">
            <li className="lg:my-3">
              <Link className="flex items-center " to="/">
                <AiFillHome className="w-8 h-8 text-white " />
                <p className="text-white pl-2 text-xl hidden opacity-0 transition-all duration-300 group-hover:block group-hover:opacity-100">
                  Home
                </p>
              </Link>
            </li>
            <li className="lg:my-3">
              <Link className="flex items-center" to="/">
                <BsFillBookmarkFill className="w-8 h-8 text-white " />
                <p className="text-white pl-2 text-xl hidden group-hover:block">Saved</p>
              </Link>
            </li>
            <li className="lg:my-3">
              <Link className="flex" to="/profile">
                <FaUser className="w-8 h-8 text-white" />
                <p className="text-white pl-2 text-xl hidden group-hover:block">Profile</p>
              </Link>
            </li>
          </ul>
        </nav>
        <nain>
          <Outlet />
        </nain>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
