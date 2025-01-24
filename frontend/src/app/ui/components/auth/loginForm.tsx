"use client";
import styles from "@/components/auth/styles.module.css";
import { loginUser } from "@/app/util/api/loginuser";
import { useLoginFormContext } from "@/contexts/loginform";
import clsx from "clsx";

const FormUsername = () => {
  const { setUsername, errorCredentials, setErrorCredentials } =
    useLoginFormContext();
  function updateValue(value: string) {
    setUsername(value);
    setErrorCredentials(false);
  }
  return (
    <div className="mb-3">
      <label htmlFor="usernameInput" className="form-label">
        Username
      </label>
      <input
        type="text"
        className={clsx("form-control", {
          "is-invalid": errorCredentials,
        })}
        id="usernameInput"
        onChange={(e) => updateValue(e.target.value)}
        required
      />
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
    <div className="mb-3">
      <label htmlFor="passwordInput" className="form-label">
        Password
      </label>
      <input
        type="password"
        className={clsx("form-control", {
          "is-invalid": errorCredentials,
        })}
        id="passwordInput"
        onChange={(e) => updateValue(e.target.value)}
        onKeyDown={(e) => props.onKeyDown(e.key)}
        required
      />
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

const FormSubmit = (props: { onLoginClick: Function }) => {
  return (
    <button
      type="button"
      onClick={() => props.onLoginClick()}
      className={`btn btn-primary ${styles.button}`}
    >
      Login
    </button>
  );
};

const FormButtonContainer = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className={styles.buttonwrapper}>{children}</div>;
};

const LoginForm = (props: { onLogin: Function }) => {
  const context = useLoginFormContext();

  async function handleSubmit() {
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
      <form>
        <FormUsername />
        <FormPassword onKeyDown={handlePasswordKeyDown} />
        <FormButtonContainer>
          <FormSubmit onLoginClick={handleSubmit} />
        </FormButtonContainer>
      </form>
    </div>
  );
};

export default LoginForm;
