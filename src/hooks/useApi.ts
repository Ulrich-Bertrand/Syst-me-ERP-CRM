import { useState, useEffect } from 'react';
import { handleApiError } from '../lib/api-client';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
}

/**
 * Hook personnalisé pour les appels API
 * @param apiFunction - Fonction API à appeler
 * @param immediate - Exécuter immédiatement au montage (default: true)
 */
export function useApi<T>(
  apiFunction: () => Promise<{ data: T }>,
  immediate: boolean = true
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiFunction();
      setState({
        data: response.data,
        loading: false,
        error: null
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: handleApiError(error)
      });
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return {
    ...state,
    refetch: execute
  };
}

/**
 * Hook pour les mutations (POST, PUT, DELETE)
 */
interface UseMutationReturn<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | null>;
  data: TData | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<{ data: TData }>
): UseMutationReturn<TData, TVariables> {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null
  });

  const mutate = async (variables: TVariables): Promise<TData | null> => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const response = await mutationFn(variables);
      setState({
        data: response.data,
        loading: false,
        error: null
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({
        data: null,
        loading: false,
        error: errorMessage
      });
      throw new Error(errorMessage);
    }
  };

  const reset = () => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  };

  return {
    mutate,
    ...state,
    reset
  };
}

/**
 * Hook pour les listes paginées
 */
interface UsePaginatedApiReturn<T> extends UseApiState<T[]> {
  refetch: () => Promise<void>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export function usePaginatedApi<T>(
  apiFunction: (params: { page: number; limit: number }) => Promise<{
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>,
  initialPage: number = 1,
  initialLimit: number = 20
): UsePaginatedApiReturn<T> {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [state, setState] = useState<UseApiState<T[]> & { 
    pagination: UsePaginatedApiReturn<T>['pagination'] 
  }>({
    data: null,
    loading: true,
    error: null,
    pagination: null
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiFunction({ page, limit });
      setState({
        data: response.data,
        loading: false,
        error: null,
        pagination: response.pagination
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: handleApiError(error),
        pagination: null
      });
    }
  };

  useEffect(() => {
    execute();
  }, [page, limit]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    refetch: execute,
    setPage,
    setLimit
  };
}
