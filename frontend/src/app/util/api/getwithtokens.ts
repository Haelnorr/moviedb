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
  log.debug("Retreived access token, making request to backend");
  response = await apiGet(endpoint, accessToken)
    .catch((err) => {
      error = apiErrorAsValue(err);
      log.info({ error: error }, "Error occured retreiving data");
    })
    .then((res) => {
      if (res) {
        log.debug(
          { data: res.data },
          "Data retrived successfully from backend",
        );
        return res.data;
      }
    });
  if (error) {
    handleFailedAuth(error);
  }
  return { response: response, error: error };
}
