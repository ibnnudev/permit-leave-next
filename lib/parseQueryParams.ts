export function parseQueryParams(reqUrl: string) {
  const { searchParams } = new URL(reqUrl);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const filter = searchParams.get("filter")
    ? JSON.parse(searchParams.get("filter") as string)
    : undefined;

  const search = searchParams.get("search") || undefined;
  const order_by = searchParams.get("order_by") || undefined;
  const sorted_by = (searchParams.get("sorted_by") as "asc" | "desc") || "asc";

  const withParams = searchParams.get("with") || undefined;

  const pagination = searchParams.get("pagination") !== "false";

  return {
    page,
    limit,
    filter,
    search,
    order_by,
    sorted_by,
    withParams,
    pagination,
  };
}
