import React from "react";
import "./Post.css";

const Post = ({ username, timestamp, content }) => {
  return (
    <div className="x-post">
      <div className="user-info">
        <img
          className="avatar"
          src="https://via.placeholder.com/50"
          alt="User Avatar"
        />
        <div className="user-details">
          <p className="username">{username}</p>
          <p className="timestamp">{timestamp}</p>
        </div>
      </div>
      <p className="post-content">{content}</p>
      <div className="actions">
        <button className="like-button">Like</button>
        <button className="share-button">Share</button>
      </div>
    </div>
  );
};

export default Post;
