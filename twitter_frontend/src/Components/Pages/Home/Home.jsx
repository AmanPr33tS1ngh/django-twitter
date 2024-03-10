import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import axios from "axios";
import Post from "../../ReUsableComponents/Post/Post";
import AddPost from "../../ReUsableComponents/Post/AddPost/AddPost";
import { LOGOUT } from "../../Redux/ActionTypes/ActionTypes";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Authentication/AuthProvider";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [tweets, setTweets] = useState([]);
  const { logoutUser } = useContext(AuthContext);

  useEffect(() => {
    getTweets();
  }, []);
  const getTweets = () => {
    let endpoint = "http://127.0.0.1:8000/tweets/tweet_api/";
    axios.get(endpoint).then((res) => {
      let responseData = res.data;
      setTweets(responseData.tweets);
    });
  };
  const actions = (e, id, action_type) => {
    e.stopPropagation();
    if (action_type === "bookmark" || action_type == "like") {
      console.log("id", id);
      let endpoint = `http://127.0.0.1:8000/tweets/take_action/`;
      console.log("use", user, user.name);
      if (!user.name) return;
      axios
        .post(endpoint, {
          tweet_id: id,
          user: user?.name,
          action_type: action_type,
        })
        .then((res) => {
          let responseData = res.data;
          console.log(responseData);
          // setTweets(responseData.tweets);
        });
    }
  };
  return (
    <div>
      {window.location.href.includes("compose/post") ? <AddPost /> : null}
      <Navbar />
      <button onClick={logoutUser}>LOG OUT</button>
      {tweets.map((tweet) => (
        <Post post={tweet} actions={actions} />
      ))}
    </div>
  );
};

export default Home;
