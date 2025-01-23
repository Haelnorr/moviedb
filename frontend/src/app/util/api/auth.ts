import { apiPost, apiGet } from "@/util/api/requests";
import { getCookie } from "cookies-next";
import useSWR, { KeyedMutator } from "swr";
import { Unauthorized } from "@/util/api/errors";

export type Token = {
  access_token: string;
  access_expires: number;
  refresh_token: string;
  refresh_expires: number;
};

export type User = {
  id: number;
  username: string;
};

const fetcher = async (endpoint: string): Promise<any> => {
  const accessToken = await getCookie("access_token");
  if (!accessToken) {
    const refreshToken = await getCookie("refresh_token");
    if (!refreshToken) {
      throw new Unauthorized();
    } else {
      // TODO: call refresh token method
      console.log("refresh token present, refreshing");
    }
  }
  const response = await apiGet(endpoint, accessToken)
    .catch((err) => {
      if (err instanceof Unauthorized) {
        throw new Unauthorized();
      } else {
        throw new Error("An error has occured");
      }
    })
    .then((res) => {
      if (res) return res.data;
    });
  return response;
};

type AuthenticatedUserSWR = {
  user: User;
  mutateAuth: KeyedMutator<any>;
  loading: boolean;
  loggedOut: boolean;
};

export default function useAuthenticatedUser(): AuthenticatedUserSWR {
  const { data, mutate, error } = useSWR("auth/@me", fetcher, {
    refreshInterval: 15000, // TODO: change to something reasonable
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (error instanceof Unauthorized) return;
      if (retryCount >= 5) return;
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
  });
  const loading = !data && !error;
  const loggedOut = error && error instanceof Unauthorized;

  return {
    user: data as User,
    mutateAuth: mutate,
    loading: loading,
    loggedOut: loggedOut,
  };
}

export async function loginUser(
  username: string,
  password: string,
): Promise<any> {
  const user = {
    username: username,
    password: password,
  };
  return await apiPost("auth/login", user);
}
