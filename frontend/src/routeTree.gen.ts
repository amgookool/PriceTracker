/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as DashboardImport } from './routes/_dashboard'
import { Route as DashboardAuthImport } from './routes/_dashboard/_auth'
import { Route as DashboardAuthUsersImport } from './routes/_dashboard/_auth.users'

// Create Virtual Routes

const DashboardAuthIndexLazyImport = createFileRoute('/_dashboard/_auth/')()
const DashboardAuthSettingsLazyImport = createFileRoute(
  '/_dashboard/_auth/settings',
)()
const DashboardAuthSchedulesLazyImport = createFileRoute(
  '/_dashboard/_auth/schedules',
)()
const DashboardAuthProductsLazyImport = createFileRoute(
  '/_dashboard/_auth/products',
)()

// Create/Update Routes

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const DashboardRoute = DashboardImport.update({
  id: '/_dashboard',
  getParentRoute: () => rootRoute,
} as any)

const DashboardAuthRoute = DashboardAuthImport.update({
  id: '/_auth',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardAuthIndexLazyRoute = DashboardAuthIndexLazyImport.update({
  path: '/',
  getParentRoute: () => DashboardAuthRoute,
} as any).lazy(() =>
  import('./routes/_dashboard/_auth.index.lazy').then((d) => d.Route),
)

const DashboardAuthSettingsLazyRoute = DashboardAuthSettingsLazyImport.update({
  path: '/settings',
  getParentRoute: () => DashboardAuthRoute,
} as any).lazy(() =>
  import('./routes/_dashboard/_auth.settings.lazy').then((d) => d.Route),
)

const DashboardAuthSchedulesLazyRoute = DashboardAuthSchedulesLazyImport.update(
  {
    path: '/schedules',
    getParentRoute: () => DashboardAuthRoute,
  } as any,
).lazy(() =>
  import('./routes/_dashboard/_auth.schedules.lazy').then((d) => d.Route),
)

const DashboardAuthProductsLazyRoute = DashboardAuthProductsLazyImport.update({
  path: '/products',
  getParentRoute: () => DashboardAuthRoute,
} as any).lazy(() =>
  import('./routes/_dashboard/_auth.products.lazy').then((d) => d.Route),
)

const DashboardAuthUsersRoute = DashboardAuthUsersImport.update({
  path: '/users',
  getParentRoute: () => DashboardAuthRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_dashboard': {
      id: '/_dashboard'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof DashboardImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/_dashboard/_auth': {
      id: '/_dashboard/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof DashboardAuthImport
      parentRoute: typeof DashboardImport
    }
    '/_dashboard/_auth/users': {
      id: '/_dashboard/_auth/users'
      path: '/users'
      fullPath: '/users'
      preLoaderRoute: typeof DashboardAuthUsersImport
      parentRoute: typeof DashboardAuthImport
    }
    '/_dashboard/_auth/products': {
      id: '/_dashboard/_auth/products'
      path: '/products'
      fullPath: '/products'
      preLoaderRoute: typeof DashboardAuthProductsLazyImport
      parentRoute: typeof DashboardAuthImport
    }
    '/_dashboard/_auth/schedules': {
      id: '/_dashboard/_auth/schedules'
      path: '/schedules'
      fullPath: '/schedules'
      preLoaderRoute: typeof DashboardAuthSchedulesLazyImport
      parentRoute: typeof DashboardAuthImport
    }
    '/_dashboard/_auth/settings': {
      id: '/_dashboard/_auth/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof DashboardAuthSettingsLazyImport
      parentRoute: typeof DashboardAuthImport
    }
    '/_dashboard/_auth/': {
      id: '/_dashboard/_auth/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof DashboardAuthIndexLazyImport
      parentRoute: typeof DashboardAuthImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  DashboardRoute: DashboardRoute.addChildren({
    DashboardAuthRoute: DashboardAuthRoute.addChildren({
      DashboardAuthUsersRoute,
      DashboardAuthProductsLazyRoute,
      DashboardAuthSchedulesLazyRoute,
      DashboardAuthSettingsLazyRoute,
      DashboardAuthIndexLazyRoute,
    }),
  }),
  LoginRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_dashboard",
        "/login"
      ]
    },
    "/_dashboard": {
      "filePath": "_dashboard.tsx",
      "children": [
        "/_dashboard/_auth"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/_dashboard/_auth": {
      "filePath": "_dashboard/_auth.tsx",
      "parent": "/_dashboard",
      "children": [
        "/_dashboard/_auth/users",
        "/_dashboard/_auth/products",
        "/_dashboard/_auth/schedules",
        "/_dashboard/_auth/settings",
        "/_dashboard/_auth/"
      ]
    },
    "/_dashboard/_auth/users": {
      "filePath": "_dashboard/_auth.users.tsx",
      "parent": "/_dashboard/_auth"
    },
    "/_dashboard/_auth/products": {
      "filePath": "_dashboard/_auth.products.lazy.tsx",
      "parent": "/_dashboard/_auth"
    },
    "/_dashboard/_auth/schedules": {
      "filePath": "_dashboard/_auth.schedules.lazy.tsx",
      "parent": "/_dashboard/_auth"
    },
    "/_dashboard/_auth/settings": {
      "filePath": "_dashboard/_auth.settings.lazy.tsx",
      "parent": "/_dashboard/_auth"
    },
    "/_dashboard/_auth/": {
      "filePath": "_dashboard/_auth.index.lazy.tsx",
      "parent": "/_dashboard/_auth"
    }
  }
}
ROUTE_MANIFEST_END */
