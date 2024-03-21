import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faComment,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";

const Post = ({ post, actions }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white p-4 rounded-md shadow-md mb-4 transition-colors duration-300 hover:bg-red-50 cursor-pointer"
      onClick={() => navigate(`/status/${post?.id}`)}
    >
      {console.log("postpostpostpost", post)}
      <div className="flex items-center">
        <img
          className="w-12 h-12 rounded-full mr-4"
          src="https://via.placeholder.com/50"
          alt="User Avatar"
        />
        {/* <div className="font-bold"> */}
        <p className="text-base font-bold">{post?.user?.full_name}</p>
        <p className="ml-1 text-sm text-gray-500">@{post?.user?.username}</p>
        <span className="flex justify-center items-center ml-1 text-sm text-gray-500 pb-2">
          .
        </span>
        <p className="text-sm text-gray-500 ml-1">{post?.post_duration}</p>
        {/* </div> */}
      </div>
      <p className="mt-4 text-base text-gray-700">{post?.content}</p>
      {post?.image ? (
        <img
          className="w-80 rounded-lg m-auto"
          src={`http://localhost:8000/media/${post?.image}`}
          alt="User Avatar"
        />
      ) : post?.video ? (
        <div>
          <ReactPlayer
            url={`http://localhost:8000${post?.video}`}
            controls
            width="100%"
            height="25rem"
            playing
          />
        </div>
      ) : null}
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
      {/* <p className="mt-8 font-light text-gray-500 text-xs">
        {post?.post_duration}
      </p> */}
    </div>
  );
};

export default Post;
