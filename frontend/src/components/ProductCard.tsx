import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

export interface ProductCardProps {
	name: string;
	product_id: number;
	description: string;
	website: string;
	image_url: string;
	desired_price: number;
	site_product_name: string;
	product_url: string;
	is_favorite: boolean;
	last_price: number;
	last_scraped_at: string;
}

const ProductCard = (props: ProductCardProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{props.name}</CardTitle>
				<CardDescription>{props.description}</CardDescription>
			</CardHeader>
			<CardContent>
				{/* Image */}
				<div className="w-full h-full flex justify-center items-center ">
					<img className="w-auto h-auto" src={props.image_url} alt="product image" />
				</div>
				<div className="container-w-full pt-2">
					<span className="flex items-center">
						<h4 className="mr-2 text-nowrap">Official Name:</h4>
						<div className="overflow-hidden whitespace-nowrap w-full">
							<div className="inline-block animate-marquee">{props.site_product_name}</div>
						</div>
					</span>
				</div>
				<div className="grid grid-cols-2">
					{/* Site name, site product name, link to product */}
					<div className="flex flex-col">
						<span className="flex items-center">
							<h4 className="mr-2 text-nowrap">Website:</h4>
							<p className="w-full">{props.website}</p>
						</span>
						<span className="flex items-center">
							<h4 className="mr-2 text-nowrap">Desired Price:</h4>
							<p className="w-full">${props.desired_price}</p>
						</span>
					</div>
					<div className="flex flex-col">
						<a target="_blank" rel="noopener noreferrer" href={props.product_url}>
							Go to product
						</a>
						<span className="flex items-center">
							<h4 className="mr-2 text-nowrap">Current Price:</h4>
							<p className="w-full">${props.last_price}</p>
						</span>
						<span className="flex items-center">
							<h4 className="mr-2 text-nowrap">Last Checked:</h4>
							<p className="w-full">{props.last_scraped_at}</p>
						</span>
					</div>

					{/* Price, last scraped at, favorite button */}
					{/* <div className="flex flex-col">
						<p>{props.desired_price}</p>
						<p>{props.last_price}</p>
						<p>{props.is_favorite ? 'true' : 'false'}</p>
					</div> */}
				</div>
			</CardContent>
			<CardFooter className="">
				{/* <p>{props.product_url}</p> */}
				{/* <p>{props.last_scraped_at}</p> */}
			</CardFooter>
		</Card>
	);
};

export default ProductCard;
