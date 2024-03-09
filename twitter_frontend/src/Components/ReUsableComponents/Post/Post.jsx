import React from "react";
import "./Post.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faBookBookmark } from "@fortawesome/free-solid-svg-icons";

const Post = (post, bookmark) => {
  console.log(post, bookmark);
  return (
    <div className="x-post">
      <div className="user-info">
        <img
          className="avatar"
          src="https://via.placeholder.com/50"
          alt="User Avatar"
        />
        <div className="user-details">
          {console.log("poststtt", post)}
          <p className="username">{post?.user?.full_name}</p>
          <p>@{post?.user?.username}</p>
          <p className="timestamp">{post?.timestamp}</p>
        </div>
      </div>
      <p className="post-content">{post?.content}</p>
      <div className="actions">
        <button className="like-button">Like</button>
        <button className="share-button">Share</button>
        <button onClick={() => bookmark(post?.id)}>
          <FontAwesomeIcon icon={faBookmark} />
        </button>
      </div>
    </div>
  );
};

export default Post;
