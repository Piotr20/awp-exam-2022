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
      email: form.get("email"),
      avatarImage: "default",
      password: hashedPassword,
    });
    if (user) {
      session.set("userId", user._id);
      return redirect("/profile/edit", {
        secret: process.env.COOKIE_SECRET,
        status: 302,
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
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
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("userId")) {
    return redirect("/");
  } else {
    return null;
  }
}

export default function SignUp() {
  const actionData = useActionData();

  return (
    <div className="p-4 flex items-center justify-center h-screen">
      <div className="px-4 lg:px-0 w-full lg:w-1/4">
        <h2 className="text-3xl font-bold text-center mb-4">Sign Up</h2>
        {actionData?.errorMessage ? (
          <p className="text-red-500 font-bold my-3">{actionData.errorMessage}</p>
        ) : null}
        <Form method="post" className="text-inherit flex flex-col items-center">
          <label htmlFor="name" className="self-start">
            Name:
          </label>
          <Input type="text" name="name" id="name" placeholder="Name" className="w-full" />
          <label htmlFor="email" className="self-start">
            Email:
          </label>
          <Input type="email" name="email" id="email" placeholder="Email address" className="w-full" />
          <label htmlFor="password" className="self-start">
            Password:
          </label>
          <Input type="password" name="password" id="password" placeholder="Password" className="w-full" />
          <label htmlFor="repeatPassword" className="self-start">
            Repeat password:
          </label>
          <Input
            type="password"
            name="repeatPassword"
            id="repeatPassword"
            placeholder="Repeat password"
            className="w-full"
          />
          <div className="flex">
            <div className="flex items-center px-2">
              <input
                id="role-student"
                type="radio"
                name="role"
                value="student"
                defaultChecked
                className="mr-3 peer"
              />
              <label className="peer-checked:font-bold cursor-pointer" htmlFor="role-student">
                Student
              </label>
            </div>
            <div className="flex items-center px-2">
              <input
                id="role-company"
                type="radio"
                name="role"
                value="company"
                className="mr-3 group-checked:font-bold peer"
              />
              <label className=" peer-checked:font-bold cursor-pointer" htmlFor="role-company">
                Company
              </label>
            </div>
          </div>

          <div className="flex flex-row items-center gap-3">
            <button type="submit" className="my-3 p-2 px-4 border rounded bg-custom-black text-custom-white">
              Sign up
            </button>
            <span className="italic">or</span>
            <Link to="/login" className="underline">
              Log in
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
