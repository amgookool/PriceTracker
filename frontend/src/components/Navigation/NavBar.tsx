import CollapsableNav from "./CollapsableNav";
import { RegularNavLinks, NavSearchAnduserManagement } from "./RegularNav";

const NavBar = () => {
  return (
    <>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <RegularNavLinks />
        <CollapsableNav />
        <NavSearchAnduserManagement />
      </header>
    </>
  );
};

export default NavBar;
