"use client";
import AccountNavPanel from "../ui/components/account/accountNavPanel";
import useAuthenticatedUser from "../util/api/userSWR";

const AccountLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user, loading } = useAuthenticatedUser();
  return (
    <>
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
    </>
  );
};

export default AccountLayout;
