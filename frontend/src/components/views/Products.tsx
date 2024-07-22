import { ProductsApi } from '@/lib/api';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { ProductCardProps } from '../ProductCard';
// import ProductCard from '../ProductCard';
import ProductCard from '../ProductCard';
import AddProduct from './AddProduct';

// const usersService = new UsersApi();
const productsService = new ProductsApi();
const authUser = JSON.parse(localStorage.getItem('auth') ?? '{}');
const userId = authUser.userId;

export default function Products() {
	const getAllUsersProductsQueryOpts = queryOptions({
		queryKey: ['get-all-products'],
		queryFn: productsService.getUsersProductsApi,
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
		data?.forEach((d) => {
			console.log(d);
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
