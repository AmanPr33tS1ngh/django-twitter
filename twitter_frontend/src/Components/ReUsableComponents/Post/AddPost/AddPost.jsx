import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../Redux/Axios/axios";
import { useSelector } from "react-redux";
import FileUploadComponent from "../File/FileUploader";

const AddPost = ({ showClose }) => {
  const { username, id } = useParams();
  const user = useSelector((state) => state.reducer);
  const navigate = useNavigate();
  const [content, setContent] = useState("");

  const changePost = (e) => {
    setContent(e.target.value);
  };

  const addPost = (file) => {
    let endpoint = "http://127.0.0.1:8000/tweets/tweet_api/";
    const formData = new FormData();
    formData.append("content", content);
    formData.append("parent_username", username);
    formData.append("id", id);
    formData.append("file", file);

    axios.post(endpoint, formData).then((res) => {
      let responseData = res.data;
      // if (responseData.success) navigate("/");
    });
  };

  const closeAddPostModal = () => {
    navigate("/");
  };

  return (
    <div className="bg-white p-8">
      {showClose ? (
        <span
          className="absolute top-0 right-0 text-xl cursor-pointer"
          onClick={closeAddPostModal}
        >
          &times;
        </span>
      ) : null}
      <textarea
        className={
          "block w-full p-5 m-2 border border-[rgb(107 118 128 / 22%)]-500"
        }
        placeholder="Write your post here..."
        rows="4"
        name="content"
        cols="50"
        onChange={changePost}
      />
      <FileUploadComponent addPost={addPost} />
    </div>
  );
};

export default AddPost;
