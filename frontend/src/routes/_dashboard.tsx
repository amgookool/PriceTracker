import { createFileRoute, Outlet, useNavigate, redirect } from '@tanstack/react-router'
import NavBar from '@/components/Navigation/NavBar'
import { useAuth } from "@/lib/utils";



export const Route = createFileRoute('/_dashboard')({
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