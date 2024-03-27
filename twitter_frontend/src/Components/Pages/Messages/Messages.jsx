import React, { useEffect, useState } from "react";
// import Input from "../../ReUsableComponents/Input/Input";
import axios from "../../Redux/Axios/axios";
import Room from "../../ReUsableComponents/Room/Room";
import CreateRoom from "../../ReUsableComponents/CreateRoom/CreateRoom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentMedical } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import ChatPanel from "../../ReUsableComponents/ChatPanel/ChatPanel";
import { useSelector } from "react-redux";
import Loader from "../../ReUsableComponents/Loader/Loader";
import { Search } from "@chatscope/chat-ui-kit-react";

let socket = null;
const Messages = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.reducer.reducer);
  const [rooms, setRooms] = useState([]);
  // const [notAcceptedRooms, setNotAcceptedRooms] = useState([]);
  const [room, setRoom] = useState(null);
  const [createRoom, setCreateRoom] = useState(false);
  const [sender, setSender] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roomLoading, setRoomLoading] = useState(false);

  const createConnection = () => {
    socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/${
        user?.username ? user?.username : "group"
      }/${slug}/`
    );

    socket.onopen = function (e) {
      console.log("WebSocket connection opened");
      const message = {
        action_type: "connect",
        slug: slug,
      };
      socket.send(JSON.stringify(message));
    };

    socket.onclose = function (event) {
      console.log("WebSocket connection closed", event);
    };

    socket.onmessage = function (event) {
      try {
        let data = JSON.parse(event.data);
        console.log("datatatata123", data);
        if (
          (data.action_type === "chat_message" ||
            data.action_type === "delete_message") &&
          data.new_room
        ) {
          setRoom(data.new_room);
        }
      } catch (error) {
        console.log("Error parsing message:", error);
      }
    };
  };

  const messageHandler = (message) => {
    console.log("callingggigigi", message);
    if (!socket) {
      console.error("WebSocket connection is not initialized.");
      return;
    }
    const data = {
      username: user?.username,
      message: message,
      room_name: slug,
      action_type: "chat_message",
    };
    console.log("data", data);
    console.log("WebSocket.OPEN", WebSocket.OPEN);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.error("WebSocket connection is not open.");
    }
  };
  useEffect(() => {
    getRooms();
  }, []);

  useEffect(() => {
    if (slug) {
      createConnection();
      getRoom();
    }
    return () => (socket ? socket.close(1000, "Connection closed") : null);
  }, [slug]);
  const getRoom = () => {
    let endpoint = "http://127.0.0.1:8000/chat/get_room/";
    let data = {
      username: user?.username,
      slug: slug,
    };

    setRoomLoading(true);
    axios.post(endpoint, data).then((res) => {
      let responseData = res.data;
      if (responseData.room) {
        setRoom(responseData.room);
        setSender(responseData.user);
      }
      setRoomLoading(false);
    });
  };
  const getRooms = () => {
    let endpoint = "http://127.0.0.1:8000/chat/get_rooms/";
    let data = {
      username: user?.username,
    };
    setLoading(true);
    axios.post(endpoint, data).then((res) => {
      let responseData = res.data;
      if (responseData.rooms) setRooms(responseData.rooms);
      setLoading(false);
    });
  };
  const handleClose = () => {
    setCreateRoom(!createRoom);
  };

  const setCreatedRoom = (room) => {
    if (room) setRooms([...rooms, room]);
  };
  const openMessage = (room) => {
    navigate(`/messages/${room}`);
  };
  const deleteMessage = (message) => {
    if (!socket) {
      console.error("WebSocket connection is not initialized.");
      return;
    }
    const data = {
      username: user?.username,
      message_id: message?.id,
      room_name: slug,
      action_type: "delete_message",
    };
    console.log("WebSocket.OPEN", WebSocket.OPEN);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.error("WebSocket connection is not open.");
    }
  };
  return (
    <div className="grid grid-cols-2">
      <div className={"col-span-1 border-r border-gray-300  relative"}>
        <h1 className={"text-lg p-2 font-bold ml-4"}>Messages</h1>
        <button
          onClick={() => setCreateRoom(!createRoom)}
          className={"absolute top-0 right-4 p-2"}
        >
          <FontAwesomeIcon icon={faCommentMedical} />
        </button>
        {rooms.length ? (
          <div className="flex justify-center">
            <Search className="w-[92%]" placeholder="Search..." />
            {/* <Input className="w-[92%]" placeholder={"Search..."} /> */}
          </div>
        ) : null}

        {createRoom ? (
          <CreateRoom
            handleClose={handleClose}
            setRooms={setCreatedRoom}
            username={user?.username}
          />
        ) : null}
        <div className={'mt-2 h-[88vh] overflow-y-scroll'}>
        {loading ? (
          <Loader />
        ) : rooms.length ? (
          <div>
            {rooms.map((room) => (
              <Room room={room} openMessage={openMessage} />
            ))}
          </div>
        ) : (
          <div className="m-6">
            <div>
              <h1 className="text-3xl font-bold">
                {" "}
                Welcome to your inbox! Drop a line, share posts and more with
                private
              </h1>
              <h4 className={"my-2 text-gray-500"}>
                Start conversations between you and others on Twista
              </h4>
              <div className="flex justify-center items-center">
                <button
                  className="text-white rounded-full bg-blue-400 py-3 px-8 font-bold"
                  onClick={setCreateRoom}
                >
                  Write a message
                </button>
              </div>
            </div>
          </div>
        )}</div>
      </div>
      <div className={"col-span-1 relative  h-[100vh]"}>
        {roomLoading ? (
          <Loader />
        ) : (
          <ChatPanel
            sender={sender}
            room={room}
            messageHandler={messageHandler}
            setCreateRoom={handleClose}
            deleteMessage={deleteMessage}
          />
        )}
      </div>
    </div>
  );
};

export default Messages;
