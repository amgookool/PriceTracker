import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "@tanstack/react-router";
import { GrMenu } from "react-icons/gr";
import type { NavBarLink } from "./NavBar";

const CollapsableNav = ({ navLinks }: { navLinks: NavBarLink[] }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <GrMenu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="grid gap-6 text-lg font-medium">
          {navLinks.map((item, idx) => {
            if (item.url == "/" && item.icon) {
              return (
                <Link
                  key={idx}
                  to={item.url}
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <item.icon className="h-6 w-6" />
                  {item.title}
                  <span className="sr-only">Price Tracker Dashboard</span>
                </Link>
              );
            } else {
              return (
                <Link
                  key={idx}
                  to={item.url}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {item.title}
                </Link>
              );
            }
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default CollapsableNav;
