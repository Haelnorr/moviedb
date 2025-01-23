import axios, { AxiosError } from "axios";
import {
  APIError,
  BadRequest,
  Forbidden,
  InternalServerError,
  NotFound,
  ServiceUnavailable,
  Unauthorized,
  UnprocessableContent,
} from "@/util/api/errors";

// TODO: change to using an envar
const apiURI: string = "http://127.0.0.1:5000/";

function handleError(err: AxiosError) {
  if (err) {
    if (err.code === "ECONNREFUSED" || err.code === "ERR_NETWORK") {
      throw new ServiceUnavailable();
    } else if (err.response) {
      switch (err.response.status) {
        case 400:
          throw new BadRequest();
        case 401:
          throw new Unauthorized();
        case 403:
          throw new Forbidden();
        case 404:
          throw new NotFound();
        case 422:
          throw new UnprocessableContent();
        case 500:
          throw new InternalServerError();
        default:
          throw new APIError(`Unhandled: ${JSON.stringify(err.response)}`);
      }
    } else {
      throw err;
    }
  }
}

export async function apiPost(
  endpoint: string,
  input: Record<string, unknown> = {},
  accessToken: string | undefined = undefined,
): Promise<any> {
  const requestURL = apiURI + endpoint;
  var response;
  if (accessToken) {
    response = await axios
      .post(requestURL, input, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .catch((err) => handleError(err));
  } else {
    response = await axios
      .post(requestURL, input)
      .catch((err) => handleError(err));
  }
  return response;
}

export async function apiGet(
  endpoint: string,
  accessToken: string | undefined = undefined,
): Promise<any> {
  const requestURL = apiURI + endpoint;
  var response;
  if (accessToken) {
    response = await axios
      .get(requestURL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .catch((err) => handleError(err));
  } else {
    response = await axios.get(requestURL).catch((err) => handleError(err));
  }
  return response;
}
