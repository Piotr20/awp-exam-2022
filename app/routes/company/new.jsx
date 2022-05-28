import { useState } from "react";
import { Form, useActionData, useCatch } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { getSession } from "~/sessions.server.js";
import { MultiSelect } from "react-multi-select-component";

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();
  const userId = session.get("userId");
  const db = await connectDb();
  const stringifiedTags = form.getAll("tags");
  let tags = [];
  for (const stringifiedTag of stringifiedTags) {
    tags.push(JSON.parse(stringifiedTag));
  }
  try {
    const newCompanyPost = await db.models.CompanyPosts.create({
      title: form.get("title"),
      contactEmail: form.get("email"),
      contactPerson: form.get("contactPerson"),
      description: form.get("description"),
      education: form.get("education"),
      linkedin: form.get("linkedin"),
      tags: tags,
      imageUrl: form.get("imageUrl"),
      position: form.get("position"),
      createdBy: userId,
    });
    return redirect(`/company/${newCompanyPost._id}`);
  } catch (error) {
    return json(
      {
        errorMessage: error.message ?? error.errors?.map((error) => error.message).join(", "),
      },
      { status: 400 }
    );
  }
}

export default function CreateCompanyPost() {
  const actionData = useActionData();
  const [tags, setTags] = useState([]);
  const options = [
    { label: "Web developer", value: "Web developer" },
    { label: "UX designer", value: "UX designer" },
    { label: "UI designer", value: "UI designer" },
    { label: "SoMe specialist", value: "SoMe specialist" },
  ];
  return (
    <div className="p-4 lg:h-screen overflow-auto">
      <div className="w-full lg:w-1/3 px-4 pb-20">
        <h1 className="text-2xl font-bold mb-4">CREATE NEW POST</h1>
        <Form className="flex flex-col items-start my-5" method="post">
          <label htmlFor="title">Post title</label>
          <Input type="text" className="w-full" name="title" placeholder="Post title" />
          <label htmlFor="imageUrl">Post image link</label>
          <Input type="text" className="w-full" name="imageUrl" placeholder="Posting image link" />
          <label htmlFor="contactPerson">Contact person</label>
          <Input className="w-full" name="contactPerson" type="text" placeholder="Contact person" />
          <label htmlFor="email">Contact email</label>
          <Input className="w-full" name="email" type="email" placeholder="Contact email" />
          <label htmlFor="tags">Tags</label>
          <MultiSelect
            className="w-full"
            options={options}
            value={tags}
            onChange={setTags}
            labelledBy="Select"
          />
          <label htmlFor="position">Position</label>
          <Input className="w-full" name="position" type="text" placeholder="Offered position"></Input>
          <label htmlFor="education">Education required</label>
          <Input className="w-full" name="education" type="text" placeholder="Required education"></Input>
          <label htmlFor="description">Description</label>
          <Input className="w-full" name="description" type="text" placeholder="Post description"></Input>
          <label htmlFor="linkedin">Linkedin</label>
          <Input className="w-full" name="linkedin" type="text" placeholder="Linkedin profile link"></Input>
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
function Input({ className, ...rest }) {
  return (
    <input
      {...rest}
      className={`${className} block mb-3 mt-1 border rounded px-2 py-2 bg-white border-zinc-300 `}
    />
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
