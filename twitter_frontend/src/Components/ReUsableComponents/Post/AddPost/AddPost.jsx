import React, { useState } from "react";
import "./AddPost.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddPost = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({
    content: "",
    username: "",
  });
  const changePost = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  const addPost = () => {
    let endpoint = "http://127.0.0.1:8000/tweets/tweet_api/";
    let data = post;
    axios.post(endpoint, data).then((res) => {
      let responseData = res.data;
    });
  };
  const closeAddPostModal = () => {
    navigate("/");
  };
  return (
    <div className="post-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <span className="close-modal" onClick={closeAddPostModal}>
            &times;
          </span>
          <h2>Create a Post</h2>
          <textarea
            placeholder="Write your username here..."
            rows="2"
            name="username"
            cols="50"
            onChange={changePost}
          />
          <textarea
            placeholder="Write your post here..."
            rows="4"
            name="content"
            cols="50"
            onChange={changePost}
          />
          <button className="post-button" onClick={addPost}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
