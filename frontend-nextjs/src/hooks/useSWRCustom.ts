"use client";
import useSWR from "swr";
import type { SWRConfiguration } from "swr";
import { fetchPublicData, fetchPrivateData } from "@/utils/fetcher/fetch-api";

const defaultSWRConfig: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnMount: true,
  revalidateOnReconnect: true,
  dedupingInterval: 20000,
  //shouldRetryOnError: true,
  revalidateOnFocus: false,
};

export function useSWRPublic<T = unknown>(
  url: string,
  options?: RequestInit,
  config?: SWRConfiguration
) {
  if (!url) { throw new Error("không có url!"); }

  const { data, error, isLoading } = useSWR<T>(
    url,
    () => fetchPublicData(url, options),
    config ? {
      ...config,
      ...defaultSWRConfig
    } : defaultSWRConfig
  );

  return { data, error, isLoading };
}


export function useSWRPrivate<T = unknown>(
  url: string,
  options?: RequestInit,
  config?: SWRConfiguration
) {
  console.log(url);

  const { isLoading, error, data } = useSWR<T>(
    url,
    () => fetchPrivateData(url, options),
    config ? {
      ...config,
      ...defaultSWRConfig
    } : defaultSWRConfig
  );
  return { isLoading, error, data };
}