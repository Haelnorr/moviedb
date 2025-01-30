"use server";
import { apiPut } from "@/util/api/requests";
import { apiErrorAsValue } from "@/util/api/errors";
import { logger } from "@/lib/logger";
import { getTokenFromCookies, handleFailedAuth } from "./gettokenfromcookies";
const log = logger.child({ file: "util/api/putwithtokens.ts" });

export default async function apiPutWithTokens(
  endpoint: string,
  input: Record<string, unknown>,
): Promise<{ error: string | undefined }> {
  var { accessToken, error } = await getTokenFromCookies();
  if (error) {
    handleFailedAuth(error);
    return { error: error };
  }
  log.debug(
    { endpoint: endpoint },
    "Retreived access token, making PUT request to backend",
  );
  await apiPut(endpoint, input, accessToken)
    .catch((err) => {
      error = apiErrorAsValue(err);
      log.info(
        { endpoint: endpoint, error: error },
        "Error occured making the PUT request",
      );
    })
    .then((res) => {
      if (res) {
        log.debug(
          { endpoint: endpoint, response: res.status },
          "Successfully completed PUT request",
        );
      }
    });
  if (error) {
    handleFailedAuth(error);
  }
  return { error: error };
}
