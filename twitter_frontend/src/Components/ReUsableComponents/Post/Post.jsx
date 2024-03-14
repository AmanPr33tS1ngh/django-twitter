import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faComment,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Post = ({ post, actions }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white p-4 rounded-md shadow-md mb-4 transition-colors duration-300 hover:bg-red-50 cursor-pointer"
      onClick={() => navigate(`/status/${post?.id}`)}
    >
      <div className="flex items-center">
        <img
          className="w-12 h-12 rounded-full mr-4"
          src="https://via.placeholder.com/50"
          alt="User Avatar"
        />
        <div className="font-bold">
          <p className="text-lg font-bold">{post?.user?.full_name}</p>
          <p>@{post?.user?.username}</p>
          <p className="text-sm text-gray-500">{post?.timestamp}</p>
        </div>
      </div>
      <p className="mt-4 text-base text-gray-700">{post?.content}</p>
      <div className="justify-around mt-4">
        <button
          className={`mr-4 text-center ${
            post.is_liked ? "text-pink-600" : "text-gray-400"
          } font-light text-sm`}
          onClick={(e) => actions(e, post, "like")}
        >
          <FontAwesomeIcon icon={faHeart} /> {post?.like_count}
        </button>
        <button
          className="mr-4 text-center text-gray-400 font-light text-sm"
          onClick={(e) => actions(e, post, "comment")}
        >
          <FontAwesomeIcon icon={faComment} /> {post?.replies_count}
        </button>
        <button
          className={`mr-4 text-center ${
            post.is_bookmarked ? "text-blue-500" : "text-gray-400"
          } font-light text-sm`}
          onClick={(e) => actions(e, post, "bookmark")}
        >
          <FontAwesomeIcon icon={faBookmark} />
          {/* {post?.bookmark_count} */}
        </button>
      </div>
      <p className="mt-8 font-light text-gray-500 text-xs">
        {post?.post_duration}
      </p>
    </div>
  );
};

export default Post;
