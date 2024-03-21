import React from "react";

const Room = ({ room, openMessage }) => {
  return (
    <div className="flex items-center px-5 py-3 cursor-pointer hover:bg-black-50" onClick={() => openMessage(room?.slug)}>
        {room?.participant?.profile_picture ?
            <div className={'flex h-[50px] w-[50px] mr-2  rounded-full'}>
                <img alt={'img'} className={' rounded-full'} src={`http://localhost:8000/media/${room?.participant?.profile_picture}`}/>
            </div>
            : null}
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
      <span className="flex justify-center items-center ml-1 mx-1 text-sm text-gray-500 pb-2">
          .
        </span>
      <span
        className={'text-gray-500 text-sm font-normal'}
      >
        {room?.timestamp}
      </span>
    </div>
  );
};

export default Room;
