/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable import/default */
/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
import Axios, { AxiosInstance, AxiosPromise } from 'axios';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
} from 'react';
import { useAuth } from './AuthProvider';

export interface IApiClientContext {
  axios: AxiosInstance;
  api: <T extends unknown>(
    axiosPromise: AxiosPromise<T>,
  ) => Promise<T>;
}

const ApiClientContext = createContext<IApiClientContext>({} as any);

export const ApiClientProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const api = useCallback(
    async <T extends unknown>(axiosPromise: AxiosPromise<T>) =>
      axiosPromise.then(({ data }) => data),
    [],
  );

  const { accessToken } = useAuth();

  console.log({ accessToken });

  const value = {
    axios: Axios.create({
      baseURL: 'http://localhost:8000',
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
    api,
  };
  return (
    <ApiClientContext.Provider value={value}>
      {children}
    </ApiClientContext.Provider>
  );
};

export const useApiClient = () => {
  const context = useContext(ApiClientContext);
  if (!context) {
    throw new Error(
      'useApiClient must be used within ApiClientProvider',
    );
  }

  return context;
};
