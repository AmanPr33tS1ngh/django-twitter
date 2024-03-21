import React, { useState } from "react";
import Input from "../Input/Input";

const MessageHandler = ({ messageHandler }) => {
  const [message, setMessage] = useState();
  const sendMessage = (e) => {
    e.preventDefault();
    messageHandler(message);
  };
  return (
    <div>
      <form
        className={"absolute w-[95%] bottom-0 bg-white"}
        onSubmit={sendMessage}
      >
        <Input
          placeholder={"Start a new message..."}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button
          disabled={!message?.trim()}
          className={
            "absolute top-1/3 w-[1.5rem] right-[0.5rem] text-blue-500 w-25 float-right top-15 cursor-pointer"
          }
          type="submit"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{ color: "rgb(29, 155, 240)" }}
          >
            <g>
              <path d="M2.504 21.866l.526-2.108C3.04 19.719 4 15.823 4 12s-.96-7.719-.97-7.757l-.527-2.109L22.236 12 2.504 21.866zM5.981 13c-.072 1.962-.34 3.833-.583 5.183L17.764 12 5.398 5.818c.242 1.349.51 3.221.583 5.183H10v2H5.981z" />
            </g>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MessageHandler;
