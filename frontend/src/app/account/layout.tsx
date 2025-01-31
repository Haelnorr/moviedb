"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AccountNavPanel from "../ui/components/account/accountNavPanel";
import useAuthenticatedUser from "../util/api/userSWR";
import { Suspense, useEffect } from "react";
import loginRedirectPath from "../util/api/loginredirect";

const AccountLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user, loading } = useAuthenticatedUser();
  const router = useRouter();
  const loggedOut = !user && !loading;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (loggedOut) {
      router.push(loginRedirectPath("login", pathname, searchParams));
    }
  }, [loggedOut, router, pathname, searchParams]);
  return (
    <Suspense>
      {user && !loading && (
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <AccountNavPanel />
            </div>
            <div className="col-md-9">{children}</div>
          </div>
        </div>
      )}
    </Suspense>
  );
};

export default AccountLayout;
