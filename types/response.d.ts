interface DefaultResponseType<T = any> {
  success: boolean;
  message: string;
  data: T;
}

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface PaginationDataType<ItemType> {
  items: ItemType[];
  pagination: Pagination;
}

type PaginationResponse<T> = DefaultResponseType<PaginationDataType<T>>;
