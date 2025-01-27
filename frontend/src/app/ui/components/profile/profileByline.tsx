import { User } from "@/app/util/types";
import styles from "./styles.module.css";
const ProfileByline = (props: { user: User }) => {
  return (
    <div className="col">
      <span className={styles["profile-bio"]}>{props.user.bio}</span>
    </div>
  );
};
export default ProfileByline;
