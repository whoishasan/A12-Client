import { auth } from "@/firebase.config";
import { axiosSecure } from "@/hooks/axiosSecure";
import { SilentLogout } from "@/hooks/Logout";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

// Created AuthContext
const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [authData, setauthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const unSubscribe = () => {
    return onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const tokenResponse = await axiosSecure.post(
            `/auth/create-token?uid=${user.uid}`
          );
          if (!tokenResponse || !tokenResponse.data) {
            toast.error("Something went wrong");
            return;
          }
          setTimeout(async () => {
            const userResponse = await axiosSecure.get(
              `/auth/user?uid=${user.uid}`
            );
            if (userResponse?.data) {
              setauthData(userResponse.data);
              setIsLoading(false);
            } else {
              signOut(auth);
              setauthData(null);
              setIsLoading(false);
            }
          }, 800);
        }
        if (!user) {
          setauthData(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error verifying user:", err);
        setauthData(null);
        signOut(auth).then(() => {
          SilentLogout();
        });
      }
    });
  };

  useEffect(() => {
    const unsubscribe = unSubscribe();
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authData,
        setauthData,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
