"use client";
import LoginForm from "@/components/auth/loginForm";
import useAuthenticatedUser from "@/app/util/api/userSWR";
import LoginFormContextProvider from "@/contexts/loginform";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const router = useRouter();
  const { user, loading, mutateAuth } = useAuthenticatedUser();
  const loggedIn = user && !loading;

  useEffect(() => {
    if (loggedIn) {
      router.push("/");
    }
  }, [user, loggedIn, router]);

  return (
    <>
      {!user && !loading && (
        <LoginFormContextProvider>
          <LoginForm onLogin={mutateAuth} />
        </LoginFormContextProvider>
      )}
    </>
  );
};

export default LoginPage;
