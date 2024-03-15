import React, { useContext, useState } from "react";
import MessageHandler from "../MessageHandler/MessageHandler";
import AuthContext from "../../Authentication/AuthProvider";

const ChatPanel = ({ room, messageHandler }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className={"p-4"}>
      <div className={"text-xl font-semibold pb-5"}>
        {room?.participant ? room?.participant?.full_name : room?.name}
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
          {room?.messages?.map((message) => {
            const isUser = user?.name === message?.sender?.username;
            const [showOptions, setShowOptions] = useState(false);
            return (
              <div
                className={`flex ${
                  isUser ?  "justify-end":"justify-start" 
                } items-center mx-2 my-[1.2rem]`}
              >
                  {isUser ? <span className={'options'}>hello world</span>:null}
                <span
                  className={`
                   px-4 py-3 rounded-full text-sm font-medium ${
                    isUser
                      ? " msg bg-blue-500  text-white"
                      : "bg-gray-300 bg-opacity-40 "
                  }
                  `}
                >
                  {message.content}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <MessageHandler messageHandler={messageHandler} />
    </div>
  );
};

export default ChatPanel;
