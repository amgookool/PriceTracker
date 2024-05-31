import { createLazyFileRoute } from '@tanstack/react-router'



export const Route = createLazyFileRoute('/_layout/products')({
  component: Products
})



function Products(){
  return (
    <>
    <h1>Products Page</h1>
    </>
  )
}
