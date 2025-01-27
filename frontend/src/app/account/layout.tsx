import AccountNavPanel from "../ui/components/account/accountNavPanel";

const AccountLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <AccountNavPanel />
        </div>
        <div className="col-md-9">{children}</div>
      </div>
    </div>
  );
};

export default AccountLayout;
