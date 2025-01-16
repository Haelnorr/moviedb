"use client"
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styles from "@/app/ui/nav/styles.module.css";
import { usePathname } from "next/navigation";
import clsx from 'clsx';

type NavLink = {
    name: string;
    href: string;
};

const links: NavLink[] = [
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

const TopNav = () => {
    const pathname = usePathname();
    return (
        <Navbar expand="lg" className={styles.navbar} >
            <Container>
                <Navbar.Brand as={Link} href="/" className={styles.navbrand}>MovieDB</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {links.map((link, index) => {
                            return (
                                <Nav.Link
                                    key={index}
                                    as={Link}
                                    href={link.href}
                                    className={clsx(
                                        styles.navlink,
                                        {
                                            [styles.active]: pathname === link.href
                                        },
                                    )}
                                >
                                    {link.name}
                                </Nav.Link>
                            );
                        })}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default TopNav;
