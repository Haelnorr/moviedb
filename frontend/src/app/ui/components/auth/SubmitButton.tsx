import styles from "@/components/auth/styles.module.css";
const FormSubmit = (props: { label: string; onClick: Function }) => {
  return (
    <button
      type="button"
      onClick={() => props.onClick()}
      className={`btn btn-primary ${styles.button}`}
    >
      {props.label}
    </button>
  );
};
export default FormSubmit;
