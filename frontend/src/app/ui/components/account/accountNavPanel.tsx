"use client";
import Link from "next/link";
import styles from "./styles.module.css";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";

const links = [
  { name: "General", href: "/account/general" },
  { name: "Security", href: "/account/security" },
  { name: "Preferences", href: "/account/preferences" },
];

const AccountNavPanel = () => {
  const pathname = usePathname();
  const [dropdown, setDropdown] = useState(false);
  function handleClick(parentElement: HTMLElement | null) {
    if (parentElement?.className.includes("active")) {
      setDropdown(!dropdown);
    } else {
      setDropdown(false);
    }
  }
  return (
    <div className={`${styles["account-nav-panel"]}`}>
      <ul className="nav me-auto flex-column">
        {links.map((link, index) => {
          return (
            <li
              className={clsx(`nav-item ${styles["account-nav-panel-item"]}`, {
                [styles.active]: pathname === link.href,
                [styles.showdropdown]: dropdown || pathname === link.href,
              })}
              key={`account-nav-item-${index}`}
            >
              <Link
                className={`nav-link ${styles["account-nav-panel-link"]}`}
                href={link.href}
                onClick={(e) => handleClick(e.currentTarget.parentElement)}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default AccountNavPanel;
