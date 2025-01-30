"use server";
import { apiGet } from "@/util/api/requests";
import { deleteCookie, getCookie } from "cookies-next";
import { apiErrorAsValue } from "@/util/api/errors";
import { cookies } from "next/headers";
import refreshTokens from "@/util/api/refreshtokens";
import { logger } from "@/lib/logger";
const log = logger.child({ file: "util/api/getwithtokens.ts" });

// Make an get request to the backend api with the user tokens
// automatically performs refresh token check and updates tokens if valid
export default async function apiGetWithTokens(
  endpoint: string,
): Promise<{ response: any; error: string | undefined }> {
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

  // if refreshToken was set and failed to refresh, or neither token was set
  // then error will be set and we can skip authenticating with the backend
  var response;
  if (!error) {
    log.debug("Retreived access token from cookies, requesting authorization");
    response = await apiGet(endpoint, accessToken)
      .catch((err) => {
        error = apiErrorAsValue(err);
        log.info({ error: error }, "Error occured authorizing user");
      })
      .then((res) => {
        if (res) {
          log.debug({ user: res.data }, "User authorized successfully");
          return res.data;
        }
      });
  }
  if (error && error === "Unauthorized") {
    log.debug(
      "User authorization was rejected by the server or cookies were not found",
    );
    await deleteCookie("access_token", { cookies });
    await deleteCookie("refresh_token", { cookies });
  }
  return { response: response, error: error };
}
