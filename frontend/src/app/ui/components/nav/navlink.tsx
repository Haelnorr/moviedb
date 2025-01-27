"use client";
import Link from "next/link";
import styles from "./styles.module.css";
import { usePathname } from "next/navigation";
import { NavLinkData } from "./navitems";
import clsx from "clsx";

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
export default NavLink;
