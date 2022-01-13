import {  signInWithEmailAndPassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setData({ ...data, loading: true });
      // Login user
      const result = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update user data in firestore
      const id = result.user.uid;

      await updateDoc(doc(db, "users", id), {
        isOnline: true,
      });

      // Reset
      setData({
        email: "",
        password: "",
        loading: false,
        error: null,
      });
      navigate("/");
    } catch (error) {
      setData({ ...data, loading: false, error: error.message });

      console.log(error);
    }
  };
  return (
    <section>
      <h3>Login to iA Chat</h3>
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <div className="input_container">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div className="input_container">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div className="btn_container">
          <button className="btn" type="submit" disabled={data.loading}>
            {data.loading ? "Login to account..." : "Login"}
          </button>
        </div>
        {data.error && <p className="error">{data.error}</p>}
      </form>
    </section>
  );
};

export default Login;
