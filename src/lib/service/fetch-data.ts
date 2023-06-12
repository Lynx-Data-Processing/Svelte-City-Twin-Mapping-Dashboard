import axios from 'axios';
import {
  buildWebStorage, defaultHeaderInterpreter, defaultKeyGenerator, setupCache
} from 'axios-cache-interceptor';
export const axiosCacheGetUtility = async (url: string) => {
  const call = setupCache(
    axios.create(),
    {
      storage: buildWebStorage(localStorage),
      generateKey: defaultKeyGenerator,
      headerInterpreter: defaultHeaderInterpreter,
    },
  );
  const response = await call.get(url, {
    cache: {
      ttl: 1000 * 60 * 60 * 24 * 10,
      interpretHeader: false,
      methods: ['get'],

      cachePredicate: {
        statusCheck: (status) => status >= 200 && status < 400,
      },

      update: {},
      etag: false,
      modifiedSince: false,
      staleIfError: false,
    },
  });
  return response;
};
