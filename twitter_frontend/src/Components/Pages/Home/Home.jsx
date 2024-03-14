import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import axios from "axios";
import Post from "../../ReUsableComponents/Post/Post";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Authentication/AuthProvider";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [tweets, setTweets] = useState([]);
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
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
  const actions = (e, post, action_type) => {
    // console.log("post, action_type, ", post, action_type);
    e.stopPropagation();
    if (action_type === "bookmark" || action_type == "like") {
      let endpoint = `http://127.0.0.1:8000/tweets/take_action/`;
      // console.log("use", user, user.name);
      if (!user.name) return;
      axios
        .post(endpoint, {
          tweet_id: post?.id,
          user: user?.name,
          action_type: action_type,
        })
        .then((res) => {
          let responseData = res.data;
          // console.log(responseData);
          // setTweets(responseData.tweets);
        });
    } else if (action_type === "comment") {
      navigate(`/post/${post?.user?.username}/${post?.id}`);
    }
  };
  return (
    <div>
      <Navbar />
      <button onClick={logoutUser}>LOG OUT</button>
      {/* {console.log("tweets", tweets)} */}
      {tweets.map((tweet) => (
        <Post post={tweet} actions={actions} />
      ))}
    </div>
  );
};

export default Home;
