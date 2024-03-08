import React, {useContext, useEffect, useState} from "react";
import Navbar from "../../Navbar/Navbar";
import axios from "axios";
import Post from "../../ReUsableComponents/Post/Post";
import AddPost from "../../ReUsableComponents/Post/AddPost/AddPost";
import { LOGOUT } from "../../Redux/ActionTypes/ActionTypes";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Authentication/AuthProvider";

const Home = () => {
  const [tweets, setTweets] = useState([]);
  const {logoutUser} = useContext(AuthContext);

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
  return (
    <div>
      {window.location.href.includes("compose/post") ? <AddPost /> : null}
      <Navbar />

      <button onClick={logoutUser}>LOG OUT</button>
      {tweets.map((tweet) => (
        <Post
          content={tweet.content}
          username={tweet.user?.username}
          timestamp={tweet.post_duration}
        />
      ))}
    </div>
  );
};

export default Home;
