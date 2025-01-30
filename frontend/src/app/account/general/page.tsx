"use client";
import BioUpdateForm from "@/app/ui/components/account/bioUpdateForm";
import UsernameUpdateForm from "@/app/ui/components/account/usernameUpdateForm";
import loginRedirectPath from "@/app/util/api/loginredirect";
import useAuthenticatedUser from "@/app/util/api/userSWR";
import styles from "@/components/account/styles.module.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const AccountGeneral = () => {
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
          <span className={styles["account-content-title"]}>General</span>
          {!loading && (
            <div className={`container ${styles["account-content-container"]}`}>
              <div className="row">
                <div
                  className={`col-md-2 ${styles["account-settings-labels"]}`}
                >
                  Username
                </div>
                <div
                  className={`col-md-8 ${styles["account-settings-content"]}`}
                >
                  <UsernameUpdateForm
                    currentUsername={user!.username}
                    onChanged={mutateAuth}
                    isFresh={isFresh}
                  />
                </div>
              </div>
              <div className="row">
                <div
                  className={`col-md-2 ${styles["account-settings-labels"]}`}
                >
                  Bio
                </div>
                <div
                  className={`col-md-8 ${styles["account-settings-content"]}`}
                >
                  <BioUpdateForm
                    currentBio={user!.bio}
                    onChanged={mutateAuth}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default AccountGeneral;
