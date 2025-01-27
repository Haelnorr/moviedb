import { formatTimestampDateOnly } from "@/app/util/formatting";
import styles from "./styles.module.css";
import { User } from "@/app/util/types";
import ProfileRoleTag from "./profileRoleTag";
const ProfileHeader = (props: { user: User }) => {
  return (
    <div className="col">
      <span className={styles["profile-name"]}>{props.user.username}</span>
      <ProfileRoleTag role={props.user.role} />
      <span className={styles["profile-joined"]}>
        Joined {formatTimestampDateOnly(props.user.joined)}
      </span>
    </div>
  );
};
export default ProfileHeader;
