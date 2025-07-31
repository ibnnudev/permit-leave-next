import { useQueryContext } from "@/context/query-context";
import { useEffect } from "react";

export const useQuery = <TParams = any>(url: string, key: string) => {
  const { runFetch, getData, runMutation } = useQueryContext();

  const fetcher = async (
    params?: any,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET"
  ) => {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (params && method !== "GET") {
      options.body = JSON.stringify(params);
    }

    const res = await fetch(`/api/${url}`, options);

    if (!res.ok) throw new Error(`Fetch error: ${res.statusText}`);
    return await res.json();
  };

  useEffect(() => {
    runFetch(key, () => fetcher(undefined));
  }, [key, url]); // rerun jika url atau key berubah

  const mutation = async (
    params?: TParams,
    method: "POST" | "PUT" | "DELETE" = "POST"
  ) => {
    await runMutation(
      () => fetcher(params, method),
      key,
      () => fetcher(undefined)
    );
  };

  return {
    fetch,
    mutation,
    data: getData(key),
  };
};
