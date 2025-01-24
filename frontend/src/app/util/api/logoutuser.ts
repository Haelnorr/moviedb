"use server";

import { deleteCookie, getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { apiDelete } from "@/util/api/requests";
import { apiErrorAsValue } from "./errors";

export const logoutUser = async (): Promise<{
  revokeAccessError: string | undefined;
  revokeRefreshError: string | undefined;
}> => {
  var revokeAccessError;
  var revokeRefreshError;
  const accessToken = await getCookie("access_token", { cookies });
  const refreshToken = await getCookie("refresh_token", { cookies });

  if (accessToken) {
    await apiDelete("auth/logout", accessToken)
      .catch((err) => {
        revokeAccessError = apiErrorAsValue(err);
      })
      .then((resp) => {
        if (resp && resp.status === 200) {
          deleteCookie("access_token", { cookies });
        }
      });
  }

  if (refreshToken) {
    await apiDelete("auth/logout", refreshToken)
      .catch((err) => {
        console.log(err);
        revokeRefreshError = apiErrorAsValue(err);
      })
      .then((resp) => {
        if (resp && resp.status === 200) {
          deleteCookie("refresh_token", { cookies });
        }
      });
  }

  return { revokeAccessError, revokeRefreshError };
};
