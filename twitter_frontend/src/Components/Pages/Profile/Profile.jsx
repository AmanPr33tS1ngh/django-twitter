import React, { useState } from "react";
import "./Profile.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { profile } = useParams();
  const [user, setUser] = useState({
    username: "",
    banner: "",
    profilePicture: "",
    fullName: "",
    location: "",
  });
  const getProfile = () => {
    const endpoint = "http://127.0.0.1:8000/users/get_profile/";
    axios.post(endpoint, { profile: profile }).then((res) => {
      const responseData = res.data;
    });
  };

  return (
    <div className="profile">
      <div className="banner">
        {/* You can replace the image source with the URL of the banner image */}
        <img src="https://placekitten.com/1500/300" alt="Banner" />
      </div>
      <div className="profile-info">
        <div className="profile-picture">
          {/* You can replace the image source with the URL of the profile picture */}
          <img src="https://placekitten.com/200/200" alt="Profile" />
        </div>
        <div className="user-details">
          <h1>{user.fullName}</h1>
          <p>{user.username}</p>
          <p>{user.location}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
