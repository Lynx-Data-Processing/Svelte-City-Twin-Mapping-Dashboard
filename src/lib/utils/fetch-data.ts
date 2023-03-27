import axios from 'axios';
import {
  buildWebStorage, defaultHeaderInterpreter, defaultKeyGenerator, setupCache
} from 'axios-cache-interceptor';

//* Simple utility function for axios.
//* Used by smarter-api, and loading city data
export const axiosUtility = async (config: object) => {
  try {
    const promise = await axios(config);
    return promise;
  } catch (error: any) {
    if (error.response) {
      return error.response.status;
    } if (error.request) {
      return error.request;
    }
    return error.message;
  }
};

export const axiosBlobUtility = async (url: string) => {

  var data = JSON.stringify({
    "video_link": url
  });


  let config = {
    method: 'post',
    url: 'http://127.0.0.1:8000/machinelearning',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  return await axios(config)
    .then((response) => {


    })
    .catch((error) => {
      console.log(error);
    });

}

export const axiosGetUtility = async (url: string) => {
  try {
    const config = {
      method: 'get',
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const promise = await axios(config);
    return promise;
  } catch (error: any) {
    if (error.response) {
      return error.response.status;
    } if (error.request) {
      return error.request;
    }
    return error.message;
  }
};

export const axiosCacheGetUtility = async (url: string) => {
  const call = setupCache(
    // axios instance
    axios.create(),

    // All options with their default values
    {
      // The storage to save the cache data. There are more available by default.
      //
      // https://axios-cache-interceptor.js.org/#/pages/storages
      storage: buildWebStorage(localStorage),

      // The mechanism to generate a unique key for each request.
      //
      // https://axios-cache-interceptor.js.org/#/pages/request-id
      generateKey: defaultKeyGenerator,

      // The mechanism to interpret headers (when cache.interpretHeader is true).
      //
      // https://axios-cache-interceptor.js.org/#/pages/global-configuration?id=headerinterpreter
      headerInterpreter: defaultHeaderInterpreter,
    },
  );

  const response = await call.get(url, {
    // All per-request options lives under the `cache` property.
    cache: {
      // The time until the cached value is expired in milliseconds.
      ttl: 1000 * 60 * 60 * 24 * 10,

      // If the request should configure the cache based on some standard cache headers, Like
      // Cache-Control, Expires and so on...
      interpretHeader: false,

      // All methods that should activate cache behaviors. If the method is not in this list,
      // it will be completely ignored.
      methods: ['get'],

      // A predicate object that will be used in each request to determine if the request can
      // be cached or not.
      //
      // https://axios-cache-interceptor.js.org/#/pages/per-request-configuration?id=cachecachepredicate
      cachePredicate: {
        statusCheck: (status) => status >= 200 && status < 400,
      },

      // All requests that should have their cache updated once this request is resolved.
      // Normally used to update similar requests or records with newer data.
      //
      // https://axios-cache-interceptor.js.org/#/pages/per-request-configuration?id=cacheupdate
      update: {},

      // If the support for ETag and If-None-Match headers is active. You can use a string to
      // force a custom value for the ETag response.
      //
      etag: false,

      // If we should interpret the If-Modified-Since header when generating a TTL value.
      modifiedSince: false,

      // If we should return a old (possibly expired) cache when the current request failed
      // to get a valid response because of a network error, invalid status or etc.
      staleIfError: false,
    },
  });

  return response;
};

export default axiosUtility;
