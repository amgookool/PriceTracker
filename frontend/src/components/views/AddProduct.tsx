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
import { ProductsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useNavigate } from '@tanstack/react-router';
import { FaPlus } from 'react-icons/fa';
// import ProductCard from "@/components/ProductCard";
import type { addNewProductType } from '@/lib/forms';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { toast } from 'sonner';
import { z } from 'zod';

interface AddProductFormProps {
	userId: number;
}
const productsService = new ProductsApi();

const freq_types = ['seconds', 'days', 'hours', 'minutes'] as const;
const freq_ints = Array.from({ length: 60 }, (_, i) => i + 1);

export default function AddProduct({ userId }: AddProductFormProps) {
	const navigate = useNavigate({ from: '/products' });
	const authUser = localStorage.getItem('auth');
	const mutation = useMutation({
		mutationFn: productsService.addProductApi,
		onSuccess: (res) => {
			console.log(res);
			toast.success(`Successfully added product:`);
		},
		onError: (error) => {
			console.error('An error occurred: ', error.message);
			toast.error(error.message || 'An error occurred');
		},
	});
	const form = useForm({
		defaultValues: {
			user_id: userId,
			name: '',
			website: '',
			product_url: '',
			desired_price: 0.99,
			description: null || '',
			scrape_frequency_int: parseInt('1'),
			scrape_frequency_type: '',
			is_favorite: false,
		},
		onSubmit: async ({ value }) => {
			const postData = {
				user_id: value.user_id,
				name: value.name,
				website: value.website,
				product_url: value.product_url,
				desired_price: value.desired_price,
				description: value.description ?? null,
				is_favorite: value.is_favorite,
				scrape_interval: `${value.scrape_frequency_int} ${value.scrape_frequency_type}`,
			} as addNewProductType;
			mutation.mutate(postData);
		},
		validatorAdapter: zodValidator,
	});
	if (authUser) {
		const userId = JSON.parse(authUser).userId;
		return (
			<>
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
								{/* User Id Form Field */}
								<form.Field
									name="user_id"
									children={(field) => {
										return (
											<>
												<input
													id={field.name}
													name={field.name}
													value={userId}
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
								{/* Product Name and Product Website Form Fields */}
								<div className="grid grid-cols-2 gap-2">
									{/* Product Name Form Field */}
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

									{/* Product Website Form Field */}
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

								{/* product URL Form Field */}
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

								{/* Desired Price Form Field */}
								<div className="grid gap-2">
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
								</div>

								{/* Desciption Form Field */}
								<div className="grid gap-2">
									<div>
										<form.Field
											name="description"
											validators={{
												onChange: z.nullable(z.string()),
											}}
											children={(field) => {
												return (
													<>
														<Label className="pb-1" htmlFor={field.name}>
															Description
														</Label>
														<Textarea
															id={field.name}
															name={field.name}
															value={field.state.value ? field.state.value : ''}
															onBlur={field.handleBlur}
															onChange={(e) => field.handleChange(e.target.value)}
														/>
													</>
												);
											}}
										/>
									</div>
								</div>

								{/* Product Scrape Frequency Integer & Product Scrape Type */}
								<div className="flex items-center gap-2">
									<span>Scrape every</span>
									<form.Field
										name="scrape_frequency_int"
										validators={{
											onChange: z.number().gte(1),
										}}
										children={(field) => {
											return (
												<>
													<Select
														onValueChange={(value) => {
															field.handleChange(parseInt(value));
														}}>
														<SelectTrigger className={cn('w-[170px]')} id={field.name}>
															<SelectValue placeholder="Frequency" />
														</SelectTrigger>
														<SelectContent
															onChange={() => {
																return;
															}}
															position="popper">
															{freq_ints.map((freq_int, idx) => (
																<SelectItem key={idx} value={freq_int.toString()}>
																	{freq_int}
																</SelectItem>
															))}
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
									<form.Field
										name="scrape_frequency_type"
										validators={{
											onChange: z.enum(freq_types),
										}}
										children={(field) => {
											return (
												<>
													<Select
														onValueChange={(value) => {
															field.handleChange(value);
														}}>
														<SelectTrigger className={cn('w-[170px]')} id={field.name}>
															<SelectValue placeholder="Period" />
														</SelectTrigger>
														<SelectContent
															onChange={() => {
																return;
															}}
															position="popper">
															{freq_types.map((freq_type, idx) => (
																<SelectItem key={idx} value={freq_type}>
																	{freq_type}
																</SelectItem>
															))}
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

								{/* Show on Dashboard Page Form Field */}
								<div className="grid gap-2 py-2">
									<form.Field
										name="is_favorite"
										validators={{
											onChange: z.boolean(),
										}}
										children={(field) => {
											return (
												<>
													<div className="flex space-x-2">
														<Label htmlFor={field.name}>Show on Dashboard</Label>
														<Switch
															className=""
															id={field.name}
															name={field.name}
															onBlur={field.handleBlur}
															checked={field.state.value}
															onCheckedChange={field.handleChange}
														/>
													</div>
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

								{/* Form Buttons */}
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
									<form.Subscribe
										selector={(state) => [state.canSubmit, state.isSubmitting]}
										children={([canSubmit, isSubmitting]) => (
											<Button type="submit" variant={'default'} disabled={!canSubmit}>
												{isSubmitting ? '...' : 'Add'}
											</Button>
										)}
									/>
								</div>
							</form>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</>
		);
	} else {
		localStorage.clear();
		navigate({ to: '/login', replace: true });
	}
}
