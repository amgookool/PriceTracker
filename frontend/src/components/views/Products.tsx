import { ProductsApi } from '@/lib/api';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { ProductCardProps } from '../ProductCard';
// import ProductCard from '../ProductCard';
import ProductCard from '../ProductCard';
import AddProduct from './AddProduct';

// const usersService = new UsersApi();
const productsService = new ProductsApi();

export default function Products() {
	const userId: number = 0;

	const getAllUsersProductsQueryOpts = queryOptions({
		queryKey: ['get-all-products'],
		queryFn: productsService.getAllUsersProductsApi,
		staleTime: 1000 * 60 * 5,
	});

	const { data, isPending, error, isError } = useQuery(getAllUsersProductsQueryOpts);

	if (isError) {
		console.error(error);
	} else if (isPending) {
		return <h1>Loading...</h1>;
	} else if (data && data.length === 0) {
		return (
			<>
				<ProductPageHeading userId={userId} />
				<h1>No Products</h1>
			</>
		);
	} else {
		const products: ProductCardProps[] = [];
		data?.forEach((product) => {
			const p = {
				name: product.name,
				product_id: product.product_id,
				description: product.description,
				website: product.website,
				image_url: product.image_url,
				desired_price: product.desired_price,
				site_product_name: product.site_product_name,
				product_url: product.product_url,
				is_favorite: product.is_favorite,
				last_price: product.price_histories[product.price_histories.length - 1].price,
				last_scraped_at: product.price_histories[product.price_histories.length - 1].created_at,
			} as ProductCardProps;
			products.push(p);
		});
		return (
			<>
				<ProductPageHeading userId={userId} />
				<div className="grid grid-cols-2 gap-4">
					{products.map((product) => (
						<ProductCard key={product.product_id} {...product} />
					))}
				</div>
			</>
		);
	}
}

function ProductPageHeading({ userId }: { userId: number }) {
	return (
		<div className="grid grid-cols-2">
			<h1 className="text-4xl font-medium text-start ">Tracked Products</h1>
			<AddProduct userId={userId} />
		</div>
	);
}
