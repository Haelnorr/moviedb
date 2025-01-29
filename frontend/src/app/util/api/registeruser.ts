"use server";
import { apiErrorAsValue } from "./errors";
import { apiPost } from "./requests";

import { logger } from "@/lib/logger";
const log = logger.child({ file: "util/api/registeruser.ts" });

export const registerUser = async (
  username: string,
  password: string,
  confirmPassword: string,
): Promise<{ registered: boolean; error: string | undefined }> => {
  var error;
  log.debug({ username: username }, "Attempting to register new user");
  const registered = await apiPost("auth/register", {
    username: username,
    password: password,
    confirm_password: confirmPassword,
  })
    .catch((err) => {
      error = apiErrorAsValue(err);
      log.warn(
        { username: username, error: error },
        "Failed to register new user",
      );
      return false;
    })
    .then((resp) => {
      if (resp && resp.status === 201) {
        log.debug({ username: username }, "New user successfully registered");
        return true;
      } else {
        log.warn(
          { username: username, response: resp.status },
          "Failed to register new user",
        );
        return false;
      }
    });
  return { registered, error };
};
