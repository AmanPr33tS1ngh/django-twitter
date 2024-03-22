import React, { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { Message } from "@chatscope/chat-ui-kit-react";

const MessageComponent = ({ message, user, deleteMessage }) => {
  const isUser = user?.username === message?.sender?.username;
  // const [showOptions, setShowOptions] = useState(false);
  // const [showEllipsis, setShowEllipsis] = useState(false);
  // const changeEllipsis = () => {
  //   if (showOptions) return;
  //   setShowEllipsis(!showEllipsis);
  // };
  // const changeOptions = () => {
  //   setShowOptions(!showOptions);
  // };
  return (
    <Message
      model={{
        message: message.content,
        sentTime: message.timestamp,
        sender: "Joe",
        direction: isUser ? "outgoing" : "incoming",
      }}
    />
    // <div>
    //   <div
    //     className={`flex ${
    //       isUser ? "justify-end" : "justify-start"
    //     } items-center mx-2 my-[1.2rem]`}
    //   >
    //     {isUser ? (
    //       showEllipsis ? (
    //         <button
    //           onClick={() => {
    //             changeOptions();
    //             setShowEllipsis(false);
    //           }}
    //           className={"pr-2"}
    //           onMouseOver={() => setShowEllipsis(true)}
    //           onMouseOut={() => setShowEllipsis(false)}
    //         >
    //           <FontAwesomeIcon icon={faEllipsis} />
    //         </button>
    //       ) : showOptions ? (
    //         <ul
    //           onMouseOut={changeOptions}
    //           className="shadow-custom text-xs font-light font-system mr-2 rounded-lg"
    //         >
    //           <button
    //             className="px-2 py-1 w-20"
    //             onClick={() => deleteMessage(message)}
    //           >
    //             Delete
    //           </button>
    //         </ul>
    //       ) : null
    //     ) : null}
    //     <span
    //       onMouseOver={changeEllipsis}
    //       onMouseOut={changeEllipsis}
    //       className={`
    //                px-4 py-3 rounded-full text-sm font-medium ${
    //                  isUser
    //                    ? " msg bg-blue-500  text-white"
    //                    : "bg-gray-300 bg-opacity-40 "
    //                }
    //               `}
    //     >
    //       {message.content}
    //     </span>
    //   </div>
    // </div>
  );
};

export default MessageComponent;
