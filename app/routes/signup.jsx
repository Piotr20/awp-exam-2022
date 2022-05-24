import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { getSession, commitSession } from "~/sessions.server.js";
import connectDb from "~/db/connectDb.server.js";

export async function action({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();

  if (form.get("password").trim() !== form.get("repeatPassword").trim()) {
    return json({ errorMessage: "Your passwords are not matching." }, { status: 400 });
  }

  if (form.get("password").trim()?.length < 8) {
    return json({ errorMessage: "Your password has to have at least 8 characters" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(form.get("password").trim(), 10);

  try {
    const user = await db.models.User.create({
      name: form.get("name"),
      role: form.get("role"),
      password: hashedPassword,
    });
    if (user) {
      session.set("userId", user._id);
      // TODO: Return a redirect to the home page which sets a cookie that commits the session
      return null;
    } else {
      return json({ errorMessage: "User couldn't be created" }, { status: 400 });
    }
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
  // TODO: Check if the session has a userId, and if so; redirect to the homepage
  return null;
}

export default function SignUp() {
  const actionData = useActionData();

  return (
    <div className="m-3">
      <h2>Sign Up</h2>
      {actionData?.errorMessage ? (
        <p className="text-red-500 font-bold my-3">{actionData.errorMessage}</p>
      ) : null}
      <Form method="post" className="text-inherit">
        <Input type="text" name="name" id="name" placeholder="Name" />
        <Input type="email" name="email" id="email" placeholder="Email address" />
        <Input type="password" name="password" id="password" placeholder="Password" />
        <Input type="password" name="repeatPassword" id="repeatPassword" placeholder="Repeat password" />
        <div className="flex">
          <div className="flex items-center px-2">
            <label htmlFor="role">Student</label>
            <input type="radio" name="role" value="student" defaultChecked className="ml-3" />
          </div>
          <div className="flex items-center px-2">
            <label htmlFor="role">Company</label>
            <input type="radio" name="role" value="company" className="ml-3" />
          </div>
        </div>

        <div className="flex flex-row items-center gap-3">
          <button type="submit" className="my-3 p-2 border rounded">
            Sign up
          </button>
          <span className="italic">or</span>
          <Link to="/login" className="underline">
            Log in
          </Link>
        </div>
      </Form>
    </div>
  );
}

function Input({ ...rest }) {
  return (
    <input
      {...rest}
      className="block my-3 border rounded px-2 py-1 w-full lg:w-1/2 bg-white border-zinc-300"
    />
  );
}
