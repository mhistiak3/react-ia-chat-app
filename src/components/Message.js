import moment from "moment";
import { useEffect, useRef } from "react";
import Delete from "./svg/Delete";
const Message = ({ message, userOne, deleteMessage }) => {
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);
  const time = moment(message.createdAt.toDate()).fromNow();
  return (
    <div
      className={`message_wrapper ${message.from === userOne && "own"}`}
      ref={scrollRef}
    >
      <p className={`${message.from === userOne ? "me" : "friend"}`}>
        {message.media ? <img src={message.media} alt={message.text} /> : null}
        {message.text}
        <br />
        <small>{time}</small>
        {message.from === userOne && (
          <span
            className="delete_msg"
            onClick={() => deleteMessage(message.id, message.mediaPath)}
          >
            <Delete />
          </span>
        )}
      </p>
    </div>
  );
};

export default Message;
