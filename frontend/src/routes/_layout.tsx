import { createFileRoute, Outlet } from '@tanstack/react-router'
import NavBar from '@/components/Navigation/NavBar'
export const Route = createFileRoute('/_layout')({
  component: LayoutComponent
})

function LayoutComponent() {
  return (
    <div>
      <NavBar/>
      <div>
        <Outlet />
      </div>
    </div>
  )
}