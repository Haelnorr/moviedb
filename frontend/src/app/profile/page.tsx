"use client";
import styles from "@/components/profile/styles.module.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useAuthenticatedUser from "@/util/api/userSWR";
import { useEffect } from "react";
import loginRedirectPath from "@/util/api/loginredirect";
import ProfileHeader from "@/components/profile/profileHeader";
import ProfileByline from "@/components/profile/profileByline";
import ProfileFavourites from "@/components/profile/profileFavourites";
import ProfileActivity from "@/components/profile/profileActivity";

const ProfilePage = () => {
  // TODO: redo profile setup to use layout to support viewing other users
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
    <>
      {!loggedOut && !loading && (
        <div className="container">
          <div className="row">
            <ProfileHeader user={user!} />
          </div>
          <div className={`row ${styles["profile-byline"]}`}>
            <ProfileByline user={user!} />
          </div>
          <div className="row">
            <div className="col-md-4">
              <ProfileFavourites user={user!} />
            </div>
            <div className="col-md-8">
              <ProfileActivity user={user!} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ProfilePage;
