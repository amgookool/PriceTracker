import { createLazyFileRoute } from '@tanstack/react-router'



export const Route = createLazyFileRoute('/products')({
  component: () => Products
})



const Products = () => {
  return (
    <>
    <h1>Products Page</h1>
    </>
  )
}
