import { useLoaderData, Link } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";

export async function loader() {
  const db = await connectDb();
  const users = await db.models.User.find();
  return users;
}

export default function Index() {
  const users = useLoaderData();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Remix + Mongoose</h1>
      <h2 className="text-lg font-bold mb-3">Here are a few of my favorite users:</h2>
      <ul className="ml-5 list-disc">
        {users.map((user) => {
          return (
            <li key={user._id}>
              <Link to={`/users/${user._id}`} className="text-blue-600 hover:underline">
                {user.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
