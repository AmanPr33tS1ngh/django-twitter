import React from "react";
import "./Post.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faComment,
  faHeart,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Post = ({ post, actions }) => {
  const navigate = useNavigate();
  return (
    <div className="x-post" onClick={() => navigate(`/status/${post?.id}`)}>
      <div className="user-info">
        <img
          className="avatar"
          src="https://via.placeholder.com/50"
          alt="User Avatar"
        />
        <div className="user-details">
          <p className="username">{post?.user?.full_name}</p>
          <p>@{post?.user?.username}</p>
          <p className="timestamp">{post?.timestamp}</p>
        </div>
      </div>
      <p className="post-content">{post?.content}</p>
      <div className="actions">
        <button className="m-1rem" onClick={(e) => actions(e, post, "like")}>
          <FontAwesomeIcon icon={faHeart} /> {post?.like_count}
        </button>
        {/* <button className="m-1rem" onClick={(e) => actions(e, post, "share")}>
          <FontAwesomeIcon icon={faShare} />
        </button> */}
        <button
          className="m-1rem"
          onClick={(e) => actions(e, post, "comment")}
          // onClick={(e) => comment(e, post?.id)}
        >
          <FontAwesomeIcon icon={faComment} /> {post?.replies_count}
        </button>
        <button
          className="m-1rem"
          onClick={(e) => actions(e, post, "bookmark")}
        >
          <FontAwesomeIcon icon={faBookmark} />
        </button>
      </div>
      <p className="time">{post?.post_duration}</p>
    </div>
  );
};

export default Post;
