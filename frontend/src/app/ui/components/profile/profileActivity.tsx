import { User } from "@/app/util/types";
import styles from "./styles.module.css";
const ProfileActivity = (props: { user: User }) => {
  // TODO: query user activity from backend using user as input query

  const activity = props.user.activity;
  return (
    <>
      <span className={styles["activity-title"]}>Activity</span>
      <ul className={styles["activity-content"]}>
        {activity.map((movie, index) => {
          return <li key={`activity-${index}`}>{movie}</li>;
        })}
      </ul>
    </>
  );
};
export default ProfileActivity;
