"use client";
import PasswordUpdateForm from "@/app/ui/components/account/passwordUpdateForm";
import styles from "@/components/account/styles.module.css";

const AccountSecurity = () => {
  return (
    <div className={styles["account-content-wrapper"]}>
      <span className={styles["account-content-title"]}>Security</span>
      <div className={`container ${styles["account-content-container"]}`}>
        <div className="row">
          <div className={`col-md-2 ${styles["account-settings-labels"]}`}>
            Change Password
          </div>
          <div className={`col-md-8 ${styles["account-settings-content"]}`}>
            <PasswordUpdateForm />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AccountSecurity;
