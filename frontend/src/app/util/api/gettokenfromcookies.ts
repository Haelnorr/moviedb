import { logger } from "@/lib/logger";
import { deleteCookie, getCookie } from "cookies-next";
import { cookies } from "next/headers";
import refreshTokens from "./refreshtokens";
const log = logger.child({ file: "util/api/gettokenfromcookies.ts" });

export async function getTokenFromCookies(): Promise<{
  accessToken: string | undefined;
  error: string | undefined;
}> {
  var error;
  log.debug("Getting user access cookie");
  var accessToken = await getCookie("access_token", { cookies });
  if (!accessToken) {
    log.debug("No access token, getting refresh cookie");
    const refreshToken = await getCookie("refresh_token", { cookies });
    if (!refreshToken) {
      log.debug("No refresh token, user is Unauthorized");
      error = "Unauthorized";
    } else {
      log.debug("Refresh token present, requesting new tokens");
      var { refreshError } = await refreshTokens(refreshToken);
      if (refreshError) {
        error = refreshError;
        log.info({ error: error }, "Error refreshing tokens");
      } else {
        log.debug("Tokens refreshed, getting new access cookie");
        accessToken = await getCookie("access_token", { cookies });
      }
    }
  }
  return { accessToken, error };
}

export async function handleFailedAuth(error: string) {
  if (error === "Unauthorized") {
    log.debug({ error: error }, "Error occured authorizing the user");
    await deleteCookie("access_token", { cookies });
    await deleteCookie("refresh_token", { cookies });
  } else {
    log.debug({ error: error }, "Error occured making the request");
  }
}
