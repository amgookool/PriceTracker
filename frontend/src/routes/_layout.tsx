import { createFileRoute, Outlet } from '@tanstack/react-router'
import NavBar from '@/components/Navigation/NavBar'
export const Route = createFileRoute('/_layout')({
  component: LayoutComponent
})

function LayoutComponent() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <NavBar />
      <Outlet />
    </div>
  )
}