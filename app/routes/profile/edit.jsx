import { useState } from "react";
import { useLoaderData, useCatch, Form, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { getSession, commitSession } from "~/sessions.server.js";
import bcrypt from "bcryptjs";
import Avatar from "../../components/avatar";
import { MultiSelect } from "react-multi-select-component";

export async function action({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();
  const userId = session.get("userId");
  const hashedPassword = await bcrypt.hash(form.get("password").trim(), 10);

  if (form.get("password").trim() !== form.get("repeatPassword").trim()) {
    return json({ errorMessage: "Your passwords are not matching." }, { status: 400 });
  }

  if (form.get("password").trim()?.length < 8) {
    return json({ errorMessage: "Your password has to have at least 8 characters" }, { status: 400 });
  }

  try {
    const stringifiedTags = form.getAll("tags");
    let tags = [];
    for (const stringifiedTag of stringifiedTags) {
      tags.push(JSON.parse(stringifiedTag));
    }
    const user = await db.models.User.findByIdAndUpdate(userId, {
      name: form.get("name"),
      email: form.get("email"),
      bio: form.get("bio"),
      education: form.get("education"),
      linkedin: form.get("linkedin"),
      portfolio: form.get("portfolio"),
      tags: tags,
      avatarImage: form.get("avatar"),
      password: hashedPassword,
    });
    return redirect("/profile");
  } catch (error) {
    return json({ errorMessage: "Profile couldn't be updated" }, { status: 400 });
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

export default function EditProfile() {
  const actionData = useActionData();
  const user = useLoaderData();
  const [avatarSeed, setAvatarSeed] = useState(user?.avatarImage);
  const [tags, setTags] = useState(user?.tags);
  const options = [
    { label: "Web developer", value: "Web developer" },
    { label: "UX designer", value: "UX designer" },
    { label: "UI designer", value: "UI designer" },
    { label: "SoMe specialist", value: "SoMe specialist" },
  ];

  return (
    <div className="p-4 lg:h-screen overflow-auto">
      <h1 className="text-2xl font-bold mb-4 pl-4">EDIT PROFILE PAGE</h1>
      <div className="w-full lg:w-1/3 px-4 pb-20">
        <Avatar seedProp={avatarSeed} className="w-full" />
        <button
          className="mt-2 py-2 px-4 bg-custom-black text-custom-white w-full"
          onClick={async () => {
            console.log(avatarSeed);
            setAvatarSeed(await bcrypt.hash(user?.avatarImage, 10));
          }}
        >
          Generate new avatar
        </button>
        <Form className="flex flex-col items-start my-5" method="post">
          <input type="hidden" className="mb-5" name="avatar" defaultValue={avatarSeed} />

          <label htmlFor="name">Profile name</label>
          <Input
            type="text"
            className="w-full"
            name="name"
            defaultValue={user?.name}
            placeholder={user?.name}
          />

          <label htmlFor="email">Email</label>
          <Input
            className="w-full"
            name="email"
            type="email"
            defaultValue={user?.email}
            placeholder={user?.email}
          />
          <label htmlFor="education">Education</label>
          <Input
            className="w-full"
            name="education"
            type="text"
            defaultValue={user?.education}
            placeholder={user?.education}
          />

          <label htmlFor="tags">Tags</label>
          <MultiSelect
            className=" w-full"
            options={options}
            value={tags}
            onChange={setTags}
            labelledBy="Select"
          />

          <label htmlFor="password">Password</label>
          <Input className="w-full" name="password" type="password" placeholder={"New password"} />
          <label htmlFor="repeatPassword">Repeat password</label>
          <Input
            className="w-full"
            name="repeatPassword"
            type="password"
            placeholder={"Repeat new password"}
          />

          <label htmlFor="bio">Bio</label>
          <Input className="w-full" name="bio" type="text" defaultValue={user?.bio} placeholder={user?.bio} />
          <label htmlFor="linkedin">Linkedin</label>
          <Input
            className="w-full"
            name="linkedin"
            type="text"
            defaultValue={user?.linkedin}
            placeholder={user?.linkedin}
          />
          <label htmlFor="portfolio">Portfolio</label>
          <Input
            className="w-full"
            name="portfolio"
            type="text"
            defaultValue={user?.portfolio}
            placeholder={user?.portfolio}
          />

          {tags?.map((tag, key) => {
            return <input key={key} type="hidden" name="tags" defaultValue={JSON.stringify(tag)} />;
          })}
          {actionData?.errorMessage ? (
            <p className="text-red-500 font-bold my-3">{actionData.errorMessage}</p>
          ) : null}
          <button
            type="submit"
            className="my-3 mt-5 p-2 px-4 border rounded bg-custom-black text-custom-white w-full lg:w-auto"
          >
            Save
          </button>
        </Form>
      </div>
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
function Input({ className, ...rest }) {
  return (
    <input
      {...rest}
      className={`${className} block mb-3 mt-1 border rounded px-2 py-1 bg-white border-zinc-300 `}
    />
  );
}
