import React from "react";
import "./Room.css";
const Room = ({ room, openMessage }) => {
  return (
    <div className="room" onClick={() => openMessage(room?.slug)}>
      <span style={{ fontWeight: 500 }}>
        {room?.participant ? room?.participant?.full_name : room?.name}
      </span>
      &nbsp;
      {room?.participant ? (
        <span
          style={{
            color: "rgb(83, 100, 113)",
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          @{room?.participant?.username}
        </span>
      ) : null}
      &nbsp;
      <span
        style={{
          color: "rgb(83, 100, 113)",
          fontSize: "14px",
          fontWeight: 400,
        }}
      >
        {room?.timestamp}
      </span>
    </div>
  );
};

export default Room;
