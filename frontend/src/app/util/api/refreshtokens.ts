"use server";
import { apiPost } from "@/util/api/requests";
import type { Token } from "@/util/types";
import { CookieValueTypes, setCookie } from "cookies-next";
import { apiErrorAsValue } from "@/util/api/errors";
import { cookies } from "next/headers";

export async function refreshTokens(refreshToken: CookieValueTypes): Promise<{
  refreshError: string | undefined;
}> {
  var refreshError;
  var refreshed = false;
  const newTokens = await apiPost("auth/refresh", {}, refreshToken)
    .catch((err) => {
      refreshError = apiErrorAsValue(err);
    })
    .then((resp) => {
      if (resp && resp.status === 200) {
        refreshed = true;
        return resp.data as Token;
      }
    });
  if (refreshed && newTokens) {
    await setCookie("access_token", newTokens.access_token, {
      cookies,
      secure: true,
      maxAge: newTokens.access_expires,
      sameSite: "lax",
      httpOnly: true,
    });
    await setCookie("refresh_token", newTokens.refresh_token, {
      cookies,
      secure: true,
      maxAge: newTokens.refresh_expires,
      sameSite: "lax",
      httpOnly: true,
    });
  }

  return { refreshError };
}
