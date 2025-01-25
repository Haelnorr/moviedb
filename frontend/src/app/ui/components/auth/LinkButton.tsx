import styles from "@/components/auth/styles.module.css";
import Link from "next/link";
const FormButton = (props: { label: string; href: string }) => {
  return (
    <Link
      //type="button"
      href={props.href}
      className={`btn btn-primary ${styles.button}`}
    >
      {props.label}
    </Link>
  );
};
export default FormButton;
