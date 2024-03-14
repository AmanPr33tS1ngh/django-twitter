import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faUser,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import Input from "../Input/Input";
import { debounce } from "lodash";
import axios from "../../Redux/Axios/axios";

const CreateRoom = ({ handleClose, setRooms, username }) => {
  const [inputVal, setInputVal] = useState("");
  const [users, setUsers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [groupName, setGroupName] = useState("");

  const getUsers = (username) => {
    let endpoint = "http://127.0.0.1:8000/users/get_users/";
    let data = {
      username: username,
    };
    axios.post(endpoint, data).then((res) => {
      let responseData = res.data;
      // console.log("ressss", responseData);
      setUsers(responseData.users);
    });
  };
  const createRoom = () => {
    let endpoint = "http://127.0.0.1:8000/chat/create_room/";
    let data = {
      participant_usernames: participants,
      username: username,
      group_name: groupName,
    };
    // console.log("data", data);
    axios.post(endpoint, data).then((res) => {
      let responseData = res.data;
      // console.log("ressss", responseData);
      setRooms(responseData.room);
    });
  };
  const handleChange = (e) => {
    const val = e.target.value;
    setInputVal(val);
    debouncedHandleChange(val);
  };
  const groupHandleChange = (e) => {
    setGroupName(e.target.value);
  };
  const debouncedHandleChange = debounce((value) => {
    getUsers(value);
  }, 1000);

  const addParticipants = (user) => {
    if (!participants.includes(user?.username)) {
      participants.push(user?.username);
      setShowResults(!showResults);
      setInputVal("");
      setUsers([]);
    }
  };
  const removeParticipant = (username) => {
    const filteredParticipants = participants.filter(
      (participant) => participant !== username
    );
    setParticipants(filteredParticipants);
  };
  return (
    <div
      style={{
        background: "rgb(0 0 0 / 28%)",
      }}
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-10"
    >
      <div className="bg-white rounded-lg w-1/2 absolute p-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <button className="absolute top-2 left-2" onClick={handleClose}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>
        <button
          onClick={createRoom}
          className="absolute top-2 right-2 bg-gray-300 rounded-full text-sm px-4 py-1"
        >
          Next <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <Input
          placeholder="Search..."
          value={inputVal}
          onChange={handleChange}
        />
        {participants?.length > 1 ? (
          <Input
            placeholder="Group name..."
            value={groupName}
            onChange={groupHandleChange}
          />
        ) : null}
        <div className={"m-2"}>
          {participants.map((participant) => (
            <span className={"bg-black px-2 py-1 text-white rounded-full mr-2"}>
              {participant}
              <button
                className={"ml-2"}
                onClick={() => removeParticipant(participant)}
              >
                <FontAwesomeIcon icon={faCircleXmark} />
              </button>
            </span>
          ))}
        </div>
        <hr style={{ margin: "1rem" }} />
        <ul className={"h-500 px-4 py-2 overflow-y-scroll"}>
          {users.map((user, index) => (
            <li
              key={index}
              className="mb-2"
              onClick={() => addParticipants(user)}
            >
              <div
                className={
                  " items-center cursor-pointer grid grid-cols-1 md:grid-cols-10 pb-10" //flex
                }
              >
                <FontAwesomeIcon icon={faUser} />
                {user.username}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreateRoom;
