import useAuthenticatedUser from "@/app/util/api/userSWR";
import styles from "./styles.module.css";
import { usePathname } from "next/navigation";
import { logoutUser } from "@/app/util/api/logoutuser";
import UserProfile from "./navuserprofile";
import { LoginButton, RegisterButton } from "./navbuttons";
const UserTile = () => {
  const { user, loading, mutateAuth } = useAuthenticatedUser();
  const loggedIn = user && !loading;
  const pathname = usePathname();
  async function userLogout() {
    const { revokeAccessError, revokeRefreshError } = await logoutUser();
    if (revokeAccessError) {
      console.error(`Error logging out: ${revokeAccessError}`);
    }
    if (revokeRefreshError) {
      console.error(`Error revoking refresh token: ${revokeRefreshError}`);
    }
    if (!revokeAccessError && !revokeRefreshError) {
      mutateAuth();
    } else {
      // TODO: handle failed logout with user feedback. error popup maybe?
      console.error(
        "An error occured logging out. If the error persists contact a system administrator",
      );
    }
  }
  return (
    <div className={styles.usertile}>
      {(loggedIn && (
        <ul className="navbar-nav me-auto">
          <li>
            <UserProfile user={user} onLogout={userLogout} />
          </li>
        </ul>
      )) || (
        <ul className={`navbar-nav me-auto ${styles.authbuttons}`}>
          {pathname != "/auth/login" && (
            <li>
              <LoginButton />
            </li>
          )}
          {pathname != "/auth/register" && (
            <li>
              <RegisterButton />
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
export default UserTile;
