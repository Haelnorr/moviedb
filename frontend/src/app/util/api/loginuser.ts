"use server";
import { apiPost } from "@/util/api/requests";
import type { Token } from "@/util/types";
import { setCookie } from "cookies-next";
import { apiErrorAsValue } from "@/util/api/errors";
import { cookies } from "next/headers";

import { logger } from "@/lib/logger";
const log = logger.child({ file: "util/api/loginuser.ts" });

export async function loginUser(
  username: string,
  password: string,
): Promise<{ login: boolean; error: string | undefined }> {
  const user = {
    username: username,
    password: password,
  };
  var error;
  var login = false;
  log.debug({ username: username }, "Attempting to login user");
  const loginToken = await apiPost("auth/login", user)
    .catch((err) => {
      error = apiErrorAsValue(err);
      log.info({ error: error }, "Failed to login user");
    })
    .then((resp) => {
      if (resp && resp.status === 200) {
        login = true;
        log.debug({ username: username }, "Login successful");
        return resp.data as Token;
      }
    });
  if (login && loginToken) {
    const cookieSecureMode: boolean = process.env.COOKIE_SECURE_MODE === "true";
    log.debug(
      { username: username, cookieSecureMode: cookieSecureMode },
      "Received auth tokens, setting cookies",
    );
    await setCookie("access_token", loginToken.access_token, {
      cookies,
      secure: cookieSecureMode,
      maxAge: loginToken.access_expires,
      sameSite: "lax",
      httpOnly: true,
    });
    await setCookie("refresh_token", loginToken.refresh_token, {
      cookies,
      secure: cookieSecureMode,
      maxAge: loginToken.refresh_expires,
      sameSite: "lax",
      httpOnly: true,
    });
  }
  return { login: login, error: error };
}
