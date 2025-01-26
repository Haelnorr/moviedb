"use client";
import styles from "@/components/auth/styles.module.css";
import { loginUser } from "@/app/util/api/loginuser";
import { useLoginFormContext } from "@/contexts/loginform";
import clsx from "clsx";
import FormSubmit from "./SubmitButton";
import FormButtonContainer from "./FormButtonContainer";
const FormUsername = (props: { onKeyDown: Function }) => {
  const {
    setUsername,
    errorCredentials,
    errorUsername,
    setErrorCredentials,
    setErrorUsername,
  } = useLoginFormContext();
  function updateValue(value: string) {
    setUsername(value);
    setErrorUsername("");
    setErrorCredentials(false);
  }
  return (
    <div className="form-floating mb-3">
      <input
        type="text"
        className={clsx("form-control", {
          "is-invalid": errorCredentials || errorUsername,
        })}
        id="usernameInput"
        onChange={(e) => updateValue(e.target.value)}
        onKeyDown={(e) => props.onKeyDown(e.key)}
        placeholder=""
        required
      />
      <label htmlFor="usernameInput" className="form-label">
        Username
      </label>
      {errorUsername && (
        <div
          id="usernameInputFeedback"
          className={`invalid-feedback ${styles.error}`}
        >
          {errorUsername}
        </div>
      )}
    </div>
  );
};

const FormPassword = (props: { onKeyDown: Function }) => {
  const { setPassword, errorCredentials, setErrorCredentials, errorMessage } =
    useLoginFormContext();
  function updateValue(value: string) {
    setPassword(value);
    setErrorCredentials(false);
  }
  return (
    <div className="form-floating mb-3">
      <input
        type="password"
        className={clsx("form-control", {
          "is-invalid": errorCredentials,
        })}
        id="passwordInput"
        onChange={(e) => updateValue(e.target.value)}
        onKeyDown={(e) => props.onKeyDown(e.key)}
        placeholder=""
        required
      />
      <label htmlFor="passwordInput" className="form-label">
        Password
      </label>
      <div
        id="passwordInputFeedback"
        className={`invalid-feedback ${styles.error}`}
      >
        Invalid username or password
      </div>
      {errorMessage && (
        <div id="unknownErrorFeedback" className={styles.error}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

const LoginForm = (props: { onLogin: Function }) => {
  const context = useLoginFormContext();

  async function handleSubmit() {
    if (!context.username) {
      context.setErrorUsername("Username is required.");
      return;
    }

    const { login, error } = await loginUser(
      context.username,
      context.password,
    );
    if (login && !error) {
      props.onLogin();
    } else {
      context.setErrorMessage("");
      context.setErrorCredentials(false);
      if (error === "Unauthorized") {
        context.setErrorCredentials(true);
      } else if (error === "ServiceUnavailable") {
        context.setErrorMessage("Error connecting to server, try again later.");
      } else {
        context.setErrorMessage(
          "An unknown error has occured. Please contact a system administrator",
        );
      }
    }
  }

  function handlePasswordKeyDown(key: string) {
    if (key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.header}>Login</h3>
      <form>
        <FormUsername onKeyDown={handlePasswordKeyDown} />
        <FormPassword onKeyDown={handlePasswordKeyDown} />
        <FormButtonContainer>
          <FormSubmit label="Login" onClick={handleSubmit} />
        </FormButtonContainer>
      </form>
    </div>
  );
};

export default LoginForm;
