import { useLoaderData, useCatch, Form } from "@remix-run/react";
import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { getSession, commitSession } from "~/sessions.server.js";
import bcrypt from "bcryptjs";

export async function action({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();
  const userId = session.get("userId");
  const hashedPassword = await bcrypt.hash(form.get("password").trim(), 10);

  try {
    const user = await db.models.User.findByIdAndUpdate(userId, {
      name: form.get("name"),
      email: form.get("email"),
      bio: form.get("bio"),
      tags: form.get("tags"),
      password: hashedPassword,
    });
    return null;
  } catch (error) {
    return json({ errorMessage: "Profile couldn't be updated" }, { status: 400 });
  }
}

export async function loader({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");
  const user = await db.models.User.findById(userId);
  return json(user);
}

export default function EditProfile() {
  const user = useLoaderData();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">EDIT PAGE</h1>

      <Form className="flex flex-col my-5" method="post">
        <label htmlFor="name">Profile name</label>
        <input className=" mb-5" name="name" placeholder={user?.name}></input>

        <label htmlFor="email">Email</label>
        <input className=" mb-5" name="email" type="email" placeholder={user?.email}></input>

        <label htmlFor="password">Password</label>
        <input className=" mb-5" name="password" type="password" placeholder={"New password"}></input>

        <label htmlFor="repeatPassword">Repeat password</label>
        <input
          className=" mb-5"
          name="repeatPassword"
          type="password"
          placeholder={"Repeat new password"}
        ></input>

        <label htmlFor="bio">Bio</label>
        <input className=" mb-5" name="bio" type="text" placeholder={user?.bio}></input>

        <label htmlFor="name">Tags</label>
        <input className=" mb-5" name="tags" placeholder={user?.tags}></input>

        <button type="submit" className="my-3 p-2 border rounded">
          Save
        </button>
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
