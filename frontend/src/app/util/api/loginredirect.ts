import { ReadonlyURLSearchParams } from "next/navigation";

function reconstructURL(
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
) {
  var url = pathname + "?";
  searchParams.forEach((value, key) => {
    url = url + key + "=" + value + "&";
  });
  url = url.substring(0, url.length - 1);
  return url;
}

export function loginRedirectPath(
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
) {
  return (
    "/auth/login?from=" +
    encodeURIComponent(reconstructURL(pathname, searchParams))
  );
}
