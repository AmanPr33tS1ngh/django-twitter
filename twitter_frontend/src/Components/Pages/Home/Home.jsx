import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import axios from "../../Redux/Axios/axios";
import Post from "../../ReUsableComponents/Post/Post";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../../Redux/ActionTypes/ActionTypes";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.reducer.reducer);
  const [tweets, setTweets] = useState([]);
  const logoutUser = () => {
    const endpoint = "http://127.0.0.1:8000/users/sign_out/";
    axios.post(endpoint).then((res) => {
      const responseData = res.data;
      if (responseData.success) {
        localStorage.removeItem("authTokens");
        dispatch({
          type: LOGOUT,
          payload: {
            authenticated: false,
          },
        });
        navigate("/sign_in");
      }
    });
  };

  useEffect(() => {
    getTweets();
  }, []);

  const getTweets = () => {
    let endpoint = "http://127.0.0.1:8000/tweets/tweet_api/";
    axios.get(endpoint).then((res) => {
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
      console.log("actions", user, user?.username);
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
