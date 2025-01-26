"use client";
import RegisterForm from "@/components/auth/RegisterForm";
import useAuthenticatedUser from "@/app/util/api/userSWR";
import RegisterFormContextProvider from "@/contexts/registerform";
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
  }, [user, loggedIn, router]);

  return (
    <div className="container">
      {!user && !loading && (
        <RegisterFormContextProvider>
          <RegisterForm onLogin={mutateAuth} />
        </RegisterFormContextProvider>
      )}
    </div>
  );
};

export default LoginPage;
