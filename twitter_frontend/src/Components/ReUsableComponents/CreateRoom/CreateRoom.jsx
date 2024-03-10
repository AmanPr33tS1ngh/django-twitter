import React, { useState } from "react";
import "./CreateRoom.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faUser,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import Input from "../Input/Input";
import { debounce } from "lodash";
import axios from "axios";
import SearchResults from "../SearchResults/SearchResults";

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
      console.log("ressss", responseData);
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
    console.log("data", data);
    axios.post(endpoint, data).then((res) => {
      let responseData = res.data;
      console.log("ressss", responseData);
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
    <div className="modal-overlay">
      <div className="create-room-modal">
        <button className="x-mark-left" onClick={handleClose}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>
        <button onClick={createRoom} className="x-mark-right">
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
        <div style={{ margin: "5px" }}>
          {participants.map((participant) => (
            <span
              style={{
                background: "black",
                padding: "5px 10px",
                color: "white",
                borderRadius: "25px",
                marginRight: "5px",
              }}
            >
              {participant}
              <button
                style={{ marginLeft: "5px" }}
                onClick={() => removeParticipant(participant)}
              >
                <FontAwesomeIcon icon={faCircleXmark} />
              </button>
            </span>
          ))}
        </div>
        <hr style={{ margin: "1rem" }} />
        <ul
          style={{
            height: "500px",
            padding: "10px",
            overflowY: "scroll",
          }}
        >
          {users.map((user, index) => (
            <li
              key={index}
              className="mb-2"
              onClick={() => addParticipants(user)}
            >
              <div
                style={{
                  alignItems: "center",
                  cursor: "pointer",
                  alignItems: "center",
                  display: "grid",
                  gridTemplateColumns: "8% 92%",
                  paddingBottom: "10px",
                }}
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
