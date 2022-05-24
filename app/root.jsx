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
      <body className="pb-28 lg:pb-0 lg:pl-28">
        {/* <header className="pb-3 mb-4 border-b-2">
          <Link to="/" className="hover:underline text-blue-600">
            Home
          </Link>
          <Link to="/users/new" className="ml-3 hover:underline text-blue-600">
            New user
          </Link>
        </header> */}
        <nav className="w-full lg:h-full lg:w-24 fixed bottom-0 left-0 px-12 py-6 lg:px-6 bg-slate-700">
          <ul className="flex justify-between lg:flex-col lg:items-center">
            <li className="lg:my-3">
              <Link to="/">
                <AiFillHome className="w-8 h-8 text-white" />
              </Link>
            </li>
            <li className="lg:my-3">
              <BsFillBookmarkFill className="w-8 h-8 text-white " />
            </li>
            <li className="lg:my-3">
              <Link to="/profile">
                <FaUser className="w-8 h-8 text-white" />
              </Link>
            </li>
          </ul>
        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
