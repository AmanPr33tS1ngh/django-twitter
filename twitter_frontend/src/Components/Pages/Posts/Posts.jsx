import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../Redux/Axios/axios";
import Post from "../../ReUsableComponents/Post/Post";

const Posts = () => {
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
      setTweet(responseData.tweet);
      setReplies(responseData.replies);
    });
  };

  const navigate = useNavigate();

  const actions = (e, post, action_type) => {
    // e.stopPropagation();
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
            let newTweet = tweet;
            if (action_type === "bookmark") {
              newTweet.is_bookmarked = !tweet.is_bookmarked;
              setTweet(newTweet);
            } else if (action_type === "like") {
              newTweet.is_liked = !tweet.is_liked;
              if (newTweet.is_liked) {
                newTweet.like_count += 1;
              } else {
                newTweet.like_count -= 1;
              }
              setTweet(newTweet);
            }
          }
          // const newReplies = replies?.filter((p) => {
          //   if (p.id === post?.id) {
          //     if (action_type === "bookmark") {
          //       p.is_bookmarked = !p.is_bookmarked;
          //     } else if (action_type === "like") {
          //       p.is_liked = !p.is_liked;
          //       if (p.is_liked) {
          //         p.like_count += 1;
          //       } else {
          //         p.like_count -= 1;
          //       }
          //     }
          //   }
          //   return p;
          // });
          // setReplies(newReplies);
        }
      });
  };
  const memoizedTweet = React.useMemo(() => {
    return tweet && <Post post={tweet} actions={actions} />;
  }, [tweet, actions]);
  return (
    <div className={"relative"}>
      {memoizedTweet}
      {replies?.length ? (
        <div>
          <hr />
          {replies?.map((reply) => (
            <Post post={reply} actions={actions} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Posts;
