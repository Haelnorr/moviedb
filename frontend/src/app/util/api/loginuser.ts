"use server";
import { apiPost } from "@/util/api/requests";
import type { Token } from "@/util/types";
import { setCookie } from "cookies-next";
import { apiErrorAsValue } from "@/util/api/errors";
import { cookies } from "next/headers";

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
  const loginToken = await apiPost("auth/login", user)
    .catch((err) => {
      error = apiErrorAsValue(err);
    })
    .then((resp) => {
      if (resp && resp.status === 200) {
        login = true;
        return resp.data as Token;
      }
    });
  if (login && loginToken) {
    await setCookie("access_token", loginToken.access_token, {
      cookies,
      // TODO: change to use envar so can be set to true for prod
      secure: false,
      maxAge: loginToken.access_expires,
      sameSite: "lax",
      httpOnly: true,
    });
    await setCookie("refresh_token", loginToken.refresh_token, {
      cookies,
      // TODO: change to use envar so can be set to true for prod
      secure: false,
      maxAge: loginToken.refresh_expires,
      sameSite: "lax",
      httpOnly: true,
    });
  }
  return { login: login, error: error };
}
