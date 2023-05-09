import axios from "axios";
import { fetchAuth } from "../utils/fetch-auth";
import { PUBLIC_NODE_BACKEND_URL } from '$env/static/public';

// root smarterAI enpoint

// get all devices from smarterAI
export const getDevices = async () => {

    const config = {
        method: 'get',
        url: `${PUBLIC_NODE_BACKEND_URL}/devices`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${fetchAuth()}`,
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
            'Authorization': `${fetchAuth()}`,
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
        deviceId: deviceId,
    });
    
    const config = {
        method: 'get',
        url: `${PUBLIC_NODE_BACKEND_URL}/events?${params.toString()}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${fetchAuth()}`,
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

// get videos for a specific device id
export const getVideos = async (endpointId: string, startTime: number, endTime: number) => {

    const params = new URLSearchParams({
        endpointId: endpointId,
        startTime: `${startTime}`,
        endTime: `${endTime}`,
    });
    
    const config = {
        method: 'get',
        url: `${PUBLIC_NODE_BACKEND_URL}/video?${params.toString()}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${fetchAuth()}`,
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

// get sensors for a specific video id
export const getSensor = async (
    endpointId: string, 
    startTime: number, 
    endTime: number,
    sensorType: string,
    processType: string,
    ) => {

    const params = new URLSearchParams({
        endpointId: endpointId,
        startTime: startTime.toString(),
        endTime: endTime.toString(),
    });
    
    const config = {
        method: 'get',
        url: `${PUBLIC_NODE_BACKEND_URL}/video?${params.toString()}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${fetchAuth()}`,
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