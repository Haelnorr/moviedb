"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type RegisterFormContextProviderProps = {
  children: React.ReactNode;
};

type RegisterFormContext = {
  username: string;
  password: string;
  confirmPassword: string;
  setUsername: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  errorUsername: string;
  errorPasswords: string;
  errorMessage: string;
  setErrorUsername: Dispatch<SetStateAction<string>>;
  setErrorPasswords: Dispatch<SetStateAction<string>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
};

export const RegisterFormContext = createContext<RegisterFormContext | null>(
  null,
);

export default function RegisterFormContextProvider({
  children,
}: RegisterFormContextProviderProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorUsername, setErrorUsername] = useState("");
  const [errorPasswords, setErrorPasswords] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <RegisterFormContext.Provider
      value={{
        username,
        password,
        confirmPassword,
        setUsername,
        setPassword,
        setConfirmPassword,
        errorUsername,
        errorPasswords,
        errorMessage,
        setErrorUsername,
        setErrorPasswords,
        setErrorMessage,
      }}
    >
      {children}
    </RegisterFormContext.Provider>
  );
}

export function useRegisterFormContext() {
  const context = useContext(RegisterFormContext);
  if (!context) {
    throw new Error(
      "RegisterForm context should be used within RegisterFormContextProvider",
    );
  }
  return context;
}
