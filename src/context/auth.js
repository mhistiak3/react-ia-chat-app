import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import Loading from "../components/Loading";
import { auth } from "../firebase";

export const authContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <authContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
export default AuthProvider;
