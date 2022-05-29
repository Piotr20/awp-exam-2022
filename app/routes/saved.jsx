import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { getSession, commitSession } from "~/sessions.server.js";
import connectDb from "~/db/connectDb.server.js";

export async function action({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));

  try {
    const user = await db.models.User.create({
      password: hashedPassword,
    });

    return json({ errorMessage: "User couldn't be created" }, { status: 400 });
  } catch (error) {
    return json(
      {
        errorMessage: error.message ?? error.errors?.map((error) => error.message).join(", "),
      },
      { status: 400 }
    );
  }
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("userId")) {
    return redirect("/");
  } else {
    return null;
  }
}

export default function SavedProfiles() {
  const actionData = useActionData();

  return <div className="p-4">Saved page</div>;
}
