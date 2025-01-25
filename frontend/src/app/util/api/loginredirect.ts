import { ReadonlyURLSearchParams } from "next/navigation";

function reconstructURL(
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
) {
  var url = pathname + "?";
  const from = searchParams.get("from");
  if (from) {
    url = decodeURIComponent(from);
  } else {
    searchParams.forEach((value, key) => {
      url = url + key + "=" + value + "&";
    });
    url = url.substring(0, url.length - 1);
  }
  return url;
}

export function loginRedirectPath(
  page: "login" | "register",
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
) {
  const url = reconstructURL(pathname, searchParams);
  if (url === "/" || url === "/auth/login" || url === "/auth/register") {
    return `/auth/${page}`;
  } else {
    return `/auth/${page}?from=${encodeURIComponent(url)}`;
  }
}
