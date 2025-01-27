import styles from "./styles.module.css";
const ProfileRoleTag = (props: { role: string }) => {
  return (
    <span
      className={`${styles["profile-role-tag"]} ${styles[`profile-role-tag-${props.role}`]}`}
    >
      {props.role}
    </span>
  );
};
export default ProfileRoleTag;
