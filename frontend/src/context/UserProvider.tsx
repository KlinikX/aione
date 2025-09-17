"use client";

import { ReactNode, useMemo, useState, useContext } from "react";
import { User, UserContext } from "./User";

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userState, setUserState] = useState<User | null>(null);

  const handleSetUserState = (userData: User) => {
    setUserState(userData);
  };

  const contextValue = useMemo(
    () => ({
      userState,
      setUserState: handleSetUserState,
    }),
    [userState]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
