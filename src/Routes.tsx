import { Routes as RoutesProvider, Route } from 'react-router-dom';

/**
 * File-based routing.
 * @desc File-based routing that uses React Router under the hood.
 * To create a new route create a new .jsx file in `/pages` with a default export.
 *
 * Some examples:
 * * `/pages/index.jsx` matches `/`
 * * `/pages/blog/[id].jsx` matches `/blog/123`
 * * `/pages/[...catchAll].jsx` matches any URL not explicitly matched
 */
export default function Routes() {
  // Any .tsx or .jsx files in /pages will become a route
  const pages = import.meta.globEager('./pages/**/!(*.test.[jt]sx)*.([jt]sx)');

  const routes = useRoutes(pages);
  const pathPrefix = '';
  const routeComponents = routes.map(({ path, component: Component }) => {
    path = `${pathPrefix}${path}`;
    console.log(path);
    return <Route key={path} path={path} element={<Component />} />;
  });

  console.log(routeComponents);

  return (
    <RoutesProvider>
      {routeComponents}
      <Route path="*" element={<NoMatch />} />
    </RoutesProvider>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>404!</h2>
    </div>
  );
}

function useRoutes(pages: any) {
  const routes = Object.keys(pages)
    .map((key) => {
      let path = key
        .replace('./pages', '')
        .replace(/\.(t|j)sx?$/, '')
        /**
         * Replace /index with /
         */
        .replace(/\/index$/i, '/')
        /**
         * Only lowercase the first letter. This allows the developer to use camelCase
         * dynamic paths while ensuring their standard routes are normalized to lowercase.
         */
        .replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase())
        /**
         * Convert /[handle].jsx and /[...handle].jsx to /:handle.jsx for react-router-dom
         */
        .replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param) => `:${param}`);

      if (path.endsWith('/') && path !== '/') {
        path = path.substring(0, path.length - 1);
      }

      if (!pages[key].default) {
        console.warn(`${key} doesn't export a default React component`);
      }

      return {
        path,
        component: pages[key].default,
      };
    })
    .filter((route) => route.component);

  return routes;
}
