export function load({ url }) {
    return {
        url: url.pathname,
    }
}
export const ssr = false;
export const prerender = true;
export const trailingSlash = 'always'


