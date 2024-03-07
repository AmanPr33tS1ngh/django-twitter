import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import axios from "axios";
import Post from "../../ReUsableComponents/Post/Post";
import AddPost from "../../ReUsableComponents/Post/AddPost/AddPost";

const Home = () => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    getTweets();
  }, []);
  const getTweets = () => {
    let endpoint = "http://127.0.0.1:8000/tweets/tweet_api/";
    console.log("endpoint", endpoint);
    axios.get(endpoint).then((res) => {
      let responseData = res.data;
      console.log(responseData);
      setTweets(responseData.tweets);
    });
  };
  return (
    <div>
      {window.location.href.includes("compose/post") ? <AddPost /> : null}
      {console.log("window.location.href.", window.location.href)}
      <Navbar />
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
