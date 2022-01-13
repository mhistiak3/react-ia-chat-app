import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../context/auth";

const PublicRoute = ({ children }) => {
  const { user } = useContext(authContext);
  return !user ? children : <Navigate to="/" />;
};

export default PublicRoute;
