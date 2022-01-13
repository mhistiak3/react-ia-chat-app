import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";

const Register = () => {
  const [data, setData] = useState({
    name: "",
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
      // Register user
      const result = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Save user data in firestore
      const id = result.user.uid;

      await setDoc(doc(db, "users", id), {
        uid: result.user.uid,
        name: data.name,
        email: data.email,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
      });

      // Reset
      setData({
        name: "",
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
      <h3>Create a Account</h3>
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <div className="input_container">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
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
            {data.loading ? "Registering..." : "Register"}
          </button>
        </div>
        {data.error && <p className="error">{data.error}</p>}
      </form>
    </section>
  );
};

export default Register;
