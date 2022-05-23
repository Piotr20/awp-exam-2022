import { useLoaderData, Link } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";

export default function Login() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Login</h1>
    </div>
  );
}
