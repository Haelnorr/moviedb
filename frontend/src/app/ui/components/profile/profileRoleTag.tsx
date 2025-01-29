import styles from "./styles.module.css";
const ProfileRoleTag = (props: { role: string }) => {
  return (
    <>
      {props.role && (
        <span
          className={`${styles["profile-role-tag"]} ${styles[`profile-role-tag-${props.role}`]}`}
        >
          {props.role}
        </span>
      )}
    </>
  );
};
export default ProfileRoleTag;
