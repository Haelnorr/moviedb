"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";
import useAuthenticatedUser from "@/app/util/api/userSWR";
import ConfirmPasswordModal from "@/components/auth/ConfirmPasswordModal";
import ConfirmUsernameChangeModal from "../auth/ConfirmUsernameChangeModal";
import checkUsernameExists from "@/app/util/api/checkusernameexists";
import { SyncLoader } from "react-spinners";
import updateUsername from "@/app/util/api/updateusername";

const UsernameUpdateForm = () => {
  const { user, loading, mutateAuth, isFresh } = useAuthenticatedUser();
  if (loading) {
    return <>Loading...</>;
  }
  const [newUsername, setNewUsername] = useState(user!.username);
  const [changed, setChanged] = useState(false);
  const [valid, setValid] = useState(false);
  const [checked, setChecked] = useState(false);
  const [awaiting, setAwaiting] = useState(false);
  const [result, setResult] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmUsernameChange, setShowConfirmUsernameChange] =
    useState(false);

  function handleInput(value: string) {
    if (value === user!.username) {
      setChanged(false);
    } else {
      setChanged(true);
    }
    setNewUsername(value);
    setValid(false);
    setChecked(false);
    setResult("");
  }

  function validateInput(target: HTMLInputElement) {
    const validFormat = new RegExp("^[A-Za-z0-9_-]*$");
    const valid = validFormat.test(target.value);
    if (!valid) {
      target.value = newUsername;
      setChecked(true);
    } else {
      handleInput(target.value);
    }
  }

  function resetInput() {
    setNewUsername(user!.username);
    setChanged(false);
    setValid(false);
    setChecked(false);
  }
  async function handleCheckUpdate(override = false) {
    if (changed && !valid) {
      setAwaiting(true);
      await checkUsername();
      setAwaiting(false);
    } else if (changed && valid) {
      if (!isFresh && !override) {
        setShowConfirmPassword(true);
      } else {
        setShowConfirmUsernameChange(true);
      }
    }
  }
  async function checkUsername() {
    const { exists, error } = await checkUsernameExists(newUsername);
    if (error) {
      setResult("An error occured checking your username.");
    } else if (exists) {
      setResult("Username is taken.");
    } else if (!error && !exists) {
      setValid(true);
      setResult("Username is available!");
    }
    setChecked(true);
  }
  const confirmPasswordCallback = (success: boolean) => {
    setShowConfirmPassword(false);
    mutateAuth();
    if (success) {
      handleCheckUpdate(true);
    }
  };
  const confirmUsernameChangeCallback = async (success: boolean) => {
    setShowConfirmUsernameChange(false);
    if (success) {
      setAwaiting(true);
      const { error } = await updateUsername(newUsername);
      if (error) {
        console.warn(`Failed to update bio: ${error}`);
        setResult("An error occured");
      } else {
        setResult("Username updated!");
        mutateAuth();
        setChanged(false);
        setChecked(false);
        setValid(false);
      }
      setAwaiting(false);
    }
  };
  return (
    <>
      <ConfirmPasswordModal
        isOpen={showConfirmPassword}
        callback={confirmPasswordCallback}
      />
      <ConfirmUsernameChangeModal
        isOpen={showConfirmUsernameChange}
        callback={confirmUsernameChangeCallback}
      />
      <input
        type="text"
        className={clsx(`form-control ${styles["text-input"]}`, {
          "is-valid": checked && valid,
          "is-invalid": checked && !valid,
        })}
        value={newUsername}
        onChange={(e) => validateInput(e.target)}
        maxLength={64}
      />
      <div
        className={clsx(styles.resultmessage, {
          [styles.nodisplay]: !result,
          [styles.resultbad]:
            result.includes("error") || result.includes("taken"),
          [styles.resultgood]: !(
            result.includes("error") || result.includes("taken")
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
          className={clsx(`btn ${styles["focus-only-button"]}`, {
            [styles["hidden"]]: !changed,
            "btn-warning": changed && !valid,
            "btn-primary": changed && valid,
          })}
          onClick={() => handleCheckUpdate()}
        >
          {!valid && "Check"}
          {changed && valid && "Update"}
        </button>
        <button
          type="button"
          className={clsx(`btn btn-secondary ${styles["focus-only-button"]}`, {
            [styles["hidden"]]: !changed,
          })}
          onClick={resetInput}
        >
          Cancel
        </button>
      </div>
    </>
  );
};
export default UsernameUpdateForm;
