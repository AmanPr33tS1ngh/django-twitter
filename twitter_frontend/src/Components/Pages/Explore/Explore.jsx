import React, { useEffect, useState } from "react";
import Input from "../../ReUsableComponents/Input/Input";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SearchResults from "../../ReUsableComponents/SearchResults/SearchResults";
import { debounce } from "lodash";
import "./Explore.css";
import Post from "../../ReUsableComponents/Post/Post";

const Explore = () => {
  const [inputVal, setInputVal] = useState("");
  const [matchingTweets, setMatchingResults] = useState([]);
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [tweet, setTweet] = useState(null);
  const [replies, setReplies] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    getTweet();
  }, [id]);
  const getTweet = () => {
    const endpoint = "http://127.0.0.1:8000/tweets/get_tweet/";
    const data = {
      tweet_id: id,
    };
    axios.post(endpoint, data).then((res) => {
      const responseData = res.data;
      console.log("responseData12323", responseData);
      setTweet(responseData.tweet);
      setReplies(responseData.replies);
    });
  };
  const handleChange = (e) => {
    const val = e.target.value;
    setInputVal(val);
    debouncedHandleChange(val);
  };
  const debouncedHandleChange = debounce((value) => {
    getMatchingTweets(value);
  }, 1000);

  const navigate = useNavigate();
  const getMatchingTweets = (inputVal) => {
    const endpoint = "http://127.0.0.1:8000/tweets/get_matching_tweets/";
    const data = {
      input_val: inputVal,
    };
    axios.post(endpoint, data).then((res) => {
      const responseData = res.data;
      setMatchingResults(responseData.results);
      setMatchingUsers(responseData.users);
    });
  };

  const navigateTo = (tag) => {
    navigate(`/explore/${tag}`);
  };

  const actions = (e, id, action_type) => {
    e.stopPropagation();
    if (action_type === "bookmark" || action_type == "like") {
      console.log("id", id);
      let endpoint = `http://127.0.0.1:8000/tweets/take_action/`;
      console.log("use", tweet, tweet.name);
      if (!tweet.username) return;
      axios
        .post(endpoint, {
          tweet_id: id,
          user: tweet?.name,
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
      <Input placeholder="Search..." value={inputVal} onChange={handleChange} />
      <SearchResults
        results={matchingTweets}
        users={matchingUsers}
        showResults={!!inputVal}
      />
      {console.log("TWEET", tweet)}
      {tweet ? <Post post={tweet} actions={actions} /> : null}
      <hr />
      {replies?.map((reply) => (
        <Post post={reply} actions={actions} />
      ))}
    </div>
  );
};

export default Explore;
