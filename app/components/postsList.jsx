import { Link } from "@remix-run/react";
import Avatar from "./avatar";

const PostsList = ({ posts }) => {
  return (
    <>
      {posts?.map((post) => {
        return (
          <div key={post._id} className="my-8 lg:my-0 bg-custom-white shadow-md lg:max-h-[464px]">
            {post?.imageUrl ? (
              <img className="w-full h-48 object-scale-down" src={post.imageUrl} alt="Post image" />
            ) : (
              <Avatar seedProp={post?.avatarImage} className="w-full h-48 object-scale-down justify-center" />
            )}
            <div className="p-4">
              <div className="w-full flex flex-wrap items-start min-h-20 max-h-20 overflow-hidden">
                {post?.tags.map((tag, key) => {
                  return (
                    <span
                      key={key}
                      className="font-bold bg-custom-salmon text-custom-white py-1 px-3 rounded-2xl mr-2 mb-2"
                    >
                      {tag.label}
                    </span>
                  );
                })}
              </div>
              <h2 className="text-2xl font-bold pb-2 min-h-18 max-h-18">{post?.title || post?.name}</h2>
              <p
                className={`${
                  post?.bio?.length > 30 || post?.description?.length > 30
                    ? " text-ellipsis whitespace-nowrap overflow-hidden"
                    : ""
                } text-base min-h-6 max-h-6`}
              >
                {post?.bio || post?.description}
              </p>
              <p className="pb-3 pt-1 font-bold opacity-30">{post?.createdAt.split("T")[0]}</p>
              <Link
                to={`/${post?.createdBy ? `company/${post?._id}` : `profile/${post?._id}`}`}
                className="bg-custom-black text-custom-white py-2 px-4"
              >
                View profile
              </Link>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default PostsList;
