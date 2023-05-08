import axios from "axios";

// root smarterAI enpoint

// get all devices from smarterAI
export const getDevices = async () => {
  
    const config = {
      method: 'get',
      url: `${NODE_BACKEND_URL}/devices`,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
  
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


// info endpoint

// events endpoint

// video endpoint

// sensors endpoint