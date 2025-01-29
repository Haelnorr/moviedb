import { useState } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

const UsernameUpdateForm = (props: {
  currentUsername: string;
  onChanged: Function;
  isFresh: boolean;
}) => {
  const [changed, setChanged] = useState(false);
  const [valid, setValid] = useState(false);
  const [newUsername, setNewUsername] = useState(props.currentUsername);
  const [loading, setLoading] = useState(false);
  function handleInput(value: string) {
    setNewUsername(value);
    setChanged(true);
    setValid(false);
  }
  function resetInput() {
    setNewUsername(props.currentUsername);
    setChanged(false);
    setValid(false);
  }
  function handleCheckUpdate() {
    if (changed && !valid) {
      // TODO: do username check, hide buttons and show loading wheel
      // when search is done, either show validation error, or change
      // valid to true
      setValid(true);
    } else if (changed && valid) {
      if (!props.isFresh) {
        // TODO: prompt user to confirm password
        console.log("token not fresh");
      } else {
        // TODO: prompt user to confirm with warning
        // TODO: update server with new username
      }
    }
  }
  return (
    <>
      <input
        type="text"
        className={`form-control ${styles["text-input"]}`}
        value={newUsername}
        onChange={(e) => handleInput(e.target.value)}
        maxLength={64}
      />
      <div className={styles.buttonwrapper}>
        <button
          type="button"
          className={clsx(`btn ${styles["focus-only-button"]}`, {
            [styles["hidden"]]: !changed,
            "btn-warning": changed && !valid,
            "btn-primary": changed && valid,
          })}
          onClick={handleCheckUpdate}
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
