import React, { useEffect, useState, useCallback } from "react";
import Input from "../../ReUsableComponents/Input/Input";
import axios from "../../Redux/Axios/axios";
import SearchResults from "../../ReUsableComponents/SearchResults/SearchResults";
import { debounce } from "lodash";
import FeedPost from "../../ReUsableComponents/Post/FeedPost/FeedPost";

const Explore = () => {
  const [inputVal, setInputVal] = useState("");
  const [matchingTweets, setMatchingResults] = useState([]);
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);

  useEffect(() => {
    getFeed();
  }, []);

  const getFeed = () => {
    const endpoint = "http://127.0.0.1:8000/tweets/get_feed/";
    axios.post(endpoint).then((res) => {
      const responseData = res.data;
      console.log("feed datakksk ", responseData);
      setFeedPosts(responseData.posts);
    });
  };
  const handleChange = (e) => {
    const val = e.target.value;
    setInputVal(val);
    debouncedHandleChange(val);
  };
  const debouncedHandleChange = useCallback(
    debounce((value) => getMatchingTweets(value), 1000),
    []
  );

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

  return (
    <div className={"relative"}>
      <div className="flex justify-center">
        <Input
          placeholder="Search..."
          value={inputVal}
          className="w-[90%]"
          onChange={handleChange}
        />
      </div>
      <SearchResults
        results={matchingTweets}
        users={matchingUsers}
        showResults={!!inputVal}
      />
      <FeedPost feedPosts={feedPosts} />
    </div>
  );
};

export default Explore;
