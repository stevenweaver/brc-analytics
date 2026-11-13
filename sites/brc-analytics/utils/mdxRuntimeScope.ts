import * as mdxReact from "@mdx-js/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";

/**
 * MDX scope pinning the production JSX runtime.
 *
 * Catalog MDX (outbreak descriptions) is compiled with NODE_ENV=production, so
 * the compiled output calls jsx/jsxs. next-mdx-remote otherwise selects
 * react/jsx-dev-runtime whenever NODE_ENV !== "production", which exports
 * neither, throwing "_jsx is not a function" and 500ing every MDX page under
 * `next dev`. Supplying the production runtime here matches the compiled
 * output exactly; in production it is identical to what the library computes
 * itself.
 *
 * Spread after the serialized result's own scope so it cannot be shadowed:
 * `<MDXRemote {...result} scope={{ ...result.scope, ...MDX_RUNTIME_SCOPE }} />`
 */
export const MDX_RUNTIME_SCOPE = {
  opts: { ...mdxReact, Fragment, jsx, jsxs },
};
