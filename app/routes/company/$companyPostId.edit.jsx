import { useState } from "react";
import { useLoaderData, useCatch, Form, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { getSession, commitSession } from "~/sessions.server.js";
import Avatar from "../../components/avatar";
import { MultiSelect } from "react-multi-select-component";

export async function action({ request, params }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();
  const userId = session.get("userId");

  try {
    const stringifiedTags = form.getAll("tags");
    let tags = [];
    for (const stringifiedTag of stringifiedTags) {
      tags.push(JSON.parse(stringifiedTag));
    }
    const companyPost = await db.models.CompanyPosts.findByIdAndUpdate(params.companyPostId, {
      title: form.get("title"),
      contactEmail: form.get("email"),
      contactPerson: form.get("contactPerson"),
      description: form.get("description"),
      education: form.get("education"),
      linkedin: form.get("linkedin"),
      tags: tags,
      imageUrl: form.get("imageUrl"),
      position: form.get("position"),
    });
    return redirect(`/company/${companyPost._id}`);
  } catch (error) {
    return json({ errorMessage: "Profile couldn't be updated" }, { status: 400 });
  }
}

export async function loader({ request, params }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));

  if (session.get("userId")) {
    const userId = session.get("userId");
    const companyPosts = await db.models.CompanyPosts.findById(params.companyPostId);
    return json(companyPosts);
  } else {
    return redirect("/");
  }
}

export default function EditComapnyProfile() {
  const user = useLoaderData();
  const actionData = useActionData();
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
      <div className="w-full lg:w-1/3 px-4 pb-20">
        <h1 className="text-2xl font-bold mb-4">EDIT POST</h1>
        <Form className="flex flex-col items-start my-5" method="post">
          <label htmlFor="title">Post title</label>
          <Input
            type="text"
            className="w-full"
            name="title"
            defaultValue={user?.title}
            placeholder={user?.title}
          />
          <label htmlFor="imageUrl">Post image link</label>
          <Input
            type="text"
            className="w-full"
            name="imageUrl"
            defaultValue={user?.imageUrl}
            placeholder={user?.imageUrl}
          />
          <label htmlFor="contactPerson">Contact person</label>
          <Input
            className="w-full"
            name="contactPerson"
            type="text"
            defaultValue={user?.contactPerson}
            placeholder={user?.contactPerson}
          />
          <label htmlFor="email">Contact email</label>
          <Input
            className="w-full"
            name="email"
            type="email"
            defaultValue={user?.contactEmail}
            placeholder={user?.contactEmail}
          />
          <label htmlFor="tags">Tags</label>
          <MultiSelect
            className="w-full"
            options={options}
            value={tags}
            onChange={setTags}
            labelledBy="Select"
          />
          <label htmlFor="position">Position</label>
          <Input
            className="w-full"
            name="position"
            type="text"
            defaultValue={user?.position}
            placeholder={user?.position}
          ></Input>
          <label htmlFor="education">Education required</label>
          <Input
            className="w-full"
            name="education"
            type="text"
            defaultValue={user?.education}
            placeholder={user?.education}
          ></Input>
          <label htmlFor="description">Description</label>
          <Input
            className="w-full"
            name="description"
            type="text"
            defaultValue={user?.description}
            placeholder={user?.description}
          ></Input>
          <label htmlFor="linkedin">Linkedin</label>
          <Input
            className="w-full"
            name="linkedin"
            type="text"
            defaultValue={user?.linkedin}
            placeholder={user?.linkedin}
          ></Input>
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
      className={`${className} block mb-3 mt-1 border rounded px-2 py-2 bg-white border-zinc-300 `}
    />
  );
}
