import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { addProductApi, getAllUsersProductsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import { FaPlus } from 'react-icons/fa';
// import ProductCard from "@/components/ProductCard";
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { toast } from 'sonner';
import { z } from 'zod';

export const Route = createLazyFileRoute('/_dashboard/_auth/products')({
	component: Products,
});

const freq_types = ['seconds', 'days', 'hours', 'minutes'];
const freq_ints = Array.from({ length: 60 }, (_, i) => i + 1);

function Products() {
	const getAllUsersProductsQueryOpts = queryOptions({
		queryKey: ['get-all-products'],
		queryFn: getAllUsersProductsApi,
		staleTime: 1000 * 60 * 5,
	});

	const { data, isPending, error, isError } = useQuery(getAllUsersProductsQueryOpts);

	const user_id = JSON.parse(localStorage.getItem('auth') || '').userId;
	const mutation = useMutation({
		mutationFn: addProductApi,
		onSuccess: (res) => {
			console.log(res);
			toast.success('Logged in successfully');
		},
		onError: (error) => {
			console.error('An error occurred: ', error.message);
			toast.error(error.message || 'An error occurred');
		},
	});

	const form = useForm({
		defaultValues: {
			user_id: parseInt(user_id),
			name: '',
			website: '',
			product_url: '',
			desired_price: 0.99,
			is_favorite: false,
			description: '' || null,
			scrape_frequency_int: '',
			scrape_frequency_type: '',
		},
		onSubmit: async ({ value }) => {
			console.log(value);
			// mutation.mutate(value);
		},
		validatorAdapter: zodValidator,
	});

	if (error) {
		return <h1>Error: {error.message}</h1>;
	}

	return (
		<>
			<div className="grid grid-cols-2">
				<h1 className="text-4xl font-medium text-start ">Tracked Products</h1>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="default" size={'lg'} className={cn('gap-1')}>
							<span>
								<FaPlus />
							</span>
							Add Product
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add Product</DialogTitle>
							<DialogDescription>Fill in the details below to add a new product to track.</DialogDescription>
							<form
								className="space-y-2"
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									form.handleSubmit();
								}}>
								<form.Field
									name="user_id"
									children={(field) => {
										return (
											<>
												<input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onChange={(e) => field.handleChange(parseInt(e.target.value))}
													onBlur={field.handleBlur}
													type="number"
													hidden={true}
												/>
												{field.state.meta.errors && field.state.meta.errors.length > 0 ? (
													<span className="flex text-xs text-red-600">
														{field.state.meta.errors.map((error, index) => (
															<em key={index} role="alert">
																<span key={index}>{error}</span>
															</em>
														))}
													</span>
												) : null}
											</>
										);
									}}
								/>

								<div className="grid grid-cols-2 gap-2">
									<div className="w-full text-start">
										<form.Field
											name="name"
											validators={{
												onChange: z.string().min(1, '*Name is required').trim(),
											}}
											children={(field) => {
												return (
													<>
														<Label htmlFor={field.name}>Name</Label>
														<Input
															id={field.name}
															name={field.name}
															value={field.state.value}
															onBlur={field.handleBlur}
															onChange={(e) => field.handleChange(e.target.value)}
															type="text"
															placeholder="Enter name of product."
														/>
														{field.state.meta.errors && field.state.meta.errors.length > 0 ? (
															<span className="flex text-xs text-red-600">
																{field.state.meta.errors.map((error, index) => (
																	<em key={index} role="alert">
																		<span key={index}>{error}</span>
																	</em>
																))}
															</span>
														) : null}
													</>
												);
											}}
										/>
									</div>

									<div className="w-full text-start">
										<form.Field
											name="website"
											validators={{
												onChange: z.enum(['AMAZON', 'NEWEGG']),
											}}
											children={(field) => {
												return (
													<>
														<Label htmlFor={field.name}>Website</Label>
														<Select
															onValueChange={(value) => {
																field.handleChange(value);
															}}>
															<SelectTrigger id={field.name}>
																<SelectValue placeholder="Select Website" />
															</SelectTrigger>
															<SelectContent
																onChange={() => {
																	return;
																}}
																position="popper">
																<SelectItem value={'AMAZON' as const}>Amazon</SelectItem>
																<SelectItem value={'NEWEGG' as const}>NewEgg</SelectItem>
															</SelectContent>
														</Select>
														{field.state.meta.errors && field.state.meta.errors.length > 0 ? (
															<span className="flex text-xs text-red-600">
																{field.state.meta.errors.map((error, index) => (
																	<em key={index} role="alert">
																		<span key={index}>{error}</span>
																	</em>
																))}
															</span>
														) : null}
													</>
												);
											}}
										/>
									</div>
								</div>

								<div className="grid gap-2">
									<form.Field
										name="product_url"
										validators={{
											onChange: z
												.string()
												.min(1, '*Product URL is required')
												.url({ message: '*Product URL must be a valid URL' }),
										}}
										children={(field) => {
											return (
												<>
													<Label htmlFor={field.name}>Product URL</Label>
													<Input
														id={field.name}
														name={field.name}
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(e) => {
															field.handleChange(e.target.value);
														}}
														type="text"
														placeholder="Enter the name of the product to track"
													/>
													{field.state.meta.errors && field.state.meta.errors.length > 0 ? (
														<span className="flex flex-row text-xs text-red-600">
															{field.state.meta.errors.map((error, index) => (
																<em key={index} role="alert">
																	<span key={index}>{error}</span>
																</em>
															))}
														</span>
													) : null}
												</>
											);
										}}
									/>
								</div>

								<div className="grid grid-cols-2 gap-2">
									<div className="w-full text-start">
										<form.Field
											name="desired_price"
											validators={{
												onChange: z
													.number({
														required_error: '*Desired Price is required',
														invalid_type_error: '*Desired Price must be a number',
													})
													.multipleOf(0.01),
											}}
											children={(field) => {
												return (
													<>
														<Label htmlFor={field.name}>Desired Price</Label>
														<Input
															id={field.name}
															name={field.name}
															value={field.state.value}
															onBlur={field.handleBlur}
															onChange={(e) => {
																const stringEvent = e.target.value as string;
																if (stringEvent === '' || stringEvent === ' ') {
																	field.handleChange(0);
																} else {
																	const desired_price = parseFloat(e.target.value);

																	field.handleChange(desired_price);
																}
															}}
															type="number"
															step={0.1}
															placeholder="Enter the desired price of the product."
														/>
														{field.state.meta.errors && field.state.meta.errors.length > 0 ? (
															<span className="flex text-xs text-red-600">
																{field.state.meta.errors.map((error, index) => (
																	<em key={index} role="alert">
																		<span key={index}>{error}</span>
																	</em>
																))}
															</span>
														) : null}
													</>
												);
											}}
										/>
									</div>

									<div className="w-full text-start flex flex-col justify-center gap-2 items-center">
										<form.Field
											name="is_favorite"
											validators={{
												onChange: z.boolean(),
											}}
											children={(field) => {
												return (
													<>
														<Label htmlFor={field.name}>Show on Dashboard</Label>
														<Switch
															className=""
															id={field.name}
															name={field.name}
															onBlur={field.handleBlur}
															checked={field.state.value}
															onCheckedChange={field.handleChange}
														/>
														{field.state.meta.errors && field.state.meta.errors.length > 0 ? (
															<span className="flex text-xs text-red-600">
																{field.state.meta.errors.map((error, index) => (
																	<em key={index} role="alert">
																		<span key={index}>{error}</span>
																	</em>
																))}
															</span>
														) : null}
													</>
												);
											}}
										/>
									</div>
								</div>

								<div className="div grid-2"></div>

								<div className="grid gap-2">
									<form.Field
										name="description"
										children={(field) => {
											return (
												<>
													<Label className="pb-1" htmlFor={field.name}>
														Description
													</Label>
													<Textarea />
												</>
											);
										}}
									/>
								</div>

								<div className="flex items-center gap-2">
									<span>Scrape every</span>
									<form.Field
										name="scrape_frequency_int"
										validators={{ onChange: z.number() }}
										children={(field) => (
											<>
												<Select
													onValueChange={(value) => {
														field.handleChange(value);
													}}>
													<SelectTrigger className="w-36" id={field.name}>
														<SelectValue placeholder="Select Frequency" />
													</SelectTrigger>
													<SelectContent position="popper">
														{freq_ints.map((freq_int, idx) => (
															<SelectItem key={idx} value={freq_int.toString()}>
																{freq_int}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</>
										)}
									/>
									<form.Field
										name="scrape_frequency_type"
										validators={{ onChange: z.string() }}
										children={(field) => (
											<>
												<Select
													onValueChange={(value) => {
														field.handleChange(value);
													}}>
													<SelectTrigger className="w-36" id={field.name}>
														<SelectValue placeholder="Select Frequency" />
													</SelectTrigger>
													<SelectContent position="popper">
														{freq_types.map((freq_type, idx) => (
															<SelectItem key={idx} value={freq_type}>
																{freq_type}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</>
										)}
									/>
								</div>

								<div className="flex gap-2 place-content-end">
									<DialogClose asChild>
										<Button
											variant={'secondary'}
											type="button"
											onClick={() => {
												form.reset();
											}}>
											Cancel
										</Button>
									</DialogClose>
									<Button variant={'default'} type="submit">
										Add
									</Button>
								</div>
							</form>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</div>

			{isPending && <h1>Loading...</h1>}
			{isError && <h1>Error: {error}</h1>}
			{data && data.length === 0 && <h1>No products found</h1>}

			{data && data.length > 0 && (
				<div className="grid grid-cols-3 gap-4">
					<h2>Product</h2>

					{/* {data.map((product: any, idx: number) => (
            <div key={idx} className="bg-white shadow-lg rounded-lg p-4">
              <h1 className="text-lg font-semibold">{product.name}</h1>
              <p className="text-sm text-muted-foreground">{product.description}</p>
              <p className="text-sm text-muted-foreground">Price: {product.price}</p>
            </div>
          ))} */}
				</div>
			)}
		</>
	);
}
