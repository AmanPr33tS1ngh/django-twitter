import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../Authentication/AuthProvider";

const AddPost = ({showClose}) => {
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
      // console.log("ressss", responseData);
    });
  };

  const closeAddPostModal = () => {
    navigate("/");
  };

  return (
    <div className="bg-white p-8">
      {showClose ? <span className="absolute top-0 right-0 text-xl cursor-pointer" onClick={closeAddPostModal}>
        &times;
      </span>:null}
      <textarea
          className={'block'}
        placeholder="Write your post here..."
        rows="4"
        name="content"
        cols="50"
        onChange={changePost}
      />
      <button className="bg-blue-500 text-white px-5 py-2 text-base cursor-pointer mt-4" onClick={addPost}>
        Post
      </button>
    </div>
  );
};

export default AddPost;
