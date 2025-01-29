"use client";
import { loginRedirectPath } from "@/app/util/api/loginredirect";
import useAuthenticatedUser from "@/app/util/api/userSWR";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import styles from "@/components/account/styles.module.css";

const AccountPreferences = () => {
  const router = useRouter();
  const { user, loading } = useAuthenticatedUser();
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
          <span className={styles["account-content-title"]}>Preferences</span>
          {!loading && (
            <div className={`container ${styles["account-content-container"]}`}>
              <div className="row">
                <div
                  className={`col-md-2 ${styles["account-settings-labels"]}`}
                ></div>
                <div
                  className={`col-md-8 ${styles["account-settings-content"]}`}
                >
                  Nothing here yet
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default AccountPreferences;
