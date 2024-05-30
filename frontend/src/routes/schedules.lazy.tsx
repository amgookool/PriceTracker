import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/schedules')({
  component: () => <div>Hello /schedules!</div>
})