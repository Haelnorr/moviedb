"use client";
import Link from "next/link";
import styles from "@/app/ui/components/nav/styles.module.css";
import { usePathname } from "next/navigation";
import clsx from 'clsx';
import { useEffect } from "react";

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
        href: "/"
    },
    {
        name: "Login",
        href: "/auth/login"
    },
    {
        name: "Register",
        href: "/auth/register"
    },
];

const NavLink = (props:{link:NavLinkData}) => {
    const pathname = usePathname();
    const active = pathname === props.link.href;
    return (
        <>
           <li className="nav-item">
                <Link 
                    className={clsx(
                        `nav-link ${styles.navlink}`,
                        {
                            "active": active,
                        }
                    )}
                    aria-current={active ? "page" : "false"}
                    href={props.link.href}
                >
                    {props.link.name}
                </Link>
            </li>
        </>
    );
}

const NavDropdown = (props:{link:NavLinkData}) => {
    return (
        <>
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Dropdown
                </a>
                <ul className="dropdown-menu">
                    {
                        props.link.dropdown!.map((link, index) => {
                            return <li key={`dropdown-item-${index}`}><a className="dropdown-item" href={link.href}>{link.name}</a></li>
                        })
                    }
                </ul>
            </li>
        </>
    );
}

const NavList = () => {
    return (
        <>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {
                    links.map((link, index) => {
                        const key = `nav-item-${index}`;
                        if (link.dropdown) {
                            return <NavDropdown link={link} key={key}/>
                        } else {
                            return <NavLink link={link} key={key}/>
                        }
                    })
                }
            </ul>
        </>
    );
}

const NavSearch = () => {
    return (
        <>
            <form className="d-flex" role="search">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                <button className="btn btn-outline-success" type="submit">Search</button>
            </form>
        </>
    );
}

const NavItems = () => {
    return (
        <>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <NavList />
                <NavSearch />
            </div>
        </>
    );
}

const NavCollapse = () => {
    return (
        <>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
        </>
    );
}

const TopNav = () => {
    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);
    return (
        <>
            <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
                <div className="container-md">
                    <Link className={`navbar-brand ${styles.navbrand}`} href="/">MovieDB</Link>
                    <NavCollapse />
                    <NavItems />
                </div>
            </nav>
        </>
    );
}
export default TopNav;
