"use server";

import { apiErrorAsValue } from "./errors";
import { apiPost } from "./requests";

export const checkUsernameExists = async (
  username: string,
): Promise<{ exists: boolean | undefined; error: string | undefined }> => {
  var error;
  const exists = await apiPost("auth/exists", { username: username })
    .catch((err) => {
      error = apiErrorAsValue(err);
    })
    .then((resp) => {
      if (resp && resp.status === 200) {
        return resp.data.exists;
      }
    });
  return { exists, error };
};
