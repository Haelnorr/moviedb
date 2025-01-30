"use server";
import { apiGet } from "@/util/api/requests";
import { apiErrorAsValue } from "@/util/api/errors";
import { logger } from "@/lib/logger";
import { getTokenFromCookies, handleFailedAuth } from "./gettokenfromcookies";
const log = logger.child({ file: "util/api/getwithtokens.ts" });

export default async function apiGetWithTokens(
  endpoint: string,
): Promise<{ response: any | undefined; error: string | undefined }> {
  var { accessToken, error } = await getTokenFromCookies();
  var response;
  if (error) {
    handleFailedAuth(error);
    return { response: response, error: error };
  }
  log.debug(
    { endpoint: endpoint },
    "Retreived access token, making GET request to backend",
  );
  response = await apiGet(endpoint, accessToken)
    .catch((err) => {
      error = apiErrorAsValue(err);
      log.info(
        { endpoint: endpoint, error: error },
        "Error occured making GET request",
      );
    })
    .then((res) => {
      if (res) {
        log.debug(
          { endpoint: endpoint, response: res.status, data: res.data },
          "Successfully completed GET request",
        );
        return res.data;
      }
    });
  if (error) {
    handleFailedAuth(error);
  }
  return { response: response, error: error };
}
