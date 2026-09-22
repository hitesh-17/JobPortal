import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  logoutUser,
  refreshAccessToken,
} from "../API/auth.api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        try {
          const data = await getCurrentUser();
          setUser(data.user);
        } catch (error) {
          if (error.response?.status !== 401) {
            throw error;
          }
        }

        try {
          await refreshAccessToken();
          const data = await getCurrentUser();

          setUser(data.user);
        } catch (newError) {
          if (newError.response?.status === 401) {
            setUser(null);
            return;
          }

          throw refreshError;
        }
      } catch (error) {
        // console.log("current user", error);
        setErr(error.response?.data?.message || "user is unauthenticated");

        setUser(null);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      setErr(null);

      await logoutUser();
      setUser(null);
    } catch (error) {
      // console.log("logout Error", error);
      setErr(error.response?.data?.message || "Logout failed");
    } finally {
      setLoading(false);
      navigate("/");
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        err,
        setErr,
        logout,
        authChecked,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
