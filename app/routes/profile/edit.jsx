import { useLoaderData, useCatch, Form } from "@remix-run/react";
import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { getSession, commitSession } from "~/sessions.server.js";

export async function loader({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");
  console.log(userId);
  const user = await db.models.User.findById(userId);
  return json(user);
}

export default function EditProfile() {
  const user = useLoaderData();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">EDIT PAGE</h1>

      <Form className="flex flex-col">
        <label htmlFor="name">Profile name</label>
        <input name="name" placeholder={user?.name}></input>

        <label htmlFor="email">Email</label>
        <input name="email" type="email" placeholder={user?.email}></input>

        <label htmlFor="bio">Bio</label>
        <input name="bio" type="text" placeholder={user?.bio}></input>
      </Form>
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
