"use client";
import BioUpdateForm from "@/app/ui/components/account/bioUpdateForm";
import UsernameUpdateForm from "@/app/ui/components/account/usernameUpdateForm";
import styles from "@/components/account/styles.module.css";
import { Suspense } from "react";

const AccountGeneral = () => {
  return (
    <Suspense>
      <div className={styles["account-content-wrapper"]}>
        <span className={styles["account-content-title"]}>General</span>
        <div className={`container ${styles["account-content-container"]}`}>
          <div className="row">
            <div className={`col-md-2 ${styles["account-settings-labels"]}`}>
              Username
            </div>
            <div className={`col-md-8 ${styles["account-settings-content"]}`}>
              <UsernameUpdateForm />
            </div>
          </div>
          <div className="row">
            <div className={`col-md-2 ${styles["account-settings-labels"]}`}>
              Bio
            </div>
            <div className={`col-md-8 ${styles["account-settings-content"]}`}>
              <BioUpdateForm />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};
export default AccountGeneral;
