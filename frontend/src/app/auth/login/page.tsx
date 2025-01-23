"use client";
import LoginForm from "@/components/auth/loginForm";
import useAuthenticatedUser from "@/util/api/auth";
import LoginFormContextProvider from "@/contexts/loginform";
import { redirect } from "next/navigation";

const LoginPage = () => {
  const { user, loggedOut, loading } = useAuthenticatedUser();
  const loggedIn = user && !loggedOut && !loading;
  if (loggedIn) {
    redirect("/");
  }
  return (
    <>
      <LoginFormContextProvider>
        <LoginForm />
      </LoginFormContextProvider>
    </>
  );
};

export default LoginPage;
