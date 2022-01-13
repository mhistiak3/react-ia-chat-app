import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const User = ({ user, userSelect, userOne, chat }) => {
  const userTow = user?.uid;
  const [data, setData] = useState("");
  useEffect(() => {
    const id =
      userOne > userTow ? `${userOne + userTow}` : `${userTow + userOne}`;
    let unsub = onSnapshot(doc(db, "lastMessage", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, [userOne, userTow]);

  return (
    <>
      <div
        className={`user_wrapper ${chat.name === user.name && "selected_user"}`}
        onClick={() => userSelect(user)}
      >
        <div className="user_info">
          <div className="user_details">
           
            <img
              src={
                user.avatar ||
                "https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/avat-01-512.png"
              }
              alt="avatar"
            />
            <h4>{user.name}</h4>
            {data?.from !== userOne && data?.unread && (
              <small className="unread">New</small>
            )}
          </div>
          <div
            className={`user_status ${user.isOnline ? "online" : "offline"}`}
            title={user.isOnline ? "online" : "offline"}
          ></div>
        </div>
        {data && (
          <>
            <p className="lastMessage">
              <strong>{data?.from === userOne && "Me: "} </strong>
              {data.text}
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default User;
