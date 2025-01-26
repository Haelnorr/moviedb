import styles from "@/components/profile/styles.module.css";
const user = {
  id: 1,
  username: "Haelnorr",
  joined: "2025-01-15T11:45:00",
  role: "admin",
  bio: "Only thing I love more than movies, is talking about movies",
  favourites: [
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
  ],
  activity: [
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
  ],
};

// TODO: generalize function and move to separate file
const joined = new Date(user.joined);
const joinedFormatted = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
}).format(joined);

// TODO: move to separate file
const ProfileHeader = () => {
  return (
    <div className="col">
      <span className={styles["profile-name"]}>{user.username}</span>
      <span
        className={`${styles["profile-role-tag"]} ${styles[`profile-role-tag-${user.role}`]}`}
      >
        {user.role}
      </span>
      <span className={styles["profile-joined"]}>Joined {joinedFormatted}</span>
    </div>
  );
};

// TODO: move to separate file
const ProfileByline = () => {
  return (
    <div className="col">
      <span className={styles["profile-bio"]}>{user.bio}</span>
    </div>
  );
};

// TODO: move to separate file
const ProfileFavourites = () => {
  return (
    <>
      <span className={styles["favourites-title"]}>Favourites</span>
      <ul className={styles["favourites-content"]}>
        {user.favourites.map((movie, index) => {
          return <li key={`favourites-${index}`}>{movie}</li>;
        })}
      </ul>
    </>
  );
};

// TODO: move to separate file
const ProfileActivity = () => {
  return (
    <>
      <span className={styles["activity-title"]}>Activity</span>
      <ul className={styles["activity-content"]}>
        {user.activity.map((movie, index) => {
          return <li key={`activity-${index}`}>{movie}</li>;
        })}
      </ul>
    </>
  );
};

const ProfilePage = () => {
  // TODO: fetch user data from backend
  return (
    <div className="container">
      <div className="row">
        <ProfileHeader />
      </div>
      <div className={`row ${styles["profile-byline"]}`}>
        <ProfileByline />
      </div>
      <div className="row">
        <div className="col-md-4">
          <ProfileFavourites />
        </div>
        <div className="col-md-8">
          <ProfileActivity />
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
