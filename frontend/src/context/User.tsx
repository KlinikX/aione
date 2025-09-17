"use client";

import { createContext } from "react";

export type User = {
  name?: string;
  email?: string;
  profilePicture?: string;
};

type UserContextType = {
  userState: User | null;
  setUserState: (userState: User) => void;
};

export const UserContext = createContext<UserContextType>({
  userState: null,
  setUserState: () => {},
});

export default UserContext;
