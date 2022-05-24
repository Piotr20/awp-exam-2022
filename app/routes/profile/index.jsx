import { useLoaderData, useCatch } from "@remix-run/react";
import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { getSession, commitSession } from "~/sessions.server.js";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-male-sprites/dist/";

export async function loader({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");
  console.log(userId);
  const user = await db.models.User.findById(userId);
  return json(user);
}

export default function ProfilePage() {
  const user = useLoaderData();

  let svg = createAvatar(style, {
    seed: `${user._id}`,
  });
  return (
    <div>
      <span className="w-12 flex" dangerouslySetInnerHTML={{ __html: svg }}></span>
      <h1 className="text-2xl font-bold mb-4">{user?.name}</h1>
      <h2>{user?.role}</h2>
      <ul>
        <li className="lg:my-3">{"Bio"}</li>
        <li>{user.createdAt.split("T")[0]}</li>
      </ul>
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
