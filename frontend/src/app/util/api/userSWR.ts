"use client";
import useSWR, { KeyedMutator } from "swr";
import { User } from "@/util/types";
import apiGetWithTokens from "@/util/api/getwithtokens";

type AuthenticatedUserSWR = {
  user: User | undefined;
  mutateAuth: KeyedMutator<any>;
  loading: boolean;
  isFresh: boolean;
};

export default function useAuthenticatedUser(): AuthenticatedUserSWR {
  const { data, mutate, error } = useSWR("auth/@me", apiGetWithTokens, {
    // minutes between refresh * (seconds * milliseconds)
    refreshInterval: 60 * (60 * 1000),
  });
  const loading = !data && !error;

  var user: User | undefined;
  var isFresh = false;

  if (!loading && !error) {
    if (data!.error) {
      switch (data!.error) {
        case "Unauthorized":
          break;
        case "ServiceUnavailable":
          console.warn("There was an error connecting to the content service");
          break;
        case "Unknown":
          console.warn("Unknown error occured");
          break;
      }
    } else {
      user = data!.response;
      if (user!.fresh === "True") isFresh = true;
    }
  }
  return {
    user: user,
    mutateAuth: mutate,
    loading: loading,
    isFresh: isFresh,
  };
}
