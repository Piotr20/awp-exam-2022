import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { getSession, commitSession } from "~/sessions.server.js";
import connectDb from "~/db/connectDb.server.js";

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const db = await connectDb();
  const form = await request.formData();

  const user = await db.models.User.findOne({
    email: form.get("email"),
  });

  let isCorrectPassword = false;

  if (user) {
    isCorrectPassword = await bcrypt.compare(form.get("password").trim(), user.password);
  }

  if (user && isCorrectPassword) {
    session.set("userId", user._id);
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    return json({ errorMessage: "User not found or password didn't match" }, { status: 401 });
  }
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return json({
    userId: session.get("userId"),
  });
}

export default function Login() {
  const { userId } = useLoaderData();
  const actionData = useActionData();

  if (userId) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold">You are already logged in as user id {userId}.</h2>
        <Form method="post" action="/logout">
          <button type="submit" className="my-3 p-2 px-4 border rounded bg-custom-black text-custom-white">
            Logout
          </button>
        </Form>
      </div>
    );
  }
  return (
    <div className="p-4 flex flex-col items-center justify-center h-screen ">
      <div className="px-4 lg:px-0 w-full lg:w-1/4">
        <h2 className="text-3xl font-bold text-center mb-4">Log in</h2>
        {actionData?.errorMessage ? (
          <p className="text-red-500 font-bold my-3">{actionData.errorMessage}</p>
        ) : null}
        <Form method="post" className="text-inherit flex flex-col items-center">
          <label htmlFor="email" className="self-start">
            Email:
          </label>
          <Input type="email" name="email" id="email" placeholder="Email" className="w-full" />
          <label htmlFor="password" className="self-start">
            Password:
          </label>
          <Input type="password" name="password" id="password" placeholder="Password" className="w-full" />
          <div className="flex flex-row items-center gap-3">
            <button type="submit" className="my-3 p-2 px-4 border rounded bg-custom-black text-custom-white">
              Log in
            </button>
            <span className="italic">or</span>
            <Link to="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

function Input({ className, ...rest }) {
  return (
    <input
      {...rest}
      className={`${className} block mb-3 mt-1 border rounded px-2 py-1 bg-white border-zinc-300 `}
    />
  );
}
