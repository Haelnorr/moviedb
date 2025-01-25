import styles from "@/components/auth/styles.module.css";
const FormButtonContainer = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className={styles.buttonwrapper}>{children}</div>;
};
export default FormButtonContainer;
