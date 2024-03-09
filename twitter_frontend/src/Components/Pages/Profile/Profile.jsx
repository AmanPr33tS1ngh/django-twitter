import React, { useEffect, useMemo, useState } from "react";
import "./Profile.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Post from "../../ReUsableComponents/Post/Post";

const Profile = () => {
  const { profile, view_type } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
  }, [profile, view_type]);

  const [user, setUser] = useState({
    username: "",
    banner: "",
    profilePicture: "",
    fullName: "",
    location: "",
    bio: "",
    canEditProfile: false,
  });
  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState([]);
  const [likes, setLikes] = useState([]);

  const buttons = useMemo(() => [
    { name: "Posts", to: "" },
    { name: "Replies", to: "replies" },
    { name: "Likes", to: "likes" },
  ]);
  const getProfile = () => {
    const endpoint = "http://127.0.0.1:8000/users/get_profile/";
    const data = { profile: profile, view_type: view_type };
    axios.post(endpoint, data).then((res) => {
      const responseData = res.data;
      console.log("responseData", responseData);
      const user = responseData.user;
      const posts = responseData.posts;
      const replies = responseData.replies;
      const likes = responseData.likes;
      if (user) {
        setUser({
          username: user.username,
          banner: user.banner,
          profilePicture: user.profile_picture,
          fullName: user.full_name,
          location: user.location,
          bio: user.biography,
          canEditProfile: user.can_edit_profile,
        });
      }
      setPosts(posts || []);
      setReplies(replies || []);
      setLikes(likes || []);
    });
  };
  const navigateTo = (type) => {
    navigate(`/${user.username}/${type}`);
  };

  return (
    <div className="profile">
      <div className="banner">
        <img src={user.banner} alt="Banner" />
      </div>
      <div className="profile-info">
        <div className="p-20">
          <div className="profile-picture">
            <img src={user.profilePicture} alt="Profile" />
          </div>
          <div className="user-details">
            <h1>{user.fullName}</h1>
            <p>@{user.username}</p>
            <br />
            <p>{user.bio || "bio"}</p>
            <p>{user.location || "location"}</p>
          </div>
        </div>
        <div className="dfg">
          {buttons.map((button) => (
            <button onClick={() => navigateTo(button.to)} className="btn">
              {button.name}
            </button>
          ))}
        </div>
        <div>
          {!view_type
            ? posts.length
              ? posts.map((post) => (
                  <Post
                    content={post.content}
                    username={post.user?.username}
                    timestamp={post.post_duration}
                  />
                ))
              : "No Posts"
            : null}
          {view_type === "likes"
            ? likes.length
              ? likes.map((like) => (
                  <Post
                    content={like.content}
                    username={like.user?.username}
                    timestamp={like.post_duration}
                  />
                ))
              : "No Likes"
            : null}
          {console.log("view_type", view_type)}
          {view_type === "replies"
            ? replies.length
              ? replies.map((reply) => (
                  <Post
                    content={reply.content}
                    username={reply.user?.username}
                    timestamp={reply.post_duration}
                  />
                ))
              : "No Replies"
            : null}
        </div>
      </div>
    </div>
  );
};

export default Profile;
