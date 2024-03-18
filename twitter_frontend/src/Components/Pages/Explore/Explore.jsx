import React, { useEffect, useState, useCallback } from "react";
import Input from "../../ReUsableComponents/Input/Input";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../Redux/Axios/axios";
import SearchResults from "../../ReUsableComponents/SearchResults/SearchResults";
import { debounce } from "lodash";
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

  useEffect(() => {
    getFeed();
  }, []);

  const getFeed = () => {
    const endpoint = "http://127.0.0.1:8000/tweets/get_feed/";
    axios.post(endpoint).then((res) => {
      const responseData = res.data;
      console.log("responseData ", responseData);
    });
  };
  const getTweet = () => {
    const endpoint = "http://127.0.0.1:8000/tweets/get_tweet/";
    const data = {
      tweet_id: id,
    };
    axios.post(endpoint, data).then((res) => {
      const responseData = res.data;
      setTweet(responseData.tweet);
      setReplies(responseData.replies);
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

  const actions = (e, post, action_type) => {
    e.stopPropagation();
    if (action_type === "comment") {
      navigate(`/post/${post?.user?.username}/${post?.id}`);
      return;
    }
    let endpoint = `http://127.0.0.1:8000/tweets/take_action/`;

    axios
      .post(endpoint, {
        tweet_id: post?.id,
        user: post?.user?.username,
        action_type: action_type,
      })
      .then((res) => {
        let responseData = res.data;
        if (responseData.success) {
          if (tweet?.id === post?.id) {
            const newTweet = tweet;
            if (action_type === "bookmark") {
              newTweet.is_bookmarked = !tweet.is_bookmarked;
            } else if (action_type === "like") {
              newTweet.is_liked = !tweet.is_liked;
              if (newTweet.is_liked) {
                newTweet.like_count += 1;
              } else {
                newTweet.like_count -= 1;
              }
            }
            setTweet(newTweet);
            return;
          }
          const newReplies = replies?.filter((p) => {
            if (p.id === post?.id) {
              if (action_type === "bookmark") {
                p.is_bookmarked = !p.is_bookmarked;
              } else if (action_type === "like") {
                p.is_liked = !p.is_liked;
                if (p.is_liked) {
                  p.like_count += 1;
                } else {
                  p.like_count -= 1;
                }
              }
            }
            return p;
          });
          setReplies(newReplies);
        }
        // console.log(responseData);
        // setTweets(responseData.tweets);
      });
  };
  return (
    <div className={"relative"}>
      <Input placeholder="Search..." value={inputVal} onChange={handleChange} />
      <SearchResults
        results={matchingTweets}
        users={matchingUsers}
        showResults={!!inputVal}
      />
      {console.log("TWEET", tweet)}
      {tweet ? <Post post={tweet} actions={actions} /> : null}
      <br />
      <hr />
      <hr />
      <hr />
      <hr />
      <br />
      {replies?.length ? <h2>Replies</h2> : null}
      {replies?.map((reply) => (
        <Post post={reply} actions={actions} />
      ))}
    </div>
  );
};

export default Explore;
