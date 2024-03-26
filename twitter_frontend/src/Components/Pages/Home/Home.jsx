import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import axios from "../../Redux/Axios/axios";
import Post from "../../ReUsableComponents/Post/Post";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../../ReUsableComponents/Loader/Loader";
import InfiniteScroll from "react-infinite-scroll-component";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.reducer.reducer);
  const [tweets, setTweets] = useState([]);
  const [activeTab, setActiveTab] = useState("For you");
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getTweets();
  }, [activeTab]);

  const getTweets = () => {
    let endpoint = "http://127.0.0.1:8000/tweets/get_home_tweets/";
    const data = {
      type: activeTab,
      page: page,
    };
    setLoading(true);
    axios.post(endpoint, data).then((res) => {
      let responseData = res.data;
      console.log("HOme resss", responseData);
      const newTweets = tweets;
      newTweets.push(...responseData.tweets);

      console.log("newTweets", newTweets);
      setTweets(newTweets);
      setLoading(false);
      setPage(responseData.page);
      setHasNext(responseData.has_next);
    });
  };
  const changeActiveTab = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setTweets([]);
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
          console.log("actionsss", responseData);
          if (responseData.success) {
          const newPost = tweets?.filter((p) => {
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
          setTweets(newPost);
        }
        });
    } else if (action_type === "comment") {
      navigate(`/post/${post?.user?.username}/${post?.id}`);
    }
  };
  return (
    <div>
      <Navbar activeTab={activeTab} setActiveTab={changeActiveTab} />
      {loading ? <Loader /> : null}
      <InfiniteScroll
        next={getTweets}
        hasMore={hasNext}
        loader={<Loader />}
        dataLength={tweets.length}
        className={"ml-10"}
      >
        {tweets.map((tweet) => (
          <Post post={tweet} actions={actions} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default Home;
