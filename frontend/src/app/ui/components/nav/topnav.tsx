"use client";
import Link from "next/link";
import styles from "@/components/nav/styles.module.css";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { useEffect } from "react";
import useAuthenticatedUser from "@/app/util/api/userSWR";
import type { User } from "@/util/types";
import { logoutUser } from "@/app/util/api/logoutuser";
import { loginRedirectPath } from "@/app/util/api/loginredirect";

type NavLinkData = {
  name: string;
  href: string;
  dropdown?: Array<{
    name: string;
    href: string;
  }>;
};

const links: NavLinkData[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Movies",
    href: "/movies",
  },
];

const NavLink = (props: { link: NavLinkData }) => {
  const pathname = usePathname();
  const active = pathname === props.link.href;
  return (
    <>
      <li className="nav-item">
        <Link
          className={clsx(`nav-link ${styles.navlink}`, {
            active: active,
          })}
          aria-current={active ? "page" : "false"}
          href={props.link.href}
        >
          {props.link.name}
        </Link>
      </li>
    </>
  );
};

const NavDropdown = (props: { link: NavLinkData }) => {
  return (
    <>
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Dropdown
        </a>
        <ul className="dropdown-menu">
          {props.link.dropdown!.map((link, index) => {
            return (
              <li key={`dropdown-item-${index}`}>
                <a className="dropdown-item" href={link.href}>
                  {link.name}
                </a>
              </li>
            );
          })}
        </ul>
      </li>
    </>
  );
};

const NavList = () => {
  return (
    <>
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        {links.map((link, index) => {
          const key = `nav-item-${index}`;
          if (link.dropdown) {
            return <NavDropdown link={link} key={key} />;
          } else {
            return <NavLink link={link} key={key} />;
          }
        })}
      </ul>
    </>
  );
};

const NavSearch = () => {
  return (
    <>
      <form className="d-flex" role="search">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>
    </>
  );
};

const LogoutButton = (props: { onLogout: Function }) => {
  return (
    <>
      <Link
        href="#"
        className={`btn btn-primary ${styles.userlogout}`}
        role="button"
        onClick={() => props.onLogout()}
      >
        Logout
      </Link>
    </>
  );
};

const LoginButton = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <>
      <Link
        href={loginRedirectPath("login", pathname, searchParams)}
        className={`btn btn-primary ${styles.userlogin}`}
        role="button"
      >
        Login
      </Link>
    </>
  );
};
const RegisterButton = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <>
      <Link
        href={loginRedirectPath("register", pathname, searchParams)}
        className={`btn btn-primary ${styles.userlogin}`}
        role="button"
      >
        Register
      </Link>
    </>
  );
};

const UserProfile = (props: { user: User }) => {
  return (
    <Link
      href="#"
      className={`btn btn-dark btn-outline-info ${styles.userprofile}`}
      role="button"
    >
      {props.user.username}
    </Link>
  );
};

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
            <UserProfile user={user} />
          </li>
          <li>
            <LogoutButton onLogout={userLogout} />
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

const NavItems = () => {
  return (
    <>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <NavList />
        <NavSearch />
        <UserTile />
      </div>
    </>
  );
};

const NavCollapse = () => {
  return (
    <>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
    </>
  );
};

const TopNav = () => {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return (
    <>
      <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
        <div className="container-md">
          <Link className={`navbar-brand ${styles.navbrand}`} href="/">
            MovieDB
          </Link>
          <NavCollapse />
          <NavItems />
        </div>
      </nav>
    </>
  );
};
export default TopNav;
