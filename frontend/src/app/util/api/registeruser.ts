"use server";
import { apiErrorAsValue } from "./errors";
import { apiPost } from "./requests";

export const registerUser = async (
  username: string,
  password: string,
  confirmPassword: string,
): Promise<{ registered: boolean; error: string | undefined }> => {
  var error;
  const registered = await apiPost("auth/register", {
    username: username,
    password: password,
    confirm_password: confirmPassword,
  })
    .catch((err) => {
      error = apiErrorAsValue(err);
      return false;
    })
    .then((resp) => {
      if (resp && resp.status === 201) {
        return true;
      } else {
        return false;
      }
    });
  return { registered, error };
};
