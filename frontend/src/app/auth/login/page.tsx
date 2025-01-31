"use client";
import LoginForm from "@/components/auth/LoginForm";
import useAuthenticatedUser from "@/app/util/api/userSWR";
import LoginFormContextProvider from "@/contexts/loginform";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const router = useRouter();
  const { user, loading, mutateAuth } = useAuthenticatedUser();
  const loggedIn = user && !loading;

  const searchParams = useSearchParams();
  const pageFrom = searchParams.get("from");
  var returnTo = "/";
  if (pageFrom) {
    returnTo = `${decodeURIComponent(pageFrom)}`;
  }
  useEffect(() => {
    if (loggedIn) {
      router.push(returnTo);
    }
  }, [loggedIn, router, returnTo]);

  return (
    <div className="container">
      {!user && !loading && (
        <LoginFormContextProvider>
          <LoginForm onLogin={mutateAuth} />
        </LoginFormContextProvider>
      )}
    </div>
  );
};

export default LoginPage;
