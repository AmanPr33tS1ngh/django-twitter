import React, { useContext, useState } from "react";
import Input from "../Input/Input";
import AuthContext from "../../Authentication/AuthProvider";
import axios from "axios";
import { useParams } from "react-router-dom";

const MessageHandler = ({ messageHandler }) => {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState();
  const sendMessage = (e) => {
    e.preventDefault();
    const data = {
      username: user?.name,
      message: message,
      slug: slug,
    };
    const endpoint = "http://127.0.0.1:8000/chat/send_message/";
    axios.post(endpoint, data).then((res) => {
      let responseData = res.data;
      // console.log("ressss papapapappap", responseData);
      setMessage("");
      messageHandler(responseData.message);
    });
  };
  return (
    <div>
      <form
        style={{
          position: "absolute",
          width: "100%",
          bottom: "10px",

          background: "white",
        }}
        onSubmit={sendMessage}
      >
        <Input
          placeholder={"Start a new message..."}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button
          disabled={!message?.trim()}
          style={{
            position: "absolute",
            top: "30%",
            width: "20px",
            right: "10%",
          }}
          type="submit"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{ color: "rgb(29, 155, 240)" }}
          >
            <g>
              <path d="M2.504 21.866l.526-2.108C3.04 19.719 4 15.823 4 12s-.96-7.719-.97-7.757l-.527-2.109L22.236 12 2.504 21.866zM5.981 13c-.072 1.962-.34 3.833-.583 5.183L17.764 12 5.398 5.818c.242 1.349.51 3.221.583 5.183H10v2H5.981z"></path>
            </g>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MessageHandler;
