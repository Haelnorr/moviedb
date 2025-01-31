"use client";
import styles from "@/components/account/styles.module.css";
import { Suspense } from "react";

const AccountPreferences = () => {
  return (
    <Suspense>
      <div className={styles["account-content-wrapper"]}>
        <span className={styles["account-content-title"]}>Preferences</span>
        <div className={`container ${styles["account-content-container"]}`}>
          <div className="row">
            <div
              className={`col-md-2 ${styles["account-settings-labels"]}`}
            ></div>
            <div className={`col-md-8 ${styles["account-settings-content"]}`}>
              Nothing here yet
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};
export default AccountPreferences;
