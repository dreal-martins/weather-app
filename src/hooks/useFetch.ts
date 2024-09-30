import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";

interface ApiResponse {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  description?: string;
  timestamp?: string;
  isError?: boolean;
  isSuccess?: boolean;
  error?: string;
  error_description?: string;
  message?: string;
}

interface FetchState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface RetryConfig {
  retries?: number;
  retryDelay?: number;
}

const useFetch = <T>() => {
  const [fetchState, setFetchState] = useState<FetchState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const fetchData = useCallback(
    async (
      apiCall: () => Promise<T>,
      retryConfig: RetryConfig = { retries: 3, retryDelay: 1000 }
    ) => {
      const attemptFetch = async (): Promise<void> => {
        setFetchState((prevState) => ({ ...prevState, loading: true }));

        try {
          const data = await apiCall();
          setFetchState({ data, error: null, loading: false });
        } catch (err) {
          if (axios.isAxiosError(err)) {
            const error = err as AxiosError<ApiResponse>;
            let errorMessage = "An error occurred";

            if (error.code === "ECONNABORTED") {
              errorMessage = "Request timed out";
            } else if (!error.response) {
              errorMessage = "Network error";
            } else {
              const responseData = error.response.data;

              if (responseData) {
                if (responseData.error && responseData.error_description) {
                  errorMessage = responseData.error_description;
                } else {
                  errorMessage = responseData.message || errorMessage;
                }
              }
            }

            setFetchState({ data: null, error: errorMessage, loading: false });
          } else {
            setFetchState({
              data: null,
              error: "An unexpected error occurred",
              loading: false,
            });
          }
        }
      };

      attemptFetch();
    },
    []
  );

  return { ...fetchState, fetchData };
};

export default useFetch;
