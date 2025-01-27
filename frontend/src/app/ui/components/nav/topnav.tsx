"use client";
import Link from "next/link";
import styles from "@/components/nav/styles.module.css";
import { useEffect } from "react";
import NavList from "./navlist";
import NavSearch from "./search";
import UserTile from "./usertile";
import NavCollapse from "./navcollapse";

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
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <NavList />
            <NavSearch />
            <UserTile />
          </div>
        </div>
      </nav>
    </>
  );
};
export default TopNav;
