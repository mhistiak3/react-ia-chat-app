import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "./styles/App.css";
import Navabar from "./components/Navabar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AuthProvider from "./context/auth";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Profile from "./pages/Profile";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navabar />
        <Routes>

          {/* Private Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Public Routes */}
          <Route
            path="login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
