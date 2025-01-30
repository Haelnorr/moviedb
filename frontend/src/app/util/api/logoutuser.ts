"use server";

import { deleteCookie, getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { apiDelete } from "@/util/api/requests";
import { apiErrorAsValue } from "./errors";

import { logger } from "@/lib/logger";
const log = logger.child({ file: "util/api/logoutuser.ts" });

export default async function logoutUser(): Promise<{
  revokeAccessError: string | undefined;
  revokeRefreshError: string | undefined;
}> {
  var revokeAccessError;
  var revokeRefreshError;
  const accessToken = await getCookie("access_token", { cookies });
  const refreshToken = await getCookie("refresh_token", { cookies });

  if (accessToken) {
    log.debug("Requested access token to be revoked");
    await apiDelete("auth/logout", accessToken)
      .catch((err) => {
        revokeAccessError = apiErrorAsValue(err);
        log.warn({ error: revokeAccessError }, "Failed to revoke access token");
      })
      .then((resp) => {
        if (resp && resp.status === 200) {
          log.debug("Access token revoked, deleting clients local copy");
          deleteCookie("access_token", { cookies });
        }
      });
  }

  if (refreshToken) {
    log.debug("Requested refresh token to be revoked");
    await apiDelete("auth/logout", refreshToken)
      .catch((err) => {
        revokeRefreshError = apiErrorAsValue(err);
        log.warn(
          { error: revokeRefreshError },
          "Failed to revoke refresh token",
        );
      })
      .then((resp) => {
        if (resp && resp.status === 200) {
          log.debug("Refresh token revoked, deleting clients local copy");
          deleteCookie("refresh_token", { cookies });
        }
      });
  }

  return { revokeAccessError, revokeRefreshError };
}
