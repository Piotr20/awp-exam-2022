import { useState } from "react";
import { useLoaderData, useCatch, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { getSession, commitSession } from "~/sessions.server.js";
import bcrypt from "bcryptjs";
import Avatar from "../../components/avatar";
import Multiselect from "multiselect-react-dropdown";

export async function action({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();
  const userId = session.get("userId");
  const hashedPassword = await bcrypt.hash(form.get("password").trim(), 10);

  try {
    console.log(form.getAll("tags"));
    const user = await db.models.User.findByIdAndUpdate(userId, {
      name: form.get("name"),
      email: form.get("email"),
      bio: form.get("bio"),
      tags: form.get("tags"),
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
  const user = useLoaderData();
  const [avatarSeed, setAvatarSeed] = useState(user?.avatarImage);
  const [tags, setTags] = useState([]);
  const options = [
    { label: "Web developer", value: "Web developer" },
    { label: "UX designer", value: "UX designer" },
    { label: "UI designer", value: "UI designer" },
  ];
  function onSelect(selectedList, selectedItem) {
    setTags(selectedList);
    console.log(tags);
    return tags;
  }

  function onRemove(selectedList, removedItem) {
    setTags(selectedList);
    console.log(tags);
    return tags;
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">EDIT PAGE</h1>
      <Avatar seedProp={avatarSeed} />
      <button
        className="mb-5 flex py-2 px-4 bg-custom-black text-custom-white"
        onClick={async () => {
          setAvatarSeed(await bcrypt.hash(user?.avatarImage, 10));
        }}
      >
        Generate new avatar
      </button>
      <Form className="flex flex-col items-start my-5" method="post">
        <label htmlFor="avatar">Profile avatar</label>
        <input type="hidden" className="mb-5" name="avatar" defaultValue={avatarSeed} />

        <label htmlFor="name">Profile name</label>
        <input
          type="text"
          className="mb-5 border-2 border-custom-black"
          name="name"
          defaultValue={user?.name}
          placeholder={user?.name}
        />

        <label htmlFor="email">Email</label>
        <input
          className="border-2 border-custom-black mb-5"
          name="email"
          type="email"
          defaultValue={user?.email}
          placeholder={user?.email}
        />

        <label htmlFor="password">Password</label>
        <input
          className=" border-2 border-custom-black mb-5"
          name="password"
          type="password"
          defaultValue={user?.password}
          placeholder={"New password"}
        ></input>

        <label htmlFor="repeatPassword">Repeat password</label>
        <input
          className=" mb-5  border-2 border-custom-black"
          name="repeatPassword"
          type="password"
          defaultValue={user?.password}
          placeholder={"Repeat new password"}
        ></input>

        <label htmlFor="bio">Bio</label>
        <input
          className=" mb-5  border-2 border-custom-black"
          name="bio"
          type="text"
          defaultValue={user?.bio}
          placeholder={user?.bio}
        ></input>

        <label htmlFor="tags">Tags</label>
        <Multiselect
          options={options} // Options to display in the dropdown
          onSelect={onSelect} // Function will trigger on select event
          onRemove={onRemove} // Function will trigger on remove event
          displayValue="value" // Property name to display in the dropdown options
        />
        <input type="hidden" name="tags" defaultValue={JSON.stringify(tags)} />
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
