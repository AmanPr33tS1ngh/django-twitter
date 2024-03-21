import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import axios from "../../Redux/Axios/axios";
import Post from "../../ReUsableComponents/Post/Post";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.reducer.reducer);
  const [tweets, setTweets] = useState([]);
  const [activeTab, setActiveTab] = useState("For you");

  useEffect(() => {
    getTweets();
  }, [activeTab]);

  const getTweets = () => {
    let endpoint = "http://127.0.0.1:8000/tweets/get_home_tweets/";
    const data = {
      type: activeTab,
    };
    axios.post(endpoint, data).then((res) => {
      let responseData = res.data;
      console.log("HOme resss", responseData);
      setTweets(responseData.tweets);
    });
  };

  const actions = (e, post, action_type) => {
    // console.log("post, action_type, ", post, action_type);
    e.stopPropagation();
    if (action_type === "bookmark" || action_type === "like") {
      let endpoint = `http://127.0.0.1:8000/tweets/take_action/`;
      if (!user?.username) return;
      axios
        .post(endpoint, {
          tweet_id: post?.id,
          user: user?.username,
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
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={'ml-10'}>{tweets.map((tweet) => (
        <Post post={tweet} actions={actions} />
      ))}</div>
    </div>
  );
};

export default Home;
