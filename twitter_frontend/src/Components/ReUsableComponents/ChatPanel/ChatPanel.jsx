import React, { useContext, useState } from "react";
import "./ChatPanel.css";
import MessageHandler from "../MessageHandler/MessageHandler";
import AuthContext from "../../Authentication/AuthProvider";

const ChatPanel = ({ room, messageHandler }) => {
  const { user } = useContext(AuthContext);
  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{
          fontSize: "20px",
          fontWeight: 500,
        }}
      >
        {room?.participant ? room?.participant?.full_name : room?.name}
      </div>
      <div
        style={{
          height: "92vh",
          overflow: "scroll",
        }}
      >
        <div id="profile">
          <div>
            {room?.participant ? room?.participant?.full_name : room?.name}
          </div>
          {room?.participant ? (
            <div style={{ color: "rgb(83, 100, 113)" }}>
              @{room?.participant?.username}
            </div>
          ) : null}
          {room?.participant ? (
            <div style={{ marginTop: "10px" }}>
              {room?.participant?.biography}
            </div>
          ) : null}
          {room?.participant ? (
            <div style={{ color: "rgb(83, 100, 113)", marginTop: "10px" }}>
              Joined on {room?.participant?.joining_date}
            </div>
          ) : null}
        </div>
        <div>
          {room?.messages?.map((message) => {
            const isUser = user?.name === message?.sender?.username;
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: isUser ? "flex-end" : "flex-start",
                  margin: "5px",
                }}
              >
                <span className={isUser ? "user-msg" : "receiver-msg"}>
                  {message.content}
                  {/* {console.log(
                    "messjojoage",
                    user?.name,
                    message?.sender?.username,
                    user?.name === message?.sender?.username
                  )} */}
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
