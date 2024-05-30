import { Link } from "@tanstack/react-router"
import { BsFillHouseDoorFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { FaUserCircle } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import ThemeToggler from "../ThemeToggler";

export const RegularNavLinks = () => {
  return (
    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
    <Link
      to="/"
      className="flex items-center gap-2 text-lg font-semibold md:text-base"
    >
      <BsFillHouseDoorFill className="h-6 w-6" />
      Home
      <span className="sr-only">Price Tracker Dashboard</span>
    </Link>
    <Link
      to="/products"
      className="text-muted-foreground transition-colors hover:text-foreground"
    >
      Products
    </Link>
    <Link
      to="/schedules"
      className="text-muted-foreground transition-colors hover:text-foreground"
    >
      Schedules
    </Link>
    <Link
      to="/users"
      className="text-muted-foreground transition-colors hover:text-foreground"
    >
      Users
    </Link>
    <Link
      to="/settings"
      className="text-foreground transition-colors hover:text-foreground"
    >
      Settings
    </Link>
  </nav>
  )
}


export const NavSearchAnduserManagement = () => {
  return (
    <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
    <form className="ml-auto flex-1 sm:flex-initial">
      <div className="relative">
        <FaSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
        />
      </div>
    </form>
    <ThemeToggler/>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <FaUserCircle className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
  );
};
