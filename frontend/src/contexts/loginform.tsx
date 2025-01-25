"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type LoginFormContextProviderProps = {
  children: React.ReactNode;
};

type LoginFormContext = {
  username: string;
  password: string;
  setUsername: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
  errorUsername: string;
  errorCredentials: boolean;
  errorMessage: string;
  setErrorUsername: Dispatch<SetStateAction<string>>;
  setErrorCredentials: Dispatch<SetStateAction<boolean>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
};

export const LoginFormContext = createContext<LoginFormContext | null>(null);

export default function LoginFormContextProvider({
  children,
}: LoginFormContextProviderProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorUsername, setErrorUsername] = useState("");
  const [errorCredentials, setErrorCredentials] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <LoginFormContext.Provider
      value={{
        username,
        setUsername,
        password,
        setPassword,
        errorUsername,
        setErrorUsername,
        errorCredentials,
        setErrorCredentials,
        errorMessage,
        setErrorMessage,
      }}
    >
      {children}
    </LoginFormContext.Provider>
  );
}

export function useLoginFormContext() {
  const context = useContext(LoginFormContext);
  if (!context) {
    throw new Error(
      "LoginForm context should be used within LoginFormContextProvider",
    );
  }
  return context;
}
