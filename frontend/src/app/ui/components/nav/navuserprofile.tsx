import { User } from "@/util/types";
import styles from "./styles.module.css";
import Link from "next/link";

const profileLinks = [
  { label: "Profile", href: "/profile" },
  { label: "Settings", href: "/account/overview" },
];

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
        {profileLinks.map((link, index) => (
          <li key={`profile-dropdown-${index}`}>
            <Link className="dropdown-item" href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
        <li key="profile-dropdown-logout">
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
