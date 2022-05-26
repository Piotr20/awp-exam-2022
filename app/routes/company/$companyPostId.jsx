import { useLoaderData, useCatch, Form, Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { getSession, destroySession } from "~/sessions.server.js";
import Avatar from "../../components/avatar";

export async function action({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  try {
    const user = await db.models.User.findByIdAndDelete({ _id: userId });

    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  } catch (error) {
    return json({ errorMessage: "Profile couldn't be deleted" }, { status: 400 });
  }
}

export async function loader({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("userId")) {
    const userId = session.get("userId");

    const user = await db.models.User.findById(userId);
    return json(user);
  } else {
    return redirect("/");
  }
}

export default function CompanyPostDetailPage() {
  const user = useLoaderData();

  return <div>Comapny post details Page</div>;
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
