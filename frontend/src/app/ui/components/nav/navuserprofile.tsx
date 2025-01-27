import { User } from "@/util/types";
import styles from "./styles.module.css";
import Link from "next/link";

const UserProfile = (props: { user: User; onLogout: Function }) => {
  return (
    <div className={`dropdown`}>
      <a
        className={`dropdown-toggle btn btn-dark btn-outline-info ${styles.profiledropdown}`}
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {props.user.username}
      </a>
      <ul className="dropdown-menu">
        <li>
          <Link className="dropdown-item" href="/profile">
            Profile
          </Link>
        </li>
        <li>
          <Link
            className="dropdown-item"
            href="#"
            onClick={() => props.onLogout()}
          >
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default UserProfile;
