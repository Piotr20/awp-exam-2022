import { useState } from "react";
import { Form, useActionData } from "@remix-run/react";
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
      imageUrl: form.get("imageUrl"),
      description: form.get("description"),
      tags: tags,
      createdBy: userId,
    });
    return redirect(`/company/${newCompanyPost._id}`);
  } catch (error) {
    return json({ errors: error.errors, values: Object.fromEntries(form) }, { status: 400 });
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Company Post</h1>
      <Form method="post">
        <label htmlFor="title" className="block font-semibold mb-1">
          Title:
        </label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Title"
          defaultValue={actionData?.values.title}
          className={[
            "block my-3 border rounded px-2 py-1 w-full lg:w-1/2 bg-white border-zinc-300",
            actionData?.errors.title && "border-2 border-red-500",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        {actionData?.errors.title && (
          <p className="text-red-500 mt-1 mb-0">{actionData.errors.title.message}</p>
        )}
        <label htmlFor="imageUrl" className="block font-semibold mb-1">
          Image Url:
        </label>
        <input
          type="text"
          name="imageUrl"
          id="imageUrl"
          placeholder="Image Url"
          defaultValue={actionData?.values.imageUrl}
          className={[
            "block my-3 border rounded px-2 py-1 w-full lg:w-1/2 bg-white border-zinc-300",
            actionData?.errors.imageUrl && "border-2 border-red-500",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        <label htmlFor="description" className="block font-semibold mb-1">
          Description:
        </label>
        <input
          type="text"
          name="description"
          id="description"
          placeholder="description"
          defaultValue={actionData?.values.description}
          className={[
            "block my-3 border rounded px-2 py-1 w-full lg:w-1/2 bg-white border-zinc-300",
            actionData?.errors.description && "border-2 border-red-500",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        <label htmlFor="tags">Tags</label>

        {tags?.map((tag, key) => {
          return <input key={key} type="hidden" name="tags" defaultValue={JSON.stringify(tag)} />;
        })}
        <MultiSelect
          className=" w-1/4"
          options={options}
          value={tags}
          onChange={setTags}
          labelledBy="Select"
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded"
        >
          Save
        </button>
      </Form>
    </div>
  );
}
