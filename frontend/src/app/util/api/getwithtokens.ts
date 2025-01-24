"use server";
import { apiGet } from "@/util/api/requests";
import { deleteCookie, getCookie } from "cookies-next";
import { apiErrorAsValue } from "@/util/api/errors";
import { cookies } from "next/headers";
import { refreshTokens } from "@/util/api/refreshtokens";

// Make an get request to the backend api with the user tokens
// automatically performs refresh token check and updates tokens if valid
export const apiGetWithTokens = async (
  endpoint: string,
): Promise<{ response: any; error: string | undefined }> => {
  var error;
  var accessToken = await getCookie("access_token", { cookies });
  if (!accessToken) {
    const refreshToken = await getCookie("refresh_token", { cookies });
    if (!refreshToken) {
      error = "Unauthorized";
    } else {
      var { refreshError } = await refreshTokens(refreshToken);
      if (refreshError) {
        error = refreshError;
      } else {
        accessToken = await getCookie("access_token", { cookies });
      }
    }
  }

  // if refreshToken was set and failed to refresh, or neither token was set
  // then error will be set and we can skip authenticating with the backend
  var response;
  if (!error) {
    response = await apiGet(endpoint, accessToken)
      .catch((err) => {
        error = apiErrorAsValue(err);
      })
      .then((res) => {
        if (res) return res.data;
      });
  }
  if (error && error === "Unauthorized") {
    // access and refresh tokens have been tried if they exist, and
    // the backend has rejected them. delete the cookies so further
    // calls to this SWT dont result in more api requests
    await deleteCookie("access_token", { cookies });
    await deleteCookie("refresh_token", { cookies });
  }
  return { response: response, error: error };
};
