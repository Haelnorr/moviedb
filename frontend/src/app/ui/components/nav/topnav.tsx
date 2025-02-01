"use client";
import Link from "next/link";
import styles from "@/components/nav/styles.module.css";
import { Suspense, useEffect } from "react";
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
      <nav id={styles.navbar} className="navbar navbar-expand-lg">
        <div className="container-md">
          <Link className={`navbar-brand ${styles.navbrand}`} href="/">
            MovieDB
          </Link>
          <NavCollapse />
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <NavList />
            <NavSearch />
            <Suspense>
              <UserTile />
            </Suspense>
          </div>
        </div>
      </nav>
    </>
  );
};
export default TopNav;
