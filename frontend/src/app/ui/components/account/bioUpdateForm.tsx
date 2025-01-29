import { useState } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

const BioUpdateForm = (props: { currentBio: string; onChanged: Function }) => {
  const [changed, setChanged] = useState(false);
  const [newBio, setNewBio] = useState(props.currentBio);
  function handleInput(value: string) {
    if (value.length <= 128) {
      setNewBio(value);
      setChanged(true);
    }
  }
  function resetInput() {
    setNewBio(props.currentBio);
    setChanged(false);
  }
  function handleSave() {
    if (changed) {
      // TODO: handle saving of the users new bio to the server
      // hide the buttons and show a spinny wheel
      // when data updated, show success message that fades out slowly
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
      <div className={styles.buttonwrapper}>
        <button
          type="button"
          className={clsx(`btn btn-primary ${styles["focus-only-button"]}`, {
            [styles["hidden"]]: !changed,
          })}
          onClick={handleSave}
        >
          Update
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
export default BioUpdateForm;
