import { User } from "@/app/util/types";
import styles from "./styles.module.css";
const ProfileActivity = (props: { user: User }) => {
  // TODO: query user activity from backend using user as input query

  const activity = [
    "The Negotiator",
    "Die Hard",
    "Just Mercy",
    "Anora",
    "Snack Shack",
    "Point Break",
    "The Judge",
    "Beginners",
    "She Said",
    "Up in the Air",
  ];
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
