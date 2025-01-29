import styles from "@/components/auth/styles.module.css";
import FormButtonContainer from "./FormButtonContainer";
import { useRegisterFormContext } from "@/contexts/registerform";
import { loginUser } from "@/app/util/api/loginuser";
import clsx from "clsx";
import FormSubmit from "./SubmitButton";
import { checkUsernameExists } from "@/app/util/api/checkusernameexists";
import { registerUser } from "@/app/util/api/registeruser";
import FormButton from "./LinkButton";

const FormUsername = () => {
  const { username, setUsername, errorUsername, setErrorUsername } =
    useRegisterFormContext();
  function updateValue(value: string) {
    setUsername(value);
    setErrorUsername("");
  }
  function validateInput(target: HTMLInputElement) {
    const validFormat = new RegExp("^[A-Za-z0-9_-]*$");
    const valid = validFormat.test(target.value);
    const invalidMsg =
      "Invalid character. Username only accepts letters, numbers, hyphens and underscores";
    if (!valid) {
      setErrorUsername(invalidMsg);
      target.value = username;
    } else {
      updateValue(target.value);
    }
  }
  async function checkUsername() {
    setErrorUsername("");
    const { exists, error } = await checkUsernameExists(username);
    if (error) {
      setErrorUsername("An error occured checking your username.");
    } else if (exists) {
      setErrorUsername("Username is taken.");
    }
  }
  return (
    <>
      <div className="form-floating mb-3">
        <input
          type="text"
          className={clsx("form-control", {
            "is-invalid": errorUsername,
          })}
          id="usernameInput"
          onChange={(e) => validateInput(e.target)}
          onBlur={checkUsername}
          placeholder=""
          maxLength={64}
          required
        />
        <label htmlFor="usernameInput">Username</label>
        <div
          id="usernameInputFeedback"
          className={`invalid-feedback ${styles.error}`}
        >
          {errorUsername}
        </div>
      </div>
    </>
  );
};

const FormPassword = () => {
  const { setPassword, errorPasswords, setErrorPasswords } =
    useRegisterFormContext();
  function updateValue(value: string) {
    setPassword(value);
    setErrorPasswords("");
  }
  return (
    <div className="form-floating mb-3">
      <input
        type="password"
        className={clsx("form-control", {
          "is-invalid": errorPasswords,
        })}
        id="passwordInput"
        onChange={(e) => updateValue(e.target.value)}
        placeholder=""
        required
      />
      <label htmlFor="passwordInput" className="form-label">
        Password
      </label>
    </div>
  );
};

const FormConfirmPassword = (props: { onKeyDown: Function }) => {
  const {
    setConfirmPassword,
    errorPasswords,
    errorMessage,
    setErrorPasswords,
  } = useRegisterFormContext();
  function updateValue(value: string) {
    setConfirmPassword(value);
    setErrorPasswords("");
  }
  return (
    <div className="form-floating mb-3">
      <input
        type="password"
        className={clsx("form-control", {
          "is-invalid": errorPasswords,
        })}
        id="confirm-passwordInput"
        onChange={(e) => updateValue(e.target.value)}
        onKeyDown={(e) => props.onKeyDown(e.key)}
        placeholder=""
        required
      />
      <label htmlFor="confirm-passwordInput" className="form-label">
        Confirm Password
      </label>
      <div
        id="confirm-passwordInputFeedback"
        className={`invalid-feedback ${styles.error}`}
      >
        {errorPasswords}
      </div>
      {errorMessage && (
        <div id="unknownErrorFeedback" className={styles.error}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

const RegisterForm = (props: { onLogin: Function }) => {
  const context = useRegisterFormContext();

  async function handleSubmit() {
    if (context.password != context.confirmPassword) {
      context.setErrorPasswords("Passwords do not match.");
      return;
    }

    if (context.errorUsername) {
      return;
    }
    var missing = false;
    if (!context.username) {
      context.setErrorUsername("Required");
      missing = true;
    }
    if (!context.password) {
      context.setErrorPasswords("Required");
      missing = true;
    }
    if (missing) {
      return;
    }
    const { registered, error } = await registerUser(
      context.username,
      context.password,
      context.confirmPassword,
    );
    if (registered && !error) {
      const { login, error } = await loginUser(
        context.username,
        context.password,
      );
      if (login && !error) {
        props.onLogin();
      } else {
        // error occured logging in user
        context.setErrorMessage("");
        if (error === "ServiceUnavailable") {
          context.setErrorMessage(
            "Error connecting to server, try again later.",
          );
        } else {
          context.setErrorMessage(
            "An unknown error has occured. Please contact a system administrator",
          );
        }
        console.warn(`Error logging in: ${error}`);
      }
    } else {
      // error occured registering the user
      context.setErrorMessage("");
      if (error === "ServiceUnavailable") {
        context.setErrorMessage("Error connecting to server, try again later.");
      } else {
        context.setErrorMessage(
          "An unknown error has occured. Please contact a system administrator",
        );
      }
      console.warn(`Error logging in: ${error}`);
    }
  }
  function handlePasswordKeyDown(key: string) {
    if (key === "Enter") {
      handleSubmit();
    }
  }
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.header}>Register</h3>
      <form>
        <FormUsername />
        <FormPassword />
        <FormConfirmPassword onKeyDown={handlePasswordKeyDown} />
        <FormButtonContainer>
          <FormSubmit label="Register" onClick={handleSubmit} />
          <FormButton label="Login" href="/auth/login" />
        </FormButtonContainer>
      </form>
    </div>
  );
};

export default RegisterForm;
