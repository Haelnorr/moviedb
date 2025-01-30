"use server";
import { apiPost } from "@/util/api/requests";
import type { Token } from "@/util/types";
import { CookieValueTypes, setCookie } from "cookies-next";
import { apiErrorAsValue } from "@/util/api/errors";
import { cookies } from "next/headers";
import { logger } from "@/lib/logger";
const log = logger.child({ file: "util/api/refreshtokens.ts" });

export default async function refreshTokens(
  refreshToken: CookieValueTypes,
): Promise<{
  refreshError: string | undefined;
}> {
  var refreshError;
  var refreshed = false;
  log.debug("Requested new tokens via refresh");
  const newTokens = await apiPost("auth/refresh", {}, refreshToken)
    .catch((err) => {
      refreshError = apiErrorAsValue(err);
      log.info({ error: refreshError }, "Failed to refresh tokens");
    })
    .then((resp) => {
      if (resp && resp.status === 200) {
        refreshed = true;
        log.debug("Tokens refreshed");
        return resp.data as Token;
      }
    });
  if (refreshed && newTokens) {
    const cookieSecureMode: boolean = process.env.COOKIE_SECURE_MODE === "true";
    log.debug(
      { cookieSecureMode: cookieSecureMode },
      "Received new tokens, setting cookies",
    );
    await setCookie("access_token", newTokens.access_token, {
      cookies,
      secure: cookieSecureMode,
      maxAge: newTokens.access_expires,
      sameSite: "lax",
      httpOnly: true,
    });
    await setCookie("refresh_token", newTokens.refresh_token, {
      cookies,
      secure: cookieSecureMode,
      maxAge: newTokens.refresh_expires,
      sameSite: "lax",
      httpOnly: true,
    });
  }

  return { refreshError };
}
