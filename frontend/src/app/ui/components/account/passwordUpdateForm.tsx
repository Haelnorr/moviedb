"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";
import useAuthenticatedUser from "@/app/util/api/userSWR";
import ConfirmPasswordModal from "@/components/auth/ConfirmPasswordModal";
import { SyncLoader } from "react-spinners";
import updatePassword from "@/app/util/api/updatepassword";

const PasswordUpdateForm = () => {
  const { loading, mutateAuth, isFresh } = useAuthenticatedUser();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [awaiting, setAwaiting] = useState(false);
  const [result, setResult] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (loading) {
    return <>Loading...</>;
  }

  function updatePasswordValue(value: string) {
    setResult("");
    setNewPassword(value);
  }

  function updateConfirmPassword(value: string) {
    setResult("");
    setConfirmNewPassword(value);
  }

  function resetInput() {
    setNewPassword("");
    setConfirmNewPassword("");
    setResult("");
  }

  async function handleSubmit(override = false) {
    if (newPassword != confirmNewPassword) {
      setResult("Passwords must match");
      return;
    }
    if (!isFresh && !override) {
      setShowConfirmPassword(true);
    } else {
      setAwaiting(true);
      const { error } = await updatePassword(newPassword, confirmNewPassword);
      if (error) {
        setResult("Error occured updating password");
        console.warn(`Error updating password: ${error}`);
      } else {
        resetInput();
        setResult("Successfully updated password!");
      }
      setAwaiting(false);
    }
  }
  const confirmPasswordCallback = (success: boolean) => {
    setShowConfirmPassword(false);
    mutateAuth();
    if (success) {
      handleSubmit(true);
    }
  };
  return (
    <div className="">
      <ConfirmPasswordModal
        isOpen={showConfirmPassword}
        callback={confirmPasswordCallback}
      />
      <input
        type="password"
        id="passwordInput"
        value={newPassword}
        className={clsx(`form-control ${styles["text-input"]}`, {
          "is-invalid": result.includes("match"),
        })}
        onChange={(e) => updatePasswordValue(e.target.value)}
        maxLength={64}
        placeholder="New Password"
      />
      <div className={styles.verticalspacerslim}></div>
      <input
        type="password"
        id="confirmPasswordInput"
        value={confirmNewPassword}
        className={clsx(`form-control ${styles["text-input"]}`, {
          "is-invalid": result.includes("match"),
        })}
        onChange={(e) => updateConfirmPassword(e.target.value)}
        maxLength={64}
        placeholder="Confirm Password"
      />
      <div
        className={clsx(styles.resultmessage, {
          [styles.nodisplay]: !result,
          [styles.resultbad]:
            result.includes("error") || result.includes("match"),
          [styles.resultgood]: !(
            result.includes("error") || result.includes("match")
          ),
        })}
      >
        {result}
      </div>
      <div
        className={clsx(styles.waitingindicator, {
          [styles.nodisplay]: !awaiting,
        })}
      >
        <SyncLoader size={8} margin={5} color="#cba6f7" />
      </div>
      <div
        className={clsx(styles.buttonwrapper, {
          [styles.nodisplay]: awaiting,
        })}
      >
        <button
          type="button"
          className={clsx(`btn btn-primary ${styles["focus-only-button"]}`, {
            [styles["hidden"]]: !newPassword && !confirmNewPassword,
          })}
          onClick={() => handleSubmit()}
        >
          Update
        </button>
        <button
          type="button"
          className={clsx(`btn btn-secondary ${styles["focus-only-button"]}`, {
            [styles["hidden"]]: !newPassword && !confirmNewPassword,
          })}
          onClick={resetInput}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
export default PasswordUpdateForm;
