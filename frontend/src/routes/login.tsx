import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthorizationApi } from '@/lib/api';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { toast } from 'sonner';
import { z } from 'zod';

const authApiService = new AuthorizationApi();

export const Route = createFileRoute('/login')({
	component: Login,
	beforeLoad: async () => {
		let accessTokenVerification = false;
		const authUser = localStorage.getItem('auth');
		try {
			const response = await authApiService.verifyAccessToken();
			if (response) {
				accessTokenVerification = true;
			} else throw new Error('Invalid access token');
		} catch (error) {
			const err = error as Error;
			console.error(err.message);
		}
		if (accessTokenVerification && authUser != null) {
			throw redirect({ to: '/' });
		}
	},

	loader: async () => {
		return null;
	},
});

function Login() {
	const navigate = useNavigate({ from: '/login' });
	const mutation = useMutation({
		mutationFn: authApiService.login,
		onSuccess: (res) => {
			toast.success('Logged in successfully');
			const authUser = {
				username: res.username,
				userId: res.userId,
				email: res.email,
				role: res.role,
			};
			localStorage.setItem('auth', JSON.stringify(authUser));
			navigate({
				to: '/',
				from: '/login',
				replace: true,
			});
		},
		onError: (error) => {
			console.error('An error occurred: ', error.message);
			toast.error(error.message || 'An error occurred');
		},
	});

	const form = useForm({
		defaultValues: {
			username: '',
			password: '',
		},
		onSubmit: async ({ value }) => {
			mutation.mutate(value);
		},
		validatorAdapter: zodValidator,
	});
	return (
		<>
			<div className="flex items-center justify-center min-h-screen">
				<Card className="w-full max-w-sm h-auto">
					<CardHeader>
						<CardTitle className="text-2xl">Login</CardTitle>
						<CardDescription>Enter your username and password to sign in</CardDescription>
					</CardHeader>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}>
						<CardContent className="grid gap-4">
							<div className="grid gap-2">
								<form.Field
									name="username"
									validators={{
										onChange: z.string().min(1, '*Username is required'),
										onChangeAsyncDebounceMs: 500,
										onChangeAsync: z.string().refine(
											async (value) => {
												await new Promise((resolve) => setTimeout(resolve, 1000));
												return !value.includes('error');
											},
											{
												message: "No 'error' allowed in username",
											},
										),
									}}
									children={(field) => {
										return (
											<>
												<Label htmlFor={field.name}>Username</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													type="text"
													placeholder="Enter username..."
												/>
												<span className={'flex text-xs text-red-600'}>
													{field.state.meta.errors ? <em role="alert">{field.state.meta.errors.join(', ')}</em> : null}
												</span>
											</>
										);
									}}
								/>
							</div>

							<div className="grid gap-2">
								<form.Field
									name="password"
									validators={{
										onChange: z.string().min(1, '*Password is required'),
										onChangeAsyncDebounceMs: 500,
										onChangeAsync: z.string().refine(
											async (value) => {
												await new Promise((resolve) => setTimeout(resolve, 1000));
												return !value.includes('error');
											},
											{
												message: "No 'error' allowed in password",
											},
										),
									}}
									children={(field) => {
										return (
											<>
												<Label htmlFor={field.name}>Password</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													type="password"
													placeholder="Enter password..."
												/>
												<span className={'flex text-xs text-red-600'}>
													{field.state.meta.errors ? <em role="alert">{field.state.meta.errors.join(', ')}</em> : null}
												</span>
											</>
										);
									}}
								/>
							</div>
						</CardContent>
						<CardFooter>
							<form.Subscribe
								selector={(state) => [state.canSubmit, state.isSubmitting]}
								children={([canSubmit, isSubmitting]) => (
									<Button type="submit" disabled={!canSubmit} className="w-full">
										{isSubmitting ? '...' : 'Sign In'}
									</Button>
								)}
							/>
						</CardFooter>
					</form>
				</Card>
			</div>
		</>
	);
}
