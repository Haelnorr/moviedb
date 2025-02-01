import styles from "./styles.module.css";
const ProfileRoleTag = (props: { roles: string[] }) => {
  var shownRole: string = "";
  props.roles.map((role) => {
    // TODO: do some fancy schmancy role selection here
    // for now only admin tag needs to be shown though
    if (role === "admin") shownRole = role;
  });
  return (
    <>
      {shownRole && (
        <span
          className={`${styles["profile-role-tag"]} ${styles[`profile-role-tag-${shownRole}`]}`}
        >
          {shownRole}
        </span>
      )}
    </>
  );
};
export default ProfileRoleTag;
