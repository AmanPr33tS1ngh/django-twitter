import React from "react";
import MessageHandler from "../MessageHandler/MessageHandler";
import Message from "../Message/Message";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../Loader/Loader";

const ChatPanel = ({ room, messageHandler, deleteMessage, setCreateRoom }) => {
  const { user } = useSelector((state) => state.reducer.reducer);
  const navigate = useNavigate();
  const navigateToProfile = () => {
    if (room?.participant) navigate(`/${room.participant.username}`);
  };
  return room?.slug ? (
    <div className={"p-4"}>
      <div onClick={navigateToProfile} className={"text-xl font-semibold pb-5 flex justify-between"}>
          <div className={'flex items-center'}>
          {room?.participant?.profile_picture ? <div className={'flex h-[30px] w-[30px] mr-2  rounded-full'}>
                <img alt={'img'} className={' rounded-full'} src={`http://localhost:8000/media/${room.participant.profile_picture}`}/>
            </div>: null}
        <span>
            {console.log("checkaaa", room)}
          {room?.participant ? room?.participant?.full_name : room?.name}
        </span></div>
        <button>
          <FontAwesomeIcon icon={faLocationArrow} />
        </button>
      </div>
      {/*  <InfiniteScroll*/}
      {/*  next={getMessages}*/}
      {/*  hasMore={hasNext}*/}
      {/*  loader={<Loader />}*/}
      {/*  dataLength={room?.messages?.length}*/}
      {/*  inverse={true}*/}
      {/*  className={" pb-30"}>*/}
      {/*    /!*overflow-y-scroll h-[85vh]*!/*/}
      {/*    {room?.messages?.map((message) => (*/}
      {/*      <Message*/}
      {/*        message={message}*/}
      {/*        user={user}*/}
      {/*        deleteMessage={deleteMessage}*/}
      {/*      />*/}
      {/*    ))}*/}
      {/*</InfiniteScroll>*/}
      <div className={"overflow-y-scroll h-[85vh] pb-30"}>
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
  ) : (
    <div className=" flex justify-center items-center h-[100vh] m-10">
      <div>
        <h1 className="text-3xl font-bold"> Select a message</h1>
        <h4 className={"my-2 text-gray-500"}>
          Choose from your existing conversations, start a new one, or just keep
          swimming.
        </h4>
        <div className="flex justify-center items-center">
          <button
            className="text-white rounded-full bg-blue-400 py-3 px-8 font-bold"
            onClick={setCreateRoom}
          >
            New message
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
