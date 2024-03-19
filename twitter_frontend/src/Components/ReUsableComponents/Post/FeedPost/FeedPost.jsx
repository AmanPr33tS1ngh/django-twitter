import React from "react";
import ReactPlayer from "react-player";

const FeedPost = ({feedPosts})=>{
    return (
        <div className={'grid'}>
            {feedPosts.map((post)=>(
                post?.image ? (
        <img
          className="w-80 rounded-lg m-auto"
          src={`http://localhost:8000/media/${post?.image}`}
          alt="User Avatar"
        />
      ) : post?.video ? (
        <div>
          <ReactPlayer
            url={`http://localhost:8000${post?.video}`}
            controls
            width="100%"
            height="25rem"
            playing
          />
        </div>
      ) : null
            ))}
        </div>
    )
}
export  default FeedPost
