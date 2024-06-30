import type { NavBarLink } from '@/components/Navigation/NavBar';
import ThemeToggler from '@/components/ThemeToggler';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { AuthorizationApi } from '@/lib/api';
import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import { FaSearch, FaUserCircle } from 'react-icons/fa';

const authServiceApi = new AuthorizationApi();

export const RegularNavLinks = ({ navLinks }: { navLinks: NavBarLink[] }) => {
	return (
		<nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
			{navLinks.map((item, idx) => {
				if (item.url == '/' && item.icon) {
					return (
						<Link key={idx} to={item.url} className="flex items-center gap-2 text-lg font-semibold md:text-base">
							<item.icon className="h-6 w-6" />
							{item.title}
							<span className="sr-only">Price Tracker Dashboard</span>
						</Link>
					);
				} else {
					return (
						<Link key={idx} to={item.url} className="text-muted-foreground transition-colors hover:text-foreground">
							{item.title}
						</Link>
					);
				}
			})}
		</nav>
	);
};

const UserActionMenu = () => {
	const router = useRouter();
	const navigate = useNavigate({ from: '/' });
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="secondary" size="icon" className="rounded-full">
					<FaUserCircle className="h-5 w-5" />
					<span className="sr-only">Toggle user menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel className="text-center font-bold">My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<button
						className="w-full text-center"
						onClick={() => {
							navigate({
								to: '/settings',
								from: router.basepath,
							});
						}}>
						Settings
					</button>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<button
						className="w-full text-center"
						onClick={() => {
							authServiceApi.logout();
							localStorage.clear();
							navigate({
								to: '/login',
								from: router.basepath,
							});
						}}>
						Logout
					</button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const NavSearchAnduserManagement = () => {
	return (
		<div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
			<form className="ml-auto flex-1 sm:flex-initial">
				<div className="relative">
					<FaSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input type="search" placeholder="Search products..." className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]" />
				</div>
			</form>
			<ThemeToggler />
			<UserActionMenu />
		</div>
	);
};
