import { doc, updateDoc } from "firebase/firestore";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../context/auth";
import { auth, db } from "../firebase";
import Switch from "./Switch";

const Navabar = () => {
  const { user } = useContext(authContext);
  const navigate = useNavigate();
  const logout = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await auth.signOut();
    navigate("/");
  };

  return (
    <nav>
      <h3>
        <Link to="/">iA Chat</Link>
      </h3>
      <Switch />
      <div>
        {user ? (
          <>
            <Link to="profile">Profile</Link>
            <button className="btn" onClick={() => logout()}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="register">Register</Link>
            <Link to="login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navabar;
