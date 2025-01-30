"use server";
import axios, { AxiosError } from "axios";
import { logger } from "@/lib/logger";
const log = logger.child({ file: "util/api/requests.ts" });
import {
  APIError,
  BadRequest,
  Forbidden,
  InternalServerError,
  MethodNotAllowed,
  NotFound,
  ServiceUnavailable,
  Unauthorized,
  UnprocessableContent,
} from "@/util/api/errors";

const apiURI = process.env.API_URL;

function handleError(err: AxiosError) {
  if (err) {
    if (err.code === "ECONNREFUSED" || err.code === "ERR_NETWORK") {
      log.error(
        { error: err },
        "A request was made to the backend but it could not be reached",
      );
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
        case 405:
          throw new MethodNotAllowed();
        case 422:
          throw new UnprocessableContent();
        case 500:
          log.warn(
            { error: err.response },
            "A request was made to the backend that resulted in an Internal server error.",
          );
          throw new InternalServerError();
        default:
          log.warn(
            { error: err.response },
            "A request was made to the backend that resulted in an unhandled API error",
          );
          throw new APIError(`Unhandled: ${err.response}`);
      }
    } else {
      log.warn(
        { error: err },
        "A request was made to the backend that resulted in an unhandled error",
      );
      throw err;
    }
  }
}

export async function apiPost(
  endpoint: string,
  input: Record<string, unknown> = {},
  token: string | undefined = undefined,
): Promise<any> {
  const requestURL = apiURI + endpoint;
  var response;
  if (token) {
    response = await axios
      .post(requestURL, input, {
        headers: {
          Authorization: `Bearer ${token}`,
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

export async function apiPut(
  endpoint: string,
  input: Record<string, unknown> = {},
  token: string | undefined = undefined,
): Promise<any> {
  const requestURL = apiURI + endpoint;
  var response;
  if (token) {
    response = await axios
      .put(requestURL, input, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => handleError(err));
  } else {
    response = await axios
      .put(requestURL, input)
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

export async function apiDelete(
  endpoint: string,
  accessToken: string | undefined = undefined,
): Promise<any> {
  const requestURL = apiURI + endpoint;
  var response;
  response = await axios
    .delete(requestURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .catch((err) => handleError(err));
  return response;
}
