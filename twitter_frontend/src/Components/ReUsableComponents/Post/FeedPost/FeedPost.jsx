import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../../Loader/Loader";

const FeedPost = ({ feedPosts, getPosts, hasMore }) => {
  const navigate = useNavigate();
  return (
    <InfiniteScroll next={getPosts} hasMore={hasMore} loader={<Loader/>} dataLength={feedPosts.length } className="grid grid-cols-6">
      {feedPosts.map((post) =>
        post?.image || post?.video ? (
          <div
            className={`flex w-fit col-span-2 relative group cursor-pointer`}
            onClick={() => navigate(`/status/${post?.id}`)}
          >
            {post?.image ? (
              <img
                className="w-full h-full object-cover cursor-pointer border border-solid border-opacity-40 border-gray-300"
                src={`http://localhost:8000/media/${post?.image}`}
                alt="User Avatar"
              />
            ) : post?.video ? (
              <VideoPlayer
                style={{ height: "inherit" }}
                className=" w-full h-full react-player h-inherit group"
                width="100%"
                height="100%"
                control
                url={`http://localhost:8000${post?.video}`}
              />
            ) : null}
            <div className="overlay absolute inset-0 bg-black bg-opacity-50 text-white justify-center items-center opacity-0 group-hover:opacity-100 flex">
              {/* <div class="text-center"> */}
              <div className="mr-5">
                <FontAwesomeIcon icon={faHeart} />
                &nbsp;{post?.like_count}
              </div>
              <div>
                <FontAwesomeIcon icon={faComment} />
                &nbsp;
                {post?.replies_count}
              </div>
              {/* </div> */}
            </div>
          </div>
        ) : null
      )}
    </InfiniteScroll>
  );
};
const VideoPlayer = ({ url }) => {
  const [play, setPlay] = useState(true);
  return (
    <div className=" col-span-2">
      <ReactPlayer
        url={url}
        // controls
        width="100%"
        height="100%"
        playing={play}
        onEnded={() => setPlay(!play)}
      />
    </div>
  );
};
export default FeedPost;
