import React, { useContext, useEffect, useState } from "react";
import Input from "../../ReUsableComponents/Input/Input";
import "./Messages.css";
import AuthContext from "../../Authentication/AuthProvider";
import axios from "axios";
import Room from "../../ReUsableComponents/Room/Room";
import CreateRoom from "../../ReUsableComponents/CreateRoom/CreateRoom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentMedical } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import ChatPanel from "../../ReUsableComponents/ChatPanel/ChatPanel";

const Messages = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState(null);
  const [createRoom, setCreateRoom] = useState(false);
  useEffect(() => {
    getRooms();
  }, []);
  useEffect(() => {
    if (slug) {
      getRoom();
    }
  }, [slug]);
  const getRoom = () => {
    let endpoint = "http://127.0.0.1:8000/chat/get_room/";
    let data = {
      username: user?.name,
      slug: slug,
    };
    axios.post(endpoint, data).then((res) => {
      let responseData = res.data;
      console.log("ressss chatchat123123", responseData);
      if (responseData.room) setRoom(responseData.room);
    });
  };
  const getRooms = () => {
    console.log(user?.name);
    let endpoint = "http://127.0.0.1:8000/chat/get_rooms/";
    let data = {
      username: user?.name,
    };
    axios.post(endpoint, data).then((res) => {
      let responseData = res.data;
      console.log("ressss ", responseData);
      if (responseData.rooms) setRooms(responseData.rooms);
    });
  };
  const handleClose = () => {
    setCreateRoom(!createRoom);
  };

  const setCreatedRoom = (room) => {
    console.log("room setCreatedRoom", room);
    if (room) setRooms([...rooms, room]);
  };
  const openMessage = (room) => {
    navigate(`/messages/${room}`);
  };
  const messageHandler = (message) => {
    console.log("prev", room);
    const messages = room?.messages;
    messages?.push(message);
    const newRoom = { ...room, messages: messages };
    setRoom(newRoom);
  };
  return (
    <div className="dgrid">
      {console.log("SLususususu", slug, room)}
      <div
        style={{
          borderRight: "0.5px solid rgb(225, 222, 222)",
          position: "relative",
        }}
      >
        <h1 style={{ fontSize: "20px", fontWeight: 500, marginLeft: "10px" }}>
          Messages
        </h1>
        <button
          onClick={() => setCreateRoom(!createRoom)}
          style={{
            position: "absolute",
            top: 0,
            right: "10px",
            padding: "5px",
          }}
        >
          <FontAwesomeIcon icon={faCommentMedical} />
        </button>
        <Input placeholder={"Search..."} />

        {createRoom ? (
          <CreateRoom
            handleClose={handleClose}
            setRooms={setCreatedRoom}
            username={user?.name}
          />
        ) : null}
        <div>
          {rooms.map((room) => (
            <Room room={room} openMessage={openMessage} />
          ))}
        </div>
      </div>
      <div
        style={{
          // height: "100vh",
          // overflowY: "scroll",
          position: "relative",
        }}
      >
        <ChatPanel room={room} messageHandler={messageHandler} />
      </div>
    </div>
  );
};

export default Messages;
