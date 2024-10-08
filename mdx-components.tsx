import { Link } from "@databiosphere/findable-ui/lib/components/Links/components/Link/link";
import { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: ({ children, href }) => Link({ label: children, url: href ?? "" }),
  };
}
