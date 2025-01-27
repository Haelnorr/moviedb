import NavDropdown from "./navdropdown";
import NavLink from "./navlink";

export type NavLinkData = {
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
export default NavList;
