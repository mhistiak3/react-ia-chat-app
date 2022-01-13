import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../context/auth";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(authContext);
  return user ? children : <Navigate to="register" />;
};

export default PrivateRoute;
