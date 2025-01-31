import styles from "./styles.module.css";
const ProfileFavourites = () => {
  // TODO: get favourites from backend using user as input query
  const favourites = [
    "Arrival",
    "Colombus",
    "Howl's Moving Castle",
    "Incendies",
    "Manchester by the Sea",
    "Moneyball",
    "No Country for Old Men",
    "Tenet",
    "The Grand Budapest Hotel",
    "The Secret Life of Walter Mitty",
  ];
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
