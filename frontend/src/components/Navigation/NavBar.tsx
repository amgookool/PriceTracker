import { IconType } from "react-icons/lib";
import CollapsableNav from "./CollapsableNav";
import { RegularNavLinks, NavSearchAnduserManagement } from "./RegularNav";
import { BsFillHouseDoorFill } from "react-icons/bs";



export type NavBarLink = {
  title: string;
  url: string;
  icon: null | IconType;
};

const navLinks: NavBarLink[] = [
  {
    title: "Home",
    url: "/",
    icon: BsFillHouseDoorFill,
  },
  {
    title: "Products",
    url: "/products",
    icon: null,
  },
  {
    title: "Schedules",
    url: "/schedules",
    icon: null,
  },
  {
    title: "Users",
    url: "/users",
    icon: null,
  },
];


const NavBar = () => {
  return (
    <>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <RegularNavLinks navLinks={navLinks} />
        <CollapsableNav navLinks={navLinks} /> 
        <NavSearchAnduserManagement />
      </header>
    </>
  );
};

export default NavBar;
