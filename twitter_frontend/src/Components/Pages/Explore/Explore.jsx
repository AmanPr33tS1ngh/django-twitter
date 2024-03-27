import React, { useEffect, useState, useCallback } from "react";
import Input from "../../ReUsableComponents/Input/Input";
import axios from "../../Redux/Axios/axios";
import SearchResults from "../../ReUsableComponents/SearchResults/SearchResults";
import { debounce } from "lodash";
import FeedPost from "../../ReUsableComponents/Post/FeedPost/FeedPost";
import Loader from "../../ReUsableComponents/Loader/Loader";

const Explore = () => {
  const [inputVal, setInputVal] = useState("");
  const [matchingTweets, setMatchingResults] = useState([]);
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [page, setPage] = useState(1);
  // const [loading, setLoading] = useState(false);
  useEffect(() => {
    getFeed();
  }, []);

  const getFeed = () => {
    const endpoint = "http://127.0.0.1:8000/tweets/get_feed/";
    setLoading(true);
    axios.post(endpoint, {page: page, has_next: hasNext}).then((res) => {
      const responseData = res.data;
      const newFeed = feedPosts;
      newFeed.push(...responseData.posts)
      setFeedPosts(newFeed);
      setLoading(false);
      setPage(responseData.next_page);
      setHasNext(responseData.has_next);
    });
  };
  const handleChange = (e) => {
    const val = e;
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
  const handleShowResults = () => {
    setInputVal("");
  };
  return (
    <div className={"relative"}>
      <div className="flex justify-center">
        <Input
          type={'chat-ui'}
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
        handleShowResults={handleShowResults}
      />
      {loading ? <Loader/>:null}
      <FeedPost feedPosts={feedPosts} getPosts={getFeed} hasMore={hasNext} />
    </div>
  );
};

export default Explore;
