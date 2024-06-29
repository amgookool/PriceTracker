import { createLazyFileRoute } from '@tanstack/react-router';
// import ProductCard from "@/components/ProductCard";
import Products from '@/components/views/Products';

export const Route = createLazyFileRoute('/_dashboard/_auth/products')({
	component: Products,
});
