import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router"
import { GrMenu } from "react-icons/gr";
import { BsFillHouseDoorFill } from "react-icons/bs";


const CollapsableNav = () => {
  return (
    <Sheet>
    <SheetTrigger asChild>
      <Button
        variant="outline"
        size="icon"
        className="shrink-0 md:hidden"
      >
        <GrMenu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <nav className="grid gap-6 text-lg font-medium">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <BsFillHouseDoorFill className="h-6 w-6" />
          Home
          <span className="sr-only">Price Tracker Dashboard</span>
        </Link>
        <Link
          to="/products"
          className="text-muted-foreground hover:text-foreground"
        >
          Products
        </Link>
        <Link
          to="/schedules"
          className="text-muted-foreground hover:text-foreground"
        >
          Schedules
        </Link>
        <Link
          to="/users"
          className="text-muted-foreground hover:text-foreground"
        >
          Users
        </Link>
        <Link to="/settings" className="hover:text-foreground">
          Settings
        </Link>
      </nav>
    </SheetContent>
  </Sheet>
  )
}

export default CollapsableNav
