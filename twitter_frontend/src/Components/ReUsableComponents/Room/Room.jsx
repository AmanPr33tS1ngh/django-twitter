import React from "react";

const Room = ({ room, openMessage }) => {
  return (
    <div className="p-3 cursor-pointer hover:bg-opacity-25" onClick={() => openMessage(room?.slug)}>
      <span style={{ fontWeight: 500 }}>
        {room?.participant ? room?.participant?.full_name : room?.name}
      </span>
      &nbsp;
      {room?.participant ? (
        <span
          className={'text-gray-500 text-sm font-normal'}
        >
          @{room?.participant?.username}
        </span>
      ) : null}
      &nbsp;
      <span
        className={'text-gray-500 text-sm font-normal'}
      >
        {room?.timestamp}
      </span>
    </div>
  );
};

export default Room;
