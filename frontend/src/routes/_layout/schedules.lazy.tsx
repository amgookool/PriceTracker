import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_layout/schedules')({
  component: () => <div>Hello /schedules!</div>
})