import React, { useEffect, useMemo, useState } from "react";
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
  const [bookmarks, setBookmarks] = useState([]);

  const buttons = useMemo(
    () => [
      { name: "Posts", to: "" },
      { name: "Replies", to: "replies" },
      { name: "Likes", to: "likes" },
      { name: "Bookmarks", to: "bookmarks" },
    ],
    []
  );

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
      const bookmarks = responseData.bookmarks;
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
      setBookmarks(bookmarks || []);
    });
  };
  const navigateTo = (type) => {
    navigate(`/${user.username}/${type}`);
  };

  const actions = (e, id, action_type) => {
    e.stopPropagation();
    if (action_type === "bookmark" || action_type == "like") {
      // console.log("id", id);
      let endpoint = `http://127.0.0.1:8000/tweets/take_action/`;
      // console.log("use", user, user.username);
      if (!user.username) return;
      axios
        .post(endpoint, {
          tweet_id: id,
          user: user?.username,
          action_type: action_type,
        })
        .then((res) => {
          let responseData = res.data;
          // console.log(responseData);
          // setTweets(responseData.tweets);
        });
    }
  };
  return (
    <div>
      <div className="h-32 bg-black relative overflow-hidden z-10">
        <img src={user.banner} alt="Banner" />
      </div>
      <div className=" relative bg-white rounded-lg shadow-md mt-[-50px] p-6">
        <div className="px-20 py-20">
          <div className="w-32 h-32 z-20 relative bg-white overflow-hidden rounded-full border-4 border-white shadow-md mb-8">
            <img src={user.profilePicture} alt="Profile" />
          </div>
          <div>
            <h1 className={'text-base text-gray-600 mb-4'}>{user.fullName}</h1>
            <p className={'text-xl font-semibold mb-1'}>@{user.username}</p>
            <br />
            <p className={'text-xl font-semibold mb-1'}>{user.bio || "bio"}</p>
            <p className={'text-xl font-semibold mb-1'}>{user.location || "location"}</p>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center">
          {buttons.map((button) => (
            <button
              onClick={() => navigateTo(button.to)}
              className={
                view_type === button.to || (!view_type && button.to === "")
                  ? "font-bold text-black"
                  : "font-bold text-gray-500 py-1 px-2 transition-colors duration-300 ease-in-out hover:bg-gray-200"
              }
            >
              {button.name}
            </button>
          ))}
        </div>
        <div>
          {!view_type
            ? posts.length
              ? posts.map((post) => <Post post={post} actions={actions} />)
              : "No Posts"
            : null}
          {view_type === "likes"
            ? likes.length
              ? likes.map((like) => <Post post={like} actions={actions} />)
              : "No Likes"
            : null}
          {view_type === "replies"
            ? replies.length
              ? replies.map((reply) => <Post post={reply} actions={actions} />)
              : "No Replies"
            : null}
          {view_type === "bookmarks"
            ? bookmarks.length
              ? bookmarks.map((bookmark) => (
                  <Post post={bookmark} actions={actions} />
                ))
              : "No Bookmarks"
            : null}
        </div>
      </div>
    </div>
  );
};

export default Profile;
