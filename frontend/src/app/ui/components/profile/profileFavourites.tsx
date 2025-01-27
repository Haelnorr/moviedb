import { User } from "@/app/util/types";
import styles from "./styles.module.css";
const ProfileFavourites = (props: { user: User }) => {
  // TODO: get favourites from backend using user as input query
  const favourites = props.user.favourites;
  return (
    <>
      <span className={styles["favourites-title"]}>Favourites</span>
      <ul className={styles["favourites-content"]}>
        {favourites.map((movie, index) => {
          return <li key={`favourites-${index}`}>{movie}</li>;
        })}
      </ul>
    </>
  );
};
export default ProfileFavourites;
