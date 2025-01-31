"use server";

import { logger } from "@/lib/logger";
import apiPutWithTokens from "./putwithtokens";
const log = logger.child({ file: "util/api/updateusername.ts" });

export default async function updateUsername(
  newUsername: string,
): Promise<{ error: string | undefined }> {
  log.debug({ newUsername: newUsername }, "User submitted change to username");
  const { error } = await apiPutWithTokens("account/change_username", {
    new_username: newUsername,
  });
  return { error };
}
