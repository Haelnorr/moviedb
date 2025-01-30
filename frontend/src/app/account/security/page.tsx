"use client";
import loginRedirectPath from "@/app/util/api/loginredirect";
import useAuthenticatedUser from "@/app/util/api/userSWR";
import styles from "@/components/account/styles.module.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const AccountSecurity = () => {
  const router = useRouter();
  const { user, loading, mutateAuth, isFresh } = useAuthenticatedUser();
  const loggedOut = !user && !loading;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (loggedOut) {
      router.push(loginRedirectPath("login", pathname, searchParams));
    }
  }, [user, loggedOut, router, pathname, searchParams]);
  return (
    <>
      {!loggedOut && (
        <div className={styles["account-content-wrapper"]}>
          <span className={styles["account-content-title"]}>Security</span>
          {!loading && (
            <div className={`container ${styles["account-content-container"]}`}>
              <div className="row">
                <div
                  className={`col-md-2 ${styles["account-settings-labels"]}`}
                >
                  Change Password
                </div>
                <div
                  className={`col-md-8 ${styles["account-settings-content"]}`}
                >
                  change password form
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default AccountSecurity;
