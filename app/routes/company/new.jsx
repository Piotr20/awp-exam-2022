import { Form, useActionData } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  try {
    const newCompanyPost = await db.models.CompanyPosts.create({
      title: form.get("title"),
      imageUrl: form.get("imageUrl"),
    });
    return redirect(`/company/${newCompanyPost._id}`);
  } catch (error) {
    return json({ errors: error.errors, values: Object.fromEntries(form) }, { status: 400 });
  }
}

export default function CreateCompanyPost() {
  const actionData = useActionData();
  return (
    <div>
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
          defaultValue={actionData?.values.title}
          className={[
            "block my-3 border rounded px-2 py-1 w-full lg:w-1/2 bg-white border-zinc-300",
            actionData?.errors.title && "border-2 border-red-500",
          ]
            .filter(Boolean)
            .join(" ")}
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
