// useMutation.ts
import { useQueryContext } from "@/context/query-context";

export function useMutation<TParams, TResponse>(url: string, key: string) {
  const { runMutation } = useQueryContext();

  const mutationFn = (
    params: TParams,
    method: "POST" | "PUT" | "DELETE" = "POST"
  ) =>
    fetch(`/api/${url}`, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(params),
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json() as Promise<TResponse>;
    });

  const mutate = (params: TParams, method?: "POST" | "PUT" | "DELETE") =>
    runMutation(() => mutationFn(params, method), key);

  return { mutate };
}
