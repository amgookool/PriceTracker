import { authenticationRoute, appRoutes, usersRoute } from '@server/api/index';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { csrf } from 'hono/csrf';
import { logger } from 'hono/logger';
import { trimTrailingSlash } from 'hono/trailing-slash';

const app = new Hono();
app.use(csrf());
app.use('*', logger());
app.use(trimTrailingSlash());

const apiRoutes = app.basePath('/api').route('/', appRoutes).route('/users', usersRoute).route('/auth', authenticationRoute);

app.get('*', serveStatic({ root: './frontend/dist' }));
app.get('*', serveStatic({ path: './frontend/dist/index.html' }));

export default app;
export type ApiRoutes = typeof apiRoutes;
