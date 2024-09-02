import React, { useEffect, useMemo, useState } from "react";
import axios from "../../Redux/Axios/axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Post from "../../ReUsableComponents/Post/Post";
import ImageUploader from "../../ReUsableComponents/ImageUploader/ImageUploader";
import ModalBackground from "../../ReUsableComponents/ModalBackground/ModalBackground";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faLocationDot,
  faUserPlus,
  faUserSlash,
  faMessage,
  faUserTimes,
} from "@fortawesome/free-solid-svg-icons";
import EditProfile from "../../ReUsableComponents/EditProfile/EditProfile";
import PrivateProfile from "../../ReUsableComponents/PrivateProfile/PrivateProfile";
import { useDispatch } from "react-redux";
import { SET_USER } from "../../Redux/ActionTypes/ActionTypes";
import Loader from "../../ReUsableComponents/Loader/Loader";
import InfiniteScroll from "react-infinite-scroll-component";

const Profile = () => {
  const { profile, view_type } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getProfile();
  }, [profile, view_type]);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [uploadProfilePicture, setUploadProfilePicture] = useState(false);
  const [uploadType, setUploadType] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(true);
  const [page, setPage] = useState(1);

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
    const data = { profile: profile, view_type: view_type, page: page };
    setLoading(true);
    axios.post(endpoint, data).then((res) => {
      const responseData = res.data;

      const user = responseData.user;
      const newPosts = posts;
      newPosts.push(...responseData.posts);
      setUser(user);
      setPosts(newPosts);
      setPage(responseData.page);
      setHasNext(responseData.has_next);
      setLoading(false);
    });
  };
  const navigateTo = (type) => {
    setPage(1);
    setPosts([]);
    navigate(`/${user?.username}/${type}`);
  };

  const actions = (e, post, action_type) => {
    e.stopPropagation();
    if (action_type === "comment") {
      navigate(`/post/${post?.user?.username}/${post?.id}`);
      return;
    }
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
        if (responseData.success) {
          const newPost = posts?.filter((p) => {
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
          setPosts(newPost);
        }
      });
  };
  const imageUploader = (image) => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("upload_type", uploadType);

    const endpoint = `http://127.0.0.1:8000/users/upload_image/`;
    axios.post(endpoint, formData).then((res) => {
      const responseData = res.data;
      if (responseData.success && responseData.profile_picture) {
        const newUser = { ...user, [uploadType]: responseData.profile_picture };
        setUser(newUser);
        dispatch({
          type: SET_USER,
          payload: {
            user: newUser,
          },
        });
      }
    });
  };
  const uploadOpener = (type) => {
    if (type) setUploadType(type);
    setUploadProfilePicture(!uploadProfilePicture);
  };
  const createOrDeleteConnection = (type) => {
    const endpoint = `http://127.0.0.1:8000/users/connection_api/`;
    axios.post(endpoint, { receiver: profile, type: type }).then((res) => {
      const responseData = res.data;
      setUser(responseData.user);
    });
  };
  const changeEditModal = () => {
    setEditModal(!editModal);
  };
  const changeProfile = (user) => {
    const endpoint = `http://127.0.0.1:8000/users/edit_profile/`;
    axios.post(endpoint, { user: user }).then((res) => {
      const responseData = res.data;
      if (responseData.success) {
        setUser(responseData.user);
        setEditModal(!editModal);
      }
    });
  };
  const navigateToMessage = () => {
    if (user?.room_slug) {
      navigate(`/messages/${user?.room_slug}/`);
      return;
    }
    createRoom();
  };
  const createRoom = () => {
    let endpoint = "http://127.0.0.1:8000/chat/create_room/";
    let data = {
      participant_usernames: [user?.username],
      get_only_slug: true,
    };
    axios.post(endpoint, data).then((res) => {
      let responseData = res.data;
      if (responseData.success && responseData.room)
        navigate(`/messages/${responseData.room}/`);
    });
  };
  const hasProfileViewAccess =
    user?.is_user_profile || !user?.is_private || user?.has_connection;

  return loading ? (
    <Loader />
  ) : (
    <div>
        {console.log("kskskskaaabbcbcb", user, user?.req_sent, user?.has_connection)}
      {uploadProfilePicture ? (
        <ModalBackground>
          <ImageUploader
            onClose={() => uploadOpener()}
            onImageUpload={imageUploader}
            isImageUpload={user?.username === profile && user?.is_user_profile}
            savedImage={
              uploadType === "banner" ? user?.banner : user?.profile_picture
            }
          />
        </ModalBackground>
      ) : null}
      <div
        onClick={() => {
          uploadOpener("banner");
        }}
        className="h-32 bg-black relative overflow-hidden z-2 cursor-pointer"
      >
        <img
          className={"h-inherit"}
          src={user?.banner}
          alt="Banner"
        />
      </div>
      <div className=" relative bg-white mt-[-50px] p-6">
        <div>
          <div className="flex justify-between">
            <div
              onClick={() => {
                uploadOpener("profile_picture");
              }}
              className="cursor-pointer	w-32 h-32 z-2 relative bg-white overflow-hidden rounded-full border-4 border-white mb-8"
            >
              <img
                className={"h-[inherit]"}
                src={user?.profile_picture}
                alt="Profile picture"
              />
            </div>
            <div className={"flex justify-center mt-5"}>
              {user?.has_connection ? (
                <div className={"mr-5"}>
                  <button onClick={navigateToMessage}>
                    <FontAwesomeIcon icon={faMessage} />
                  </button>
                </div>
              ) : null}
              <div>
                {user?.req_sent ? (
                  <button onClick={() => createOrDeleteConnection("delete")}>
                    <FontAwesomeIcon icon={faUserTimes} />
                  </button>
                ) : user?.is_user_profile ? (
                  <button
                    className="text-sm border font-semibold border-gray-300 rounded-full px-4 py-1"
                    onClick={changeEditModal}
                  >
                    Edit profile
                  </button>
                ) : !user?.has_connection ? (
                  <button onClick={() => createOrDeleteConnection("create")}>
                    <FontAwesomeIcon icon={faUserPlus} />
                  </button>
                ) : (
                  <button onClick={() => createOrDeleteConnection("delete")}>
                    <FontAwesomeIcon icon={faUserSlash} />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div>
            <h1 className={"text-xl font-semibold mb-1"}>{user?.fullName}</h1>
            <p className={"text-base text-gray-600"}>@{user?.username}</p>
            <p className={"text-sm text-gray-600 mb-2"}>
              {user?.biography || "bio"}
            </p>
            {hasProfileViewAccess ? (
              <div className="flex items-center">
                <p className={"text-sm text-gray-600 mb-2"}>
                  <FontAwesomeIcon className="mr-2" icon={faLocationDot} />
                  {user?.location || "location"}
                </p>
                <p className={"text-sm text-gray-600 mb-2 ml-3"}>
                  <FontAwesomeIcon className="mr-2" icon={faCalendarDays} />
                  {user?.joining_date || "joining_date"}
                </p>
              </div>
            ) : null}
          </div>
        </div>
        {hasProfileViewAccess ? (
          <div className="grid grid-cols-4 items-center mt-4">
            {buttons.map((button) => (
              <button
                onClick={() => navigateTo(button.to)}
                className="flex px-2 grid-cols-1 justify-center hover:bg-gray-200"
              >
                <div
                  className={
                    view_type === button.to || (!view_type && button.to === "")
                      ? "flex justify-center font-bold text-black border-b-4 border-blue-300 py-1"
                      : "flex justify-center font-bold text-gray-500 transition-colors duration-300 ease-in-out  py-1"
                  }
                >
                  {button.name}
                </div>
              </button>
            ))}
          </div>
        ) : null}

        {hasProfileViewAccess ? (
          posts.length ? (
            <InfiniteScroll
              next={getProfile}
              hasMore={hasNext}
              loader={<Loader />}
              dataLength={posts.length}
              className={"mt-5"}
            >
              {posts.map((post) => (
                <Post post={post} actions={actions} />
              ))}
            </InfiniteScroll>
          ) : (
            "No Posts"
          )
        ) : (
          <PrivateProfile
            showCancelReq={user?.req_sent}
            cancelReq={() => createOrDeleteConnection("delete")}
            follow={() => createOrDeleteConnection("create")}
          />
        )}
      </div>
      {editModal ? (
        <EditProfile
          user={user}
          changeProfile={changeProfile}
          closeModal={changeEditModal}
        />
      ) : null}
    </div>
  );
};

export default Profile;
