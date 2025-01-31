import Modal from "react-modal";
import styles from "./styles.module.css";
import { useState } from "react";
import clsx from "clsx";
import FormButtonContainer from "./FormButtonContainer";
import useAuthenticatedUser from "@/app/util/api/userSWR";
import loginUser from "@/app/util/api/loginuser";

const confirmPasswordModal = (props: {
  isOpen: boolean;
  callback: Function;
}) => {
  Modal.setAppElement("#root");

  const { user } = useAuthenticatedUser();
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");

  const closeModal = (success: boolean) => {
    setPassword("");
    setErrorMessage("");
    props.callback(success);
  };

  async function handleSubmit() {
    if (!password) {
      setErrorMessage("Please enter your password");
      return;
    }
    const { login, error } = await loginUser(user!.username, password);
    if (!login && error === "Unauthorized") {
      setErrorMessage("Incorrect password");
      return;
    }
    if (error) {
      console.warn(error);
      setErrorMessage("An error occured");
      return;
    }
    closeModal(true);
  }

  function updateValue(value: string) {
    setPassword(value);
    setErrorMessage("");
  }

  function handlePasswordKeyDown(key: string) {
    if (key === "Enter") {
      handleSubmit();
    }
  }
  return (
    <Modal
      isOpen={props.isOpen}
      className={styles.modal}
      overlayClassName={styles.modaloverlay}
    >
      <div className={styles.modalwrapper}>
        <h3 className={styles.modalheader}>Confirm Password</h3>
        <div className={styles.modalprompt}>
          To perform this action you need to confirm your password.
        </div>
        <form>
          <div className="form-floating mb-3">
            <input
              type="password"
              className={clsx("form-control", {
                "is-invalid": errorMessage.includes("password"),
              })}
              id="passwordInput"
              onChange={(e) => updateValue(e.target.value)}
              onKeyDown={(e) => handlePasswordKeyDown(e.key)}
              placeholder=""
              required
            />
            <label htmlFor="passwordInput" className="form-label">
              Password
            </label>
            {errorMessage && (
              <div id="unknownErrorFeedback" className={styles.error}>
                {errorMessage}
              </div>
            )}
          </div>
          <FormButtonContainer>
            <button
              type="button"
              className={"btn btn-primary"}
              onClick={handleSubmit}
            >
              Success
            </button>
            <button
              type="button"
              className={"btn btn-secondary"}
              onClick={() => closeModal(false)}
            >
              Cancel
            </button>
          </FormButtonContainer>
        </form>
      </div>
    </Modal>
  );
};

export default confirmPasswordModal;
