import { useLoaderData, useCatch } from "@remix-run/react";
import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ params }) {
  const db = await connectDb();
  const user = await db.models.User.findById(params.userId);
  if (!user) {
    throw new Response(`Couldn't find user with id ${params.userId}`, {
      status: 404,
    });
  }
  return json(user);
}

export default function UserPage() {
  const user = useLoaderData();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{user.name}</h1>
      <code>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </code>
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
