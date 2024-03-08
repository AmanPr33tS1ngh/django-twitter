import React, { useEffect, useState } from "react";
import Input from "../../ReUsableComponents/Input/Input";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SearchResults from "../../ReUsableComponents/SearchResults/SearchResults";
import { debounce } from "lodash";
import "./Explore.css";

const Explore = () => {
  const [inputVal, setInputVal] = useState("");
  const [matchingTweets, setMatchingResults] = useState([]);
  const [matchingUsers, setMatchingUsers] = useState([]);

  const { tab, search } = useParams();

  console.log("tab", tab, search);
  useEffect(() => {
    getTweets();
  }, [tab]);
  const getTweets = () => {
    const endpoint = "http://127.0.0.1:8000/tweets/get_matching_tweets/";
    const data = {
      tab: tab,
    };
    axios.post(endpoint, data).then((res) => {
      const responseData = res.data;
      console.log(responseData);
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
      console.log(responseData);
      setMatchingResults(responseData.results);
      setMatchingUsers(responseData.users);
    });
  };

  const navigateTo = (tag) => {
    console.log("tag", tag);
    navigate(`/explore/${tag}`);
  };
  return (
    <div>
      <Input placeholder="Search..." value={inputVal} onChange={handleChange} />
      {console.log(matchingTweets, matchingUsers)}
      <SearchResults
        results={matchingTweets}
        users={matchingUsers}
        showResults={!!inputVal}
      />
      <div className="dfc">
        <button className="p-5" onClick={() => navigateTo("")}>
          For you
        </button>
        <button className="p-5" onClick={() => navigateTo("tabs/trending")}>
          Trending
        </button>
        <button className="p-5" onClick={() => navigateTo("tabs/news")}>
          News
        </button>
        <button className="p-5" onClick={() => navigateTo("tabs/sports")}>
          Sports
        </button>
        <button
          className="p-5"
          onClick={() => navigateTo("tabs/entertainment")}
        >
          Entertainment
        </button>
      </div>
    </div>
  );
};

export default Explore;
