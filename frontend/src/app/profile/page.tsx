"use client";
import styles from "@/components/profile/styles.module.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useAuthenticatedUser from "@/util/api/userSWR";
import { useEffect } from "react";
import { loginRedirectPath } from "@/util/api/loginredirect";
import ProfileHeader from "@/components/profile/profileHeader";
import ProfileByline from "@/components/profile/profileByline";
import ProfileFavourites from "@/components/profile/profileFavourites";
import ProfileActivity from "@/components/profile/profileActivity";
const fakeUser = {
  id: 1,
  username: "Haelnorr",
  joined: new Date("2025-01-15T11:45:00"),
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

const ProfilePage = () => {
  // TODO: redo profile setup to use layout to support viewing other users
  // TODO: replace fakeUser with user data when backend is updated
  const router = useRouter();
  const { user, loading } = useAuthenticatedUser();
  const loggedOut = !user && !loading;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (loggedOut) {
      router.push(loginRedirectPath("login", pathname, searchParams));
    }
  }, [user, loggedOut, router]);
  return (
    <div className="container">
      <div className="row">
        <ProfileHeader user={fakeUser} />
      </div>
      <div className={`row ${styles["profile-byline"]}`}>
        <ProfileByline user={fakeUser} />
      </div>
      <div className="row">
        <div className="col-md-4">
          <ProfileFavourites user={fakeUser} />
        </div>
        <div className="col-md-8">
          <ProfileActivity user={fakeUser} />
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
