"use server";

import { logger } from "@/lib/logger";
import apiPutWithTokens from "./putwithtokens";
const log = logger.child({ file: "util/api/updatebio.ts" });

export default async function updateBio(
  newBio: string,
): Promise<{ error: string | undefined }> {
  log.debug({ newBio: newBio }, "User submitted change to bio");
  const { error } = await apiPutWithTokens("account/change_bio", {
    new_bio: newBio,
  });
  return { error };
}
