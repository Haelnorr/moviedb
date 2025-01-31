"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";
import updateBio from "@/app/util/api/updatebio";
import useAuthenticatedUser from "@/app/util/api/userSWR";
import { SyncLoader } from "react-spinners";

const BioUpdateForm = () => {
  const { user, loading, mutateAuth } = useAuthenticatedUser();
  const [changed, setChanged] = useState(false);
  const [newBio, setNewBio] = useState(user!.bio || "");
  const [awaiting, setAwaiting] = useState(false);
  const [result, setResult] = useState("");

  if (loading) {
    return <>Loading...</>;
  }

  function handleInput(value: string) {
    if (value.length <= 128) {
      setNewBio(value);
      setChanged(true);
      setResult("");
    }
  }
  function resetInput() {
    setNewBio(user!.bio || "");
    setChanged(false);
  }
  async function handleSave() {
    if (changed) {
      setAwaiting(true);
      const { error } = await updateBio(newBio);
      setAwaiting(false);
      if (error) {
        console.warn(`Error updating bio: ${error}`);
        setResult("An error occured");
      } else {
        setResult("Bio updated!");
        mutateAuth();
        setChanged(false);
      }
    }
  }
  return (
    <>
      <div className={styles["textarea-container"]}>
        <textarea
          className={`form-control ${styles["textarea-input"]}`}
          value={newBio}
          maxLength={128}
          onChange={(e) => handleInput(e.target.value)}
        />
        <span
          className={styles["textarea-char-count"]}
        >{`${newBio.length}/128`}</span>
      </div>
      <div
        className={clsx(styles.resultmessage, {
          [styles.nodisplay]: !result,
          [styles.resultbad]: result.includes("error"),
          [styles.resultgood]: !result.includes("error"),
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
            [styles.hidden]: !changed,
          })}
          onClick={handleSave}
        >
          Update
        </button>
        <button
          type="button"
          className={clsx(`btn btn-secondary ${styles["focus-only-button"]}`, {
            [styles.hidden]: !changed,
          })}
          onClick={resetInput}
        >
          Cancel
        </button>
      </div>
    </>
  );
};
export default BioUpdateForm;
