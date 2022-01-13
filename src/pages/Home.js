import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import User from "../components/User";
import "../styles/Home.css";
import MessageForm from "../components/MessageForm";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import Message from "../components/Message";
const Home = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [msg, setMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterUser, setFilterUser] = useState([]);

  const [responsive, setResponsive] = useState(false);
  const userOne = auth.currentUser.uid;

  useEffect(() => {
    setLoading(true);
    // create ref
    const userRef = collection(db, "users");
    // Create Query Object
    const queryObj = query(userRef, where("uid", "not-in", [userOne]));
    // Execute Query
    const unsub = onSnapshot(queryObj, (querySnapshot) => {
      let usersArray = [];
      querySnapshot.forEach((doc) => {
        usersArray.push(doc.data());
      });
      setUsers(usersArray);
      setFilterUser(usersArray);
      setLoading(false);
    });
    return () => unsub();
  }, [userOne]);

  // Select User
  const userSelect = async (user) => {
    setChat(user);
    const userTow = user.uid;
    const id =
      userOne > userTow ? `${userOne + userTow}` : `${userTow + userOne}`;

    const messagesRef = collection(db, "messages", id, "chat");
    const queryObject = query(messagesRef, orderBy("createdAt", "asc"));
    onSnapshot(queryObject, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        const id = doc.ref.id;
        messages.push({ ...doc.data(), id });
      });
      setMsg(messages);
    });

    const docSnap = await getDoc(doc(db, "lastMessage", id));
    if (docSnap.exists() && docSnap.data()?.from !== userOne) {
      await updateDoc(doc(db, "lastMessage", id), { unread: false });
    }
    setResponsive(true);
  };
  // Search User
  const handleSearch = (searchQuery) => {
    setSearch(searchQuery);
    if (searchQuery === "") {
      setFilterUser(users);
    } else {
      const filtered = users.filter((user) => {
        return user.name.toLowerCase().includes(search.toLowerCase());
      });

      setFilterUser(filtered);
    }
  };

  // Submit Message
  const handleSumit = async (e) => {
    e.preventDefault();
    try {
      const userTow = chat.uid;
      const id =
        userOne > userTow ? `${userOne + userTow}` : `${userTow + userOne}`;
      let url;
      let path;
      if (image) {
        const imageRef = ref(
          storage,
          `images/${new Date().getTime()} - ${image.name}`
        );

        const snap = await uploadBytes(imageRef, image);
        const ImageUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
        url = ImageUrl;
        path = snap.ref.fullPath;
      }
      await addDoc(collection(db, "messages", id, "chat"), {
        text,
        from: userOne,
        to: userTow,
        createdAt: Timestamp.fromDate(new Date()),
        media: url || "",
        mediaPath: path || "",
      });
      await setDoc(doc(db, "lastMessage", id), {
        text,
        from: userOne,
        to: userTow,
        createdAt: Timestamp.fromDate(new Date()),
        media: url || "",

        unread: true,
      });
      setText("");
      setImage("");
    } catch (error) {
      console.log(error.message);
    }
  };

  // Delete Message
  const deleteMessage = async (megID, imagePath) => {
    try {
      const userTow = chat.uid;
      const id =
        userOne > userTow ? `${userOne + userTow}` : `${userTow + userOne}`;
      if (imagePath) {
        await deleteObject(ref(storage, imagePath));
      }
      await deleteDoc(doc(db, "messages", id, "chat", megID));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="home_container">
      <div className="users_container">
        <div className="search_bar">
          <input
            type="text"
            placeholder="Search User..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <h4 style={{ textAlign: "center", padding: "10px" }}>Loading...</h4>
        ) : users.length > 0 ? (
          filterUser.map((user) => (
            <User
              key={user.uid}
              user={user}
              userSelect={userSelect}
              userOne={userOne}
              chat={chat}
            />
          ))
        ) : (
          <h2 style={{ textAlign: "center", marginTop: "30px" }}>
            No User Loggend in
          </h2>
        )}
      </div>
      <div className={`messages_container ${responsive ? "show" : "hide"}`}>
        {chat ? (
          <>
            <div className="messages_user">
              <span onClick={() => setResponsive(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </span>
              <img
                src={
                  chat.avatar
                    ? chat.avatar
                    : "https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/avat-01-512.png"
                }
                alt=""
              />
              <h3>{chat.name}</h3>
            </div>
            <div className="messages">
              {msg.length > 0 ? (
                msg.map((message, index) => (
                  <Message
                    key={index}
                    message={message}
                    userOne={userOne}
                    deleteMessage={deleteMessage}
                  />
                ))
              ) : (
                <h3>Start Conversation with {chat.name}</h3>
              )}
            </div>
            <MessageForm
              handleSumit={handleSumit}
              text={text}
              setText={setText}
              setImage={setImage}
            />
          </>
        ) : (
          <h2 className="no_conversation">
            Select a Chat to Start Conversation
          </h2>
        )}
      </div>
    </div>
  );
};

export default Home;
