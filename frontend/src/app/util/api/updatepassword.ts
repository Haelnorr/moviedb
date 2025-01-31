"use server";

import { logger } from "@/lib/logger";
import apiPutWithTokens from "./putwithtokens";
const log = logger.child({ file: "util/api/updatepassword.ts" });

export default async function updatePassword(
  newPassword: string,
  confirmPassword: string,
): Promise<{ error: string | undefined }> {
  log.debug("User submitted change to password");
  const { error } = await apiPutWithTokens("account/change_password", {
    new_password: newPassword,
    confirm_password: confirmPassword,
  });
  return { error };
}
