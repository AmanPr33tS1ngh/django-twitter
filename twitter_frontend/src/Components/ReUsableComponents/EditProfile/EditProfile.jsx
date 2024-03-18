import React, { useState } from "react";
import Input from "../Input/Input";
import ModalBackground from "../ModalBackground/ModalBackground";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import Switch from "react-switch";

const EditProfile = ({ user, changeProfile, closeModal }) => {
  const [editProfile, setEditProfile] = useState({
    username: user?.username,
    firstName: user?.first_name,
    lastName: user?.last_name,
    location: user?.location,
    bio: user?.biography,
    isPrivate: user?.is_private,
  });

  const changeEditProfile = (e) => {
    setEditProfile({
      ...editProfile,
      [e.target.name]: e.target.value,
    });
  };
  const togglePrivacy = () => {
    setEditProfile({
      ...editProfile,
      isPrivate: !editProfile.isPrivate,
    });
  };
  return (
    <ModalBackground>
      <div className=" bg-white p-5 w-1/2 rounded relative">
        <button className="absolute right-0 mr-5" onClick={closeModal}>
          <FontAwesomeIcon icon={faClose} />
        </button>
        <p className="text-lg font-semibold flex justify-between my-3">
          Edit profile
        </p>
        <div className="flex justify-between items-center">
          <label className="font-semibold text-md" htmlFor="privacySwitch">
            Private:
          </label>
          <Switch
            id="privacySwitch"
            onChange={togglePrivacy}
            checked={editProfile.isPrivate}
            onColor="#6366F1"
            offColor="#D1D5DB"
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </div>
        <Input
          placeholder={"Username"}
          value={editProfile.username}
          name={"username"}
          onChange={changeEditProfile}
        />
        <Input
          placeholder={"First name"}
          value={editProfile.firstName}
          name={"firstName"}
          onChange={changeEditProfile}
        />
        <Input
          placeholder={"Last name"}
          value={editProfile.lastName}
          name={"lastName"}
          onChange={changeEditProfile}
        />
        <Input
          placeholder={"Location"}
          value={editProfile.location}
          name={"location"}
          onChange={changeEditProfile}
        />
        <Input
          placeholder={"Biography"}
          value={editProfile.bio}
          name={"bio"}
          onChange={changeEditProfile}
        />
        <div className="flex justify-center items-center">
          <button
            className="w-1/2 bg-blue-500 rounded-lg text-white px-5 py-2 text-base cursor-pointer mt-4"
            onClick={() => changeProfile(editProfile)}
          >
            Submit
          </button>
        </div>
      </div>
    </ModalBackground>
  );
};

export default EditProfile;
