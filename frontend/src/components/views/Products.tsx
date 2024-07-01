import { ProductsApi } from '@/lib/api';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
// import ProductCard from "@/components/ProductCard";
import AddProduct from './AddProduct';

// const usersService = new UsersApi();
const productsService = new ProductsApi();

export default function Products() {
	let userId: number = 0;
	const authUser = localStorage.getItem('auth');
	const navigate = useNavigate({ from: '/products' });

	const getAllUsersProductsQueryOpts = queryOptions({
		queryKey: ['get-all-products'],
		queryFn: productsService.getAllUsersProductsApi,
		staleTime: 1000 * 60 * 5,
	});

	const { data, isPending, error, isError } = useQuery(getAllUsersProductsQueryOpts);

	if (authUser && !isError) {
		userId = parseInt(JSON.parse(authUser).userId);
	} else {
		console.error('An error occured fetching users products', error);
		localStorage.clear();
		navigate({ to: '/login', replace: true });
	}

	return (
		<>
			<div className="grid grid-cols-2">
				<h1 className="text-4xl font-medium text-start ">Tracked Products</h1>
				<AddProduct userId={userId} />
			</div>

			{isPending && <h1>Loading...</h1>}
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
