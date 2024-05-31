import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_dashboard/_auth/schedules')({
  component: () => <div>Hello /schedules!</div>
})