import React, { useContext, useState } from "react";
import "./AddPost.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../Authentication/AuthProvider";

const AddPost = () => {
  const { username, id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [content, setContent] = useState("");

  const changePost = (e) => {
    setContent(e.target.value);
  };

  const addPost = () => {
    let endpoint = "http://127.0.0.1:8000/tweets/tweet_api/";
    let data = {
      content: content,
      username: username ? username : user?.name,
      parent_username: username,
      id: id,
    };
    axios.post(endpoint, data).then((res) => {
      let responseData = res.data;
      console.log("ressss", responseData);
    });
  };

  const closeAddPostModal = () => {
    navigate("/");
  };

  return (
    // <div className="post-modal">
    // <div className="modal-overlay">
    <div className="modal-content">
      <span className="close-modal" onClick={closeAddPostModal}>
        &times;
      </span>
      {/* <textarea
        placeholder="Write your username here..."
        rows="2"
        name="username"
        cols="50"
        onChange={changePost}
      /> */}
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
    // </div>
    // </div>
  );
};

export default AddPost;
