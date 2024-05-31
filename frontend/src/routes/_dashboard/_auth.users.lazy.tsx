import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_dashboard/_auth/users')({
  component: Users
})



function Users(){
  return (
    <>
    <h1>Users Page</h1>
    </>
  )
}
