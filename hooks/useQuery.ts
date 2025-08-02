// useQuery.ts
import { useEffect } from "react";
import { useQueryContext } from "@/context/query-context";

export function useQuery<T>(url: string, key: string) {
  const { runFetch, getData } = useQueryContext();

  const fetcher = () =>
    fetch(`/api/${url}`, { credentials: "include" }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json() as Promise<T>;
    });

  useEffect(() => {
    runFetch(key, fetcher);
  }, [key, url]);

  return {
    data: getData(key) as T | undefined,
    refetch: () => runFetch(key, fetcher),
  };
}
