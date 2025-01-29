"use server";

import { apiErrorAsValue } from "./errors";
import { apiPost } from "./requests";

import { logger } from "@/lib/logger";
const log = logger.child({ file: "util/api/checkusernameexists.ts" });

export const checkUsernameExists = async (
  username: string,
): Promise<{ exists: boolean | undefined; error: string | undefined }> => {
  var error;
  log.debug({ username: username }, "Checking user exists");
  const exists = await apiPost("auth/exists", { username: username })
    .catch((err) => {
      error = apiErrorAsValue(err);
      log.warn(
        { error: error, username: username },
        "An error occcured on lookup for the user",
      );
    })
    .then((resp) => {
      if (resp && resp.status === 200) {
        log.debug(
          { username: username, result: resp.data.exists },
          "Username checked",
        );
        return resp.data.exists;
      }
    });
  return { exists, error };
};
