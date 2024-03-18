import React, { useContext } from "react";
import MessageHandler from "../MessageHandler/MessageHandler";
import Message from "../Message/Message";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const ChatPanel = ({ room, messageHandler, deleteMessage }) => {
  const { user } = useSelector((state) => state.reducer.reducer);
  const navigate = useNavigate();
  const navigateToProfile = () => {
    if (room?.participant) navigate(`/${room.participant.username}`);
  };
  return (
    <div className={"p-4"}>
      <div className={"text-xl font-semibold pb-5 flex justify-between"}>
        <span>
          {room?.participant ? room?.participant?.full_name : room?.name}
        </span>
        <button onClick={navigateToProfile}>
          <FontAwesomeIcon icon={faLocationArrow} />
        </button>
      </div>
      <div className={"h-[88vh] overflow-y-scroll pb-20"}>
        {/* <div
          className={
            "mt-4 text-center py-2 px-4 cursor-pointer hover:bg-gray-200"
          }
        >
          <div>
            {room?.participant ? room?.participant?.full_name : room?.name}
          </div>
          {room?.participant ? (
            <div className={"text-gray-600"}>
              @{room?.participant?.username}
            </div>
          ) : null}
          {room?.participant ? (
            <div className={"mt-4"}>{room?.participant?.biography}</div>
          ) : null}
          {room?.participant ? (
            <div className={"text-gray-600 mt-4"}>
              Joined on {room?.participant?.joining_date}
            </div>
          ) : null}
        </div> */}
        <div>
          {room?.messages?.map((message) => (
            <Message
              message={message}
              user={user}
              deleteMessage={deleteMessage}
            />
          ))}
        </div>
      </div>
      <MessageHandler messageHandler={messageHandler} />
    </div>
  );
};

export default ChatPanel;
