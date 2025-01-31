import Modal from "react-modal";
import styles from "./styles.module.css";
import FormButtonContainer from "./FormButtonContainer";

const ConfirmUsernameChangeModal = (props: {
  isOpen: boolean;
  callback: (success: boolean) => void;
}) => {
  Modal.setAppElement("#root");

  const closeModal = (success: boolean) => {
    props.callback(success);
  };

  return (
    <Modal
      isOpen={props.isOpen}
      className={styles.modal}
      overlayClassName={styles.modaloverlay}
    >
      <div className={styles.modalwrapper}>
        <h3 className={styles.modalheader}>Confirm Username Change</h3>
        <div className={styles.modalprompt}>
          Are you sure you want to change your username? This cannot be undone,
          and your old username will be free for others to take.
        </div>
        <form>
          <FormButtonContainer>
            <button
              type="button"
              className={"btn btn-primary"}
              onClick={() => closeModal(true)}
            >
              Confirm
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

export default ConfirmUsernameChangeModal;
