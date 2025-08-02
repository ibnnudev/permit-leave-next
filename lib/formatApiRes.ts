export const formatApiResponse = (
  data: any,
  pagination?: any | null,
  success?: boolean | null,
  message?: string | null
) => {
  const isArray = Array.isArray(data);

  const response = isArray
    ? {
        success: success || true,
        message: message || "Success Fetching Data",
        data: { items: data, pagination: pagination },
      }
    : {
        success: success || true,
        message: message || "Success Fetching Data",
        data: data,
      };

  return response;
};

export function handleError(error: any) {
  return {
    error: "Failed to fetch data",
    message: (error as Error).message,
    details: error,
  };
}
