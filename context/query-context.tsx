"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type QueryMap = Record<string, any>;
type FetchMap = Record<string, () => Promise<any>>;

type QueryContextType = {
  data: QueryMap;
  runFetch: (key: string, fn: () => Promise<any>) => Promise<void>;
  getData: (key: string) => any;
  runMutation: (mutationFn: () => Promise<any>, key: string) => Promise<void>;
};

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [dataMap, setDataMap] = useState<QueryMap>({});
  const [fetchMap, setFetchMap] = useState<FetchMap>({});

  const runFetch = useCallback(async (key: string, fn: () => Promise<any>) => {
    setFetchMap((prev) => ({
      ...prev,
      [key]: fn,
    }));

    const result = await fn();
    setDataMap((prev) => ({
      ...prev,
      [key]: result,
    }));
  }, []);

  const getData = useCallback(
    (key: string) => {
      return dataMap[key];
    },
    [dataMap]
  );

  const runMutation = useCallback(
    async (mutationFn: () => Promise<any>, key: string) => {
      await mutationFn();

      const refetch = fetchMap[key];
      if (refetch) {
        const result = await refetch();
        setDataMap((prev) => ({
          ...prev,
          [key]: result,
        }));
      } else {
        console.warn(`No fetch function found for key: ${key}`);
      }
    },
    [fetchMap]
  );

  return (
    <QueryContext.Provider
      value={{ data: dataMap, runFetch, getData, runMutation }}
    >
      {children}
    </QueryContext.Provider>
  );
};

export const useQueryContext = () => {
  const context = useContext(QueryContext);
  if (!context)
    throw new Error("useQueryContext must be used within a QueryProvider");
  return context;
};
