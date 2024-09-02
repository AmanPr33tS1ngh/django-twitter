import React from "react";
import {
  ConversationList,
  Conversation,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

const Room = ({ room, openMessage }) => {
  return (
    <ConversationList>
      {console.log("rrorrororororororor", room)}
      <Conversation
        onClick={() => openMessage(room?.slug)}
        info={
          room.last_message?.content
            ? `${room.last_message?.content} ${room.last_message?.timestamp}`
            : null
        }
        name={room?.participant ? room?.participant?.full_name : room?.name}
      >
        <Avatar
          className="flex h-[50px] w-[50px] mr-2 rounded-full"
          name={room?.participant ? room?.participant?.full_name : room?.name}
          src={
            room?.participant?.profile_picture
              ? room?.participant?.profile_picture
              : "https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg"
          }
        />
      </Conversation>
    </ConversationList>
  );
};

export default Room;
