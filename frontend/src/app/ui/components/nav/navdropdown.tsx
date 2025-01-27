import { NavLinkData } from "./navitems";

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
export default NavDropdown;
