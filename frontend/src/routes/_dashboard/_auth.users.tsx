import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/_auth/users')({
	component: Users,

	loader: async () => {
		return {
			name: 'Adrian Gookool',
			age: 26,
		};
	},
});

function Users() {
	const pageData = Route.useLoaderData();
	return (
		<>
			<h1>Users Page</h1>
			{pageData.name}
			{pageData.age}
		</>
	);
}
