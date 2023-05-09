import axios from "axios";
import { PUBLIC_NODE_BACKEND_URL } from '$env/static/public';

// root smarterAI enpoint

// get all devices from smarterAI
export const getDevices = async () => {

    const config = {
        method: 'get',
        url: `${PUBLIC_NODE_BACKEND_URL}/devices`,
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
        } 
        if (error.request) {
            return error.request;
        }
        return error.message;
    }
};

// get information for a specific device id
export const getInfo = async (endpointId: string) => {

    const params = new URLSearchParams({
        endpointId: endpointId,
    });
    
    const config = {
        method: 'get',
        url: `${PUBLIC_NODE_BACKEND_URL}/info?${params.toString()}`,
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
        } 
        if (error.request) {
            return error.request;
        }
        return error.message;
    }
}

// get events for a specific device id
export const getEvents = async (deviceId: string) => {

    const params = new URLSearchParams({
        endpointId: deviceId,
    });
    
    const config = {
        method: 'get',
        url: `${PUBLIC_NODE_BACKEND_URL}/events?${params.toString()}`,
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
        } 
        if (error.request) {
            return error.request;
        }
        return error.message;
    }
}

// video endpoint

// sensors endpoint